import CartRowLoader from './cartLoader/cartRowLoader';
import clsx from 'clsx';

export default function CartLoader ({className}: {className?: string}) {
	return (
		<div className={clsx(className)}>
			{[...Array(3)].map((_, i) => (
				<CartRowLoader key={i} bg={i % 2 === 0 ? '#f9f9f9' : ''} />
			))}
		</div>
	);
}
