import {ReactNode} from 'react';
import {Metadata} from 'next';

/**
 * The Layout is needed to specify the page title and meta tags.
 */
export default function NewPassLayout({children}: {children: ReactNode}) {
	return (
		<>{children}</>
	);
}
export const metadata: Metadata = {
	title: 'Save New Password',
	robots: 'noindex'
};
