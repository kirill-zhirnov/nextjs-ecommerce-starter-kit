import {useFormikContext} from 'formik';
import Alert from '@mui/material/Alert';

const ErrorSummary = () => {
	const {errors} = useFormikContext();

	if (!Object.values(errors).length) {
		return null;
	}

	return (
		<Alert severity="error">
			<strong>Form contains errors:</strong>
			<ul>
				{Object.entries(errors).map(([field, error], key) =>
					<li key={key}>{field}: {String(error)}</li>
				)}
			</ul>
		</Alert>
	);
};
export default ErrorSummary;
