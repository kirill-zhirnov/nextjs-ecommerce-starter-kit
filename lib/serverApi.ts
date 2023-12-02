import {BoundlessClient} from 'boundless-api-client';
import {baseURL, instanceId, mediaServer, permanentToken, s3Prefix} from '@/lib/api';

export const makeApiClient = (): BoundlessClient => {
	const apiClient = new BoundlessClient(permanentToken);
	apiClient.setInstanceId(instanceId);

	if (baseURL) {
		apiClient.setBaseUrl(baseURL);
	}

	if (s3Prefix) {
		apiClient.setS3FolderPrefix(s3Prefix);
	}

	if (mediaServer) {
		apiClient.setMediaServerUrl(mediaServer);
	}

	return apiClient;
};
