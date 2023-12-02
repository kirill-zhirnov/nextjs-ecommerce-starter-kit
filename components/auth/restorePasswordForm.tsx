'use client';

import {useCallback} from 'react';
import {Form, Formik, FormikHelpers} from 'formik';
import TextField from '@mui/material/TextField';
import {apiErrors2Formik, formikFieldAttrs} from '@/lib/formUtils';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import {apiClient} from '@/lib/api';
import {useState} from 'react';
import Alert from '@mui/material/Alert';
import Link from 'next/link';

export default function RestorePasswordForm() {
	const {onSubmit, screen} = useSubmitForm();

	if (screen === 'success') {
		return (
			<Alert severity="success">
				We have sent you an email with a link to reset your password.
			</Alert>
		);
	}

	return (
		<Formik initialValues={{email: ''}} onSubmit={onSubmit}>
			{(formikProps) => (
				<Form className={'bg-light p-3'}>
					<div className={'my-3'}>
						<TextField
							label={'Email'}
							variant={'standard'}
							type={'email'}
							required={true}
							fullWidth
							{...formikFieldAttrs<IRestorePasswordFormValues>('email', formikProps)}
						/>
					</div>
					<div className={'my-3 text-end'}>
						<Button
							component={Link}
							href={'/auth/login'}
							className={'me-2'}
						>Sign In</Button>
						<Button variant="contained"
										startIcon={<SendIcon />}
										type={'submit'}
										disabled={formikProps.isSubmitting}
						>{formikProps.isSubmitting ? 'Loading...' : 'Send'}</Button>
					</div>
				</Form>
			)}
		</Formik>
	);
}


const useSubmitForm = () => {
	const [screen, setScreen] = useState<'form' | 'success'>('form');
	const onSubmit = useCallback((values: IRestorePasswordFormValues, {setSubmitting, setErrors}: FormikHelpers<IRestorePasswordFormValues>) => {
		const url_prefix = makeAbsoluteUrl('/auth/save-new-password');

		apiClient.createRequest().post('/user/auth/mail-restore-link', {
			email: values.email,
			url_prefix
		})
			.then(response => setScreen('success'))
			.catch(({response: {data}}) => setErrors(apiErrors2Formik(data)))
			.finally(() => setSubmitting(false));
	}, []);

	return {
		onSubmit,
		screen
	};
};

interface IRestorePasswordFormValues {
	email: string;
}

const makeAbsoluteUrl = (url: string): string => {
	const prefix = window.location.protocol + '//' + window.location.host;

	return prefix + url;
};
