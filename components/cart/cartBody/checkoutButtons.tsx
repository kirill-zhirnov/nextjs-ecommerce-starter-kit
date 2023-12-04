import Button from '@mui/material/Button';
import {useCart} from 'boundless-commerce-components/dist/client';
import {useCallback, useState} from 'react';
import {apiClient} from '@/lib/api';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Snackbar from '@mui/material/Snackbar';
import {useRouter} from 'next/navigation';
import CustomCheckoutDialog from '@/components/checkout/customCheckoutDialog';

export default function CheckoutButtons() {
	const {isLoading, error, clearError, onBoundlessCheckoutClicked, onCustomerCheckoutClicked,
		showCustomCheckout, handleCloseCustomCheckout, onStripeCheckoutClicked
	} = useBtnsHandlers();

	return (
		<div className={'bg-light p-3'}>
			<h4 className={'mb-4'}>Example of Checkouts:</h4>
			<div className={'d-flex justify-content-end flex-wrap'} style={{gap: '20px'}}>
				<Button
					variant={'contained'}
					size={'large'}
					disabled={isLoading}
					onClick={onStripeCheckoutClicked}
					color="primary"
				>
					Stripe Checkout
				</Button>
				<Button
					variant={'contained'}
					size={'large'}
					disabled={isLoading}
					onClick={onCustomerCheckoutClicked}
					color="success"
				>
					Custom Checkout
				</Button>
				<Button
					variant={'contained'}
					size={'large'}
					disabled={isLoading}
					onClick={onBoundlessCheckoutClicked}
					color={'secondary'}
				>
					Boundless Checkout
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
		</div>
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
	}, [cartId, clearError]);

	const onBoundlessCheckoutClicked = useCallback(() => {
		validateCart().then((result) => {
			if (result === true) {
				router.push('/boundless-checkout/info');
			}
		});
	}, [validateCart, router]);

	const onCustomerCheckoutClicked = useCallback(() => {
		validateCart().then((result) => {
			if (result === true) {
				setShowCustomCheckout(true);
			}
		});
	}, [validateCart, setShowCustomCheckout]);

	const onStripeCheckoutClicked = useCallback(() => {
		validateCart().then((result) => {
			if (result === true) {
				router.push('/stripe/checkout');
			}
		});
	}, [validateCart, router]);

	const handleCloseCustomCheckout = useCallback(() => setShowCustomCheckout(false), [setShowCustomCheckout]);

	return {
		validateCart,
		isLoading,
		error,
		clearError,
		onBoundlessCheckoutClicked,
		onCustomerCheckoutClicked,
		showCustomCheckout,
		handleCloseCustomCheckout,
		onStripeCheckoutClicked
	};
};
