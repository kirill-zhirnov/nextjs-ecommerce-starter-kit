import {IPagination} from 'boundless-api-client';
import Link from 'next/link';
import clsx from 'clsx';

export default function Pagination({pagination, urlPrefix = '/', className}: {pagination: IPagination, urlPrefix?: string, className?: string}) {
	if (pagination.pageCount == 1) {
		return null;
	}

	return (
		<nav aria-label="Product navigation">
			<ul className={clsx('pagination justify-content-center products-pagination', className)}>
				{[...Array(pagination.pageCount)].map((_, index) => (
					<li
						key={index}
						className={clsx('page-item', {active: (index + 1) === pagination.currentPage})}
					>
						<Link
							href={`${urlPrefix}?page=${index + 1}`}
							className="page-link"
						>
							{String(index + 1)}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}
