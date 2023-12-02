import {Dispatch, SetStateAction, useCallback, ChangeEvent} from 'react';
import IconButton from '@mui/material/IconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import TextField from '@mui/material/TextField';
import clsx from 'clsx';

export default function SpecifyQty({qty, setQty, disabled = false, className}: IProps) {
	const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => setQty(parseInt(e.target.value) || 1), [setQty]);
	const onBtnClick = useCallback((diff: number) => setQty((prevState) => prevState + diff), [setQty]);

	return (
		<div className={clsx('d-flex', className)} style={{maxWidth: '160px'}}>
			<IconButton
				size={'small'}
				disabled={qty <= 1 || disabled}
				onClick={onBtnClick.bind(null, -1)}
			>
				<RemoveCircleOutlineIcon />
			</IconButton>
			<TextField
				size={'small'}
				inputProps={{
					min: 1,
					className: 'text-center'
				}}
				type={'number'}
				value={qty}
				onChange={onChange}
			/>
			<IconButton
				size={'small'}
				onClick={onBtnClick.bind(null, 1)}
				disabled={disabled}
			>
				<AddCircleOutlineIcon />
			</IconButton>
		</div>
	);
}

interface IProps {
	qty: number,
	setQty: Dispatch<SetStateAction<number>>,
	disabled?: boolean;
	className?: string
}
