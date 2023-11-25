import Button from "@mui/material/Button";
import {useCart} from 'boundless-commerce-components/dist/cart';
import {useCallback, useState} from "react";
import {apiClient} from "@/lib/api";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Snackbar from '@mui/material/Snackbar';
import {useRouter} from 'next/navigation'
import CustomCheckoutDialog from "@/components/customCheckoutDialog";

export default function CheckoutButtons() {
	const {isLoading, error, clearError, onBoundlessCheckoutClicked, onCustomerCheckoutClicked,
		showCustomCheckout, handleCloseCustomCheckout
	} = useBtnsHandlers();

	return (
		<>
			<div className={'d-flex justify-content-end'} style={{gap: '20px'}}>
				<Button variant={'contained'} size={'large'} disabled={isLoading} onClick={onBoundlessCheckoutClicked}>
					Boundless Checkout Example
				</Button>
				<Button
					variant={'contained'}
					size={'large'}
					disabled={isLoading}
					onClick={onCustomerCheckoutClicked}
					color="success"
				>
					Custom Checkout Example
				</Button>
			</div>
			<Snackbar
				open={Boolean(error)}
				autoHideDuration={6000}
				onClose={clearError}
				anchorOrigin={{vertical: 'top', horizontal: 'right'}}
			>
				<Alert severity="error">
					<AlertTitle>Error</AlertTitle>
					{error}
				</Alert>
			</Snackbar>
			<CustomCheckoutDialog open={showCustomCheckout} onClose={handleCloseCustomCheckout} />
		</>
	);
}

const useBtnsHandlers = () => {
	const {cartId} = useCart();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string|undefined>();
	const clearError = useCallback(() => setError(undefined), [setError]);
	const router = useRouter();
	const [showCustomCheckout, setShowCustomCheckout] = useState<boolean>(false);

	const validateCart = useCallback(() => {
		if (!cartId) {
			throw new Error('Cant validate cartId is empty');
		}

		setIsLoading(true);
		clearError();
		return apiClient.createRequest().post(`/orders/cart/${cartId}/validate`)
			.then(() => true)
			.catch((e) => {
				if (e.response && Array.isArray(e.response.data) && e.response.data[0]?.message) {
					setError(e.response.data[0].message as string);
				}
			})
			.finally(() => setIsLoading(false))
		;
	}, []);

	const onBoundlessCheckoutClicked = useCallback(() => {
		validateCart().then((result) => {
			if (result === true) {
				router.push('/boundless-checkout/info');
			}
		})
	}, []);

	const onCustomerCheckoutClicked = useCallback(() => {
		validateCart().then((result) => {
			if (result === true) {
				setShowCustomCheckout(true);
			}
		})
	}, []);

	const handleCloseCustomCheckout = useCallback(() => setShowCustomCheckout(false), []);

	return {
		validateCart,
		isLoading,
		error,
		clearError,
		onBoundlessCheckoutClicked,
		onCustomerCheckoutClicked,
		showCustomCheckout,
		handleCloseCustomCheckout
	}
};
