import Link from 'next/link'
import styles from './header/header.module.css'

export default function Header() {
	return (
		<div className={'container'}>
			<header className={styles.header}>
				<Link href={'/'} className={styles.logo}>
					Logo
				</Link>
			</header>
		</div>
	);
}
