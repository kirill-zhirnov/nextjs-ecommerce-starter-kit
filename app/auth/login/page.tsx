'use client';

import LoginForm from '@/components/auth/loginForm';
import {useCustomer} from 'boundless-commerce-components/dist/client';
import LoadingScreen from '@/components/loadingScreen';
import {useEffect} from 'react';
import {useRouter} from 'next/navigation';

export default function LoginPage() {
	const {customer, customerIsInited} = useCustomer();
	const router = useRouter();

	useEffect(() => {
		if (customerIsInited && customer) {
			router.push('/customer/my-orders');
		}
	}, [customerIsInited, customer, router]);

	if (!customerIsInited) {
		return <LoadingScreen />;
	}

	return (
		<div className={'container'}>
			<h1 className={'mb-4'}>Login</h1>
			<div className={'row'}>
				<div className={'col-md-6 offset-md-3 col-xl-4 offset-xl-4'}>
					<LoginForm />
				</div>
			</div>
		</div>
	);
}
