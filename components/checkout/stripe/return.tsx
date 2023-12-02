'use client';

import {useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';
import Alert from '@mui/material/Alert';
import LoadingScreen from '@/components/loadingScreen';

export default function StripeReturn() {
	const params = useSearchParams();
	const [isSuccess, setIsSuccess] = useState<boolean|undefined>();

	useEffect(() => {
		const sessionId = params.get('session_id');

		fetch(`/api/stripe-checkout?session_id=${sessionId}`, {
			method: 'GET',
			cache: 'no-cache'
		})
			.then((res) => res.json())
			.then(({isSuccess, orderId}) => {

				setIsSuccess(isSuccess);
				if (isSuccess) {
					window.location.assign(`/thank-you/${orderId}`);
				}
			});
	}, [params]);

	if (isSuccess === undefined) {
		return <LoadingScreen />;
	}

	if (isSuccess === false) {
		return (
			<div className={'container'}>
				<Alert severity="error">Something goes wrong. Please contact support.</Alert>
			</div>
		);
	}

	return null;
}
