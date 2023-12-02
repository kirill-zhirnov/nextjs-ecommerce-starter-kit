'use client';

import {IAddToCartResponse} from 'boundless-api-client';
import {VwItem} from 'boundless-commerce-components';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import Link from 'next/link';
import {apiClient} from '@/lib/api';
import {useRouter} from 'next/navigation';

export default function ProductAddedDialog({open, onClose, addedToCart}: IProps) {
	const router = useRouter();

	return (
		<Dialog onClose={onClose} open={open}>
			<DialogTitle>You have successfully added this item</DialogTitle>
			<DialogContent>
				{addedToCart?.added?.item &&
					<>
						<div style={{maxWidth: '450xp'}}>
							<VwItem
								item={addedToCart?.added?.item}
								apiClient={apiClient}
							/>
						</div>
					</>
				}
				<div className={'d-flex mt-5'}>
					<Button onClick={onClose} variant="outlined">Continue Shopping</Button>
					<Button
						onClick={() => {
							router.push('/cart');
							onClose();
						}}
						className={'ms-auto'}
						// component={Link}
						// href={'/cart'}
						variant={'contained'}
					>Order Now</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

interface IProps {
	open: boolean,
	onClose: () => void,
	addedToCart?: IAddToCartResponse
}
