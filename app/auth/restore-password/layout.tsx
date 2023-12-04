import {ReactNode} from 'react';
import {Metadata} from 'next';

/**
 * The Layout is needed to specify the page title and meta tags.
 */
export default function RestorePassLayout({children}: {children: ReactNode}) {
	return (
		<>{children}</>
	);
}
export const metadata: Metadata = {
	title: 'Forgot Password?',
	robots: 'noindex'
};
