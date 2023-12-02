import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import OrderForm from '@/components/checkout/customCheckoutDialog/orderForm';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
	'& .MuiDialogContent-root': {
		padding: theme.spacing(2),
	},
	'& .MuiDialogActions-root': {
		padding: theme.spacing(1),
	},
}));

export default function CustomCheckoutDialog({open, onClose}: {open: boolean, onClose: (e: {}, reason?: string) => void}) {
	return (
		<BootstrapDialog onClose={onClose} open={open} fullWidth={true} maxWidth={'sm'}>
			<DialogTitle>{'Custom Checkout'}</DialogTitle>
			<IconButton
				aria-label="close"
				onClick={onClose}
				sx={{
					position: 'absolute',
					right: 8,
					top: 8,
					color: (theme) => theme.palette.grey[500],
				}}
			>
				<CloseIcon />
			</IconButton>
			<DialogContent>
				<OrderForm />
			</DialogContent>
		</BootstrapDialog>
	);
}

