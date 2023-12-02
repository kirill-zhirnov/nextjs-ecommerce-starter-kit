import {nativeFetch, revalidate} from '@/lib/api';
import {IBasicSettings} from 'boundless-commerce-components';

export const fetchBasicSettings = async (): Promise<Required<IBasicSettings>> => {
	// &keys[]=system.currency
	const data = await nativeFetch('/system/settings?keys[]=system.locale&keys[]=system.currency', {
		next: {
			revalidate,
			tags: ['settings']
		}
	});

	if (!data.ok) {
		throw new Error('Failed to fetch BasicSettings');
	}

	return data.json();
};
