'use client';

import {useState, useEffect, useCallback} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {apiClient} from '@/lib/api';
import {ICustomer} from 'boundless-api-client';
import LoadingScreen from '@/components/loadingScreen';
import Alert from '@mui/material/Alert';
import {Form, Formik, FormikHelpers} from 'formik';
import TextField from '@mui/material/TextField';
import {apiErrors2Formik, formikFieldAttrs} from '@/lib/formUtils';
import Button from '@mui/material/Button';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import {useCustomer} from 'boundless-commerce-components/dist/client';
import ErrorSummary from '@/components/errorSummary';

export default function SaveNewPasswordForm() {
	const {screen, customer, authToken} = useSaveNewPassword();
	const {onSubmit} = useSubmitForm(customer, authToken);

	if (screen === 'loading') {
		return <LoadingScreen />;
	}

	if (screen === 'error') {
		return (
			<Alert severity="error">
				Something went wrong. Please try again.
			</Alert>
		);
	}

	return (
		<Formik initialValues={{password: '', password_repeat: ''}} onSubmit={onSubmit}>
			{(formikProps) => (
				<Form className={'bg-light p-3'}>
					<ErrorSummary />
					<div className={'my-3'}>
						<TextField
							label={'Password'}
							variant={'standard'}
							type={'password'}
							required={true}
							fullWidth
							{...formikFieldAttrs<INewPasswordFormValues>('password', formikProps)}
						/>
					</div>
					<div className={'my-3'}>
						<TextField
							label={'Repeat Password'}
							variant={'standard'}
							type={'password'}
							required={true}
							fullWidth
							{...formikFieldAttrs<INewPasswordFormValues>('password_repeat', formikProps)}
						/>
					</div>
					<div className={'my-3 text-end'}>
						<Button variant="contained"
										startIcon={<LockOpenIcon />}
										type={'submit'}
										disabled={formikProps.isSubmitting}
						>{formikProps.isSubmitting ? 'Loading...' : 'Save'}</Button>
					</div>
				</Form>
			)}
		</Formik>
	);
}

const useSaveNewPassword = () => {
	const searchParams = useSearchParams();
	const [screen, setScreen] = useState<'loading' | 'form' | 'error'>('loading');
	const [customer, setCustomer] = useState<undefined | ICustomer>();
	const [authToken, setAuthToken] = useState<undefined | string>();

	useEffect(() => {
		apiClient.createRequest().post('/user/auth/validate-magick-link', {
			query_string: searchParams.toString()
		})
			.then(({data: {person, authToken}}) => {
				setCustomer(person);
				setAuthToken(authToken);
				setScreen('form');
			})
			.catch(() => setScreen('error'));
	}, [searchParams]);

	return {
		screen, customer, authToken
	};
};

const useSubmitForm = (customer?: ICustomer, authToken?: string) => {
	const {login} = useCustomer();
	const router = useRouter();

	const onSubmit = useCallback((values: INewPasswordFormValues, {setSubmitting, setErrors}: FormikHelpers<INewPasswordFormValues>) => {
		if (!login) {
			throw new Error('authCustomer is empty. Did you wrap the app in BoundlessCart?');
		}

		apiClient.setCustomerAuthToken(authToken!).createRequest().post('/user/customer/auth/update-pass', values)
			.then(() => {
				login(authToken!, customer!);
				router.push('/customer/my-orders');
			})
			.catch(({response: {data}}) => setErrors(apiErrors2Formik(data)))
			.finally(() => setSubmitting(false));
	}, [customer, authToken, login, router]);

	return {
		onSubmit
	};
};

interface INewPasswordFormValues {
	password: string;
	password_repeat: string;
}
