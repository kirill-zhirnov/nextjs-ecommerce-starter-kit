import Link from 'next/link';
import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home';

export default function EmptyCart() {
	return (
		<>
			<p className='text-center'>
				Your shopping cart is empty.
			</p>
			<p className='text-center'>
				<Button
					component={Link}
					href={'/'}
					startIcon={<HomeIcon />}
					variant={'contained'}
				>
					Go shopping!
				</Button>
			</p>
		</>
	);
}
