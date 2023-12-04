import SaveNewPasswordForm from '@/components/auth/saveNewPasswordForm';

export default function SaveNewPasswordPage() {
	return (
		<div className={'container'}>
			<h1 className={'mb-4'}>Save New Password</h1>
			<div className={'row'}>
				<div className={'col-md-6 offset-md-3 col-xl-4 offset-xl-4'}>
					<SaveNewPasswordForm />
				</div>
			</div>
		</div>
	);
}
