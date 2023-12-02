'use client';

import LoginForm from '@/components/auth/loginForm';
import {Metadata} from 'next';
import {useCustomer} from 'boundless-commerce-components/dist/client';
import LoadingScreen from '@/components/loadingScreen';
import {useEffect} from 'react';
import { useRouter } from 'next/navigation';

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
			<LoginForm />
		</div>
	);
}
