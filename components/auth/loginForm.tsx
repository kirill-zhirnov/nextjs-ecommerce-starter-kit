'use client';

import {Form, Formik, FormikHelpers} from 'formik';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {apiErrors2Formik, formikFieldAttrs} from '@/lib/formUtils';
import LoginIcon from '@mui/icons-material/Login';
import {useCallback} from 'react';
import {apiClient} from '@/lib/api';
import {useCart, useCustomer} from 'boundless-commerce-components/dist/client';
import Link from 'next/link';

export default function LoginForm() {
	const {onSubmit} = useSubmitLoginForm();

	return (
		<Formik initialValues={{email: '', password: ''}} onSubmit={onSubmit}>
			{(formikProps) => (
				<Form className={'bg-light p-3'}>
					<div className={'my-3'}>
						<TextField
							label={'Email'}
							 variant={'standard'}
							 type={'email'}
							 required={true}
							 fullWidth
							 {...formikFieldAttrs<ILoginFormValues>('email', formikProps)}
						/>
					</div>
					<div className={'my-3'}>
						<TextField
							label={'Password'}
							variant={'standard'}
							type={'password'}
							required={true}
							fullWidth
							{...formikFieldAttrs<ILoginFormValues>('password', formikProps)}
						/>
					</div>
					<div className={'my-3 text-end'}>
						<Button
							component={Link}
							href={'/auth/restore-password'}
							className={'me-2'}
						>Forgot Password?</Button>
						<Button variant="contained"
										startIcon={<LoginIcon />}
										type={'submit'}
										disabled={formikProps.isSubmitting}
						>{formikProps.isSubmitting ? 'Loading...' : 'Sign In'}</Button>
					</div>
				</Form>
			)}
		</Formik>
	);
}

const useSubmitLoginForm = () => {
	const {login} = useCustomer();
	const {setTotal, setCartId, cartId} = useCart();

	const onSubmit = useCallback((values: ILoginFormValues, {setSubmitting, setErrors}: FormikHelpers<ILoginFormValues>) => {
		if (!login) {
			throw new Error('authCustomer is empty. Did you wrap the app in BoundlessCart?');
		}

		apiClient.customer.login(values.email, values.password, cartId)
			.then(({authToken, customer, activeCart}) => {
				login(authToken, customer);

				if (activeCart && setCartId && setTotal) {
					setCartId(activeCart.id);
					setTotal(activeCart.total);
				}
			})
			.catch(({response: {data}}) => setErrors(apiErrors2Formik(data)))
			.finally(() => setSubmitting(false));
	}, [login, cartId, setCartId, setTotal]);

	return {
		onSubmit
	};
};

interface ILoginFormValues {
	email: string;
	password: string;
}
