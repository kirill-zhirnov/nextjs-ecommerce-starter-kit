'use client';

import {IAddToCartResponse} from 'boundless-api-client';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

export default function SelectVariantDialog({open, onClose, neededSelectVariant}: IProps) {
	if (neededSelectVariant) {
		console.log(neededSelectVariant);
	}

	return (
		<Dialog onClose={onClose} open={open}>
			<DialogTitle>Please Select variant</DialogTitle>
			<DialogContent>
				<p>Not implemented. This scenario is not supposed to happen in this template</p>
			</DialogContent>
		</Dialog>
	);
}

interface IProps {
	open: boolean,
	onClose: () => void,
	neededSelectVariant?: IAddToCartResponse
}
