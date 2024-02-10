import {apiClient, revalidate} from '@/lib/api';
import {IBasicSettings} from 'boundless-commerce-components';

export const fetchBasicSettings = async (): Promise<Required<IBasicSettings>> => {
	const settings = await apiClient.system.fetchSettings(['system.locale', 'system.currency'], {
		next: {
			revalidate,
			tags: ['settings']
		}
	});

	return settings as Required<IBasicSettings>;
};
