'use client';

import {Form, Formik, FormikHelpers} from 'formik';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {apiErrors2Formik, formikFieldAttrs} from '@/lib/formUtils';
import LoginIcon from '@mui/icons-material/Login';
import {useCallback} from 'react';
import {apiClient} from '@/lib/api';
import {useCustomer} from 'boundless-commerce-components/dist/client';
import Link from 'next/link';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import ErrorSummary from '@/components/errorSummary';

export default function RegisterForm() {
	const {onSubmit} = useSubmitRegisterForm();

	return (
		<Formik
			initialValues={{email: '', password: '', re_password: '', first_name: '', last_name: '', receive_marketing_info: true}}
			onSubmit={onSubmit}
		>
			{(formikProps) => (
				<Form className={'bg-light p-3'}>
					<ErrorSummary />
					<div className={'my-3'}>
						<TextField
							label={'Email'}
							variant={'standard'}
							type={'email'}
							required={true}
							fullWidth
							{...formikFieldAttrs<IRegisterFormValues>('email', formikProps)}
						/>
					</div>
					<div className={'row'}>
						<div className={'col-sm-6'}>
							<div className={'my-3'}>
								<TextField
									label={'Password'}
									variant={'standard'}
									type={'password'}
									required={true}
									fullWidth
									{...formikFieldAttrs<IRegisterFormValues>('password', formikProps)}
								/>
							</div>
						</div>
						<div className={'col-sm-6'}>
							<div className={'my-3'}>
								<TextField
									label={'Repeat Password'}
									variant={'standard'}
									type={'password'}
									required={true}
									fullWidth
									{...formikFieldAttrs<IRegisterFormValues>('re_password', formikProps)}
								/>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className={'col-sm-6'}>
							<div className={'my-3'}>
								<TextField
									label={'First Name'}
									variant={'standard'}
									fullWidth
									{...formikFieldAttrs<IRegisterFormValues>('first_name', formikProps)}
								/>
							</div>
						</div>
						<div className={'col-sm-6'}>
							<div className={'my-3'}>
								<TextField
									label={'Last Name'}
									variant={'standard'}
									fullWidth
									{...formikFieldAttrs<IRegisterFormValues>('last_name', formikProps)}
								/>
							</div>
						</div>
					</div>
					<div className={'my-3'}>
						<FormControlLabel
							control={<Checkbox
								name="receive_marketing_info"
								checked={formikProps.values.receive_marketing_info}
								onChange={formikProps.handleChange}
							/>}
							label="Receive marketing info"
						/>
					</div>
					<div className={'my-3 text-end'}>
						<Button
							component={Link}
							href={'/auth/login'}
							className={'me-2'}
						>Login</Button>
						<Button variant="contained"
										startIcon={<LoginIcon />}
										type={'submit'}
										disabled={formikProps.isSubmitting}
						>{formikProps.isSubmitting ? 'Loading...' : 'Register'}</Button>
					</div>
				</Form>
			)}
		</Formik>
	);
}

const useSubmitRegisterForm = () => {
	const {login} = useCustomer();

	const onSubmit = useCallback((values: IRegisterFormValues, {setSubmitting, setErrors}: FormikHelpers<IRegisterFormValues>) => {
		if (!login) {
			throw new Error('authCustomer is empty. Did you wrap the app in BoundlessCart?');
		}

		apiClient.customer.register({
			...values,
			send_welcome_email: true,
			login_url: `${window.location.origin}/auth/login`
		})
			.then(({authToken, customer}) => {
				login(authToken, customer);
			})
			.catch(({response: {data}}) => setErrors(apiErrors2Formik(data)))
			.finally(() => setSubmitting(false));
	}, [login]);

	return {
		onSubmit
	};
};

interface IRegisterFormValues {
	email: string;
	password: string;
	re_password: string;
	first_name: string;
	last_name: string;
	receive_marketing_info: boolean;
}
