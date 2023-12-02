import Link from 'next/link';
import styles from './header/header.module.css';
import AuthBar from '@/components/header/authBar';

export default function Header() {
	return (
		<div className={'container'}>
			<header className={styles.header}>
				<AuthBar />
				<div className={styles['logo-container']}>
					<Link href={'/'} className={styles.logo}>
						Logo
					</Link>
				</div>
			</header>
		</div>
	);
}
