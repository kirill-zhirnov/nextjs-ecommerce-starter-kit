import {FormikHandlers, FormikProps, FormikValues} from 'formik';

interface IFieldAttrs {
	name: string;
	error: boolean;
	value: string;
	onChange: FormikHandlers['handleChange'];
	onBlur: FormikHandlers['handleBlur'];
	helperText?: string;
}

export function formikFieldAttrs<V extends FormikValues>(field: string, formikProps: FormikProps<V>, helperText: string = ''): IFieldAttrs {
	const {errors, values, handleChange, handleBlur} = formikProps;

	let error = false;
	if (field in errors && errors[field]) {
		error = true;
		helperText = errors[field] as string;
	}

	const out: IFieldAttrs = {
		name: field,
		error,
		value: '',
		onChange: handleChange,
		onBlur: handleBlur
	};

	if (field in values && values[field] !== null) {
		out.value = values[field];
	}

	if (helperText)
		out.helperText = helperText;

	return out;
}

export type TApiErrors = {field: string; message: string}[];

export function apiErrors2Formik(errors: TApiErrors) {
	const out: {[field: string]: string} = {};

	if (Array.isArray(errors)) {
		errors.forEach(({field, message}) => out[field] = message);
	}

	return out;
}
