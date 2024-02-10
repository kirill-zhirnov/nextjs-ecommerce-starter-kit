import {Form, Formik, FormikHelpers, useFormikContext} from 'formik';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import {apiErrors2Formik, formikFieldAttrs, TApiErrors} from '@/lib/formUtils';
import {useCallback, useState} from 'react';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
// import DialogContentText from '@mui/material/DialogContentText';
import {apiClient} from '@/lib/api';
import {useCart, useCustomer} from 'boundless-commerce-components/dist/client';
import ErrorSummary from '@/components/errorSummary';
import CircularProgress from '@mui/material/CircularProgress';
import {ICustomer} from 'boundless-api-client';
import {IAdapterNegativeResponse} from 'boundless-api-client';

export default function OrderForm() {
	const {onSubmit, formView} = useSubmitForm();
	const {customer, customerIsInited} = useCustomer();

	if (!customerIsInited) {
		return (
			<div className={'text-center'}><CircularProgress /></div>
		);
	}

	if (formView === 'success') {
		return <SuccessView />;
	}

	return (
		<div>
			<p>Fill out the following Form:</p>
			<Formik initialValues={getInitialValues(customer)} onSubmit={onSubmit}>
				{(formikProps) => (
					<Form>
						<ErrorSummary />
						<div className={'my-3'}>
							<TextField
								label="Name"
								variant="filled"
								required={true}
								fullWidth={true}
								{...formikFieldAttrs('contact.first_name', formikProps)}
								value={formikProps.values.contact.first_name}
							/>
						</div>
						<div className={'my-3'}>
							<TextField
								label="Email"
								variant="filled"
								type={'email'}
								required={true}
								fullWidth={true}
								{...formikFieldAttrs('contact.email', formikProps)}
								value={formikProps.values.contact.email}
							/>
						</div>
						<div className={'my-3'}>
							<TextField
								label="Phone"
								variant="filled"
								fullWidth={true}
								{...formikFieldAttrs('contact.phone', formikProps, 'Use format: +1 (555) 123-4567')}
								value={formikProps.values.contact.phone}
								placeholder={'+1 (555) 123-4567'}
							/>
						</div>
						<div className={'my-3'}>
							<TextField
								label="Message"
								variant="filled"
								fullWidth={true}
								multiline={true}
								minRows={3}
								{...formikFieldAttrs('client_comment', formikProps)}
							/>
						</div>
						<div className={'my-3 text-end'}>
							<Button
								variant="contained"
								startIcon={<CheckIcon />}
								type={'submit'}
								disabled={formikProps.isSubmitting}
							>{formikProps.isSubmitting ? 'Loading...' : 'Place an order'}</Button>
						</div>
					</Form>
				)}
			</Formik>
		</div>
	);
}

const useSubmitForm = () => {
	const {customer} = useCustomer();
	const {cartId: cart_id} = useCart();
	const [formView, setFormView] = useState<'form' | 'success'>('form');

	const onSubmit = useCallback(async (values: IFormValues, helpers: FormikHelpers<IFormValues>) => {
		try {
			const {data: {order: {id: order_id}}} = await apiClient.createRequest().post('/orders/checkout/init', {cart_id});
			await apiClient.createRequest().patch(`/orders/checkout/${order_id}/order`, {
				customer_id: customer ? 'me' : undefined,
				contact: {
					phone: values.contact.phone,
					email: values.contact.email,
					first_name: values.contact.first_name
				},
				client_comment: values.client_comment,
				place_the_order: true
			});
			setFormView('success');
			window.location.assign(`/thank-you/${order_id}`);
		} catch (e) {
			if ((e as IAdapterNegativeResponse).response?.status === 422) {
				helpers.setErrors(apiErrors2Formik((e as IAdapterNegativeResponse).response?.data as TApiErrors));
			}
		}
		//it is not necessery if a callback return a promise
		// helpers.setSubmitting(false);
	}, [cart_id, customer]);

	return {
		onSubmit,
		formView
	};
};

interface IFormValues {
	contact: {
		phone: string,
		first_name: string,
		email: string,
	},
	client_comment: string,
	qty: number
}

const SuccessView = () => {
	return (
		<Alert severity={'success'}>
			<strong>Thank you!</strong> Please check your mailbox.
		</Alert>
	);
};

const getInitialValues = (customer?: ICustomer) => {
	return {
		contact: {
			first_name: customer?.first_name || '',
			email: customer?.email || '',
			phone: customer?.phone || '',
		},
		client_comment: '',
		qty: 1
	};
};
