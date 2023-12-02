import CircularProgress from '@mui/material/CircularProgress';

export default function LoadingScreen({fullHeight}: {fullHeight?: boolean}) {
	return (
		<div style={{
			minHeight: fullHeight ? '100vh' : undefined,
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center'
		}}>
			<CircularProgress />
		</div>
	);
}
