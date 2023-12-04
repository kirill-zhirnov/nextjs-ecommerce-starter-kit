'use client';

import {useCustomer} from 'boundless-commerce-components/dist/client';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';
import LoadingScreen from '@/components/loadingScreen';
import RestorePasswordForm from '@/components/auth/restorePasswordForm';

export default function RestorePasswordPage() {
	const {customer, customerIsInited} = useCustomer();
	const router = useRouter();

	useEffect(() => {
		if (customer) {
			router.push('/customer/my-orders');
		}
	}, [customer, router]);

	if (!customerIsInited) {
		return <LoadingScreen />;
	}

	return (
		<div className={'container'}>
			<h1 className={'mb-4'}>Forgot Password?</h1>
			<div className={'row'}>
				<div className={'col-md-6 offset-md-3 col-xl-4 offset-xl-4'}>
					<RestorePasswordForm />
				</div>
			</div>
		</div>
	);
}
