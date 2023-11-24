import {BoundlessClient} from 'boundless-api-client';

const baseURL = process.env.BOUNDLESS_API_BASE_URL;
const permanentToken = process.env.BOUNDLESS_API_PERMANENT_TOKEN;
const s3Prefix = process.env.BOUNDLESS_S3_PREFIX;
const mediaServer = process.env.BOUNDLESS_MEDIA_SERVER;

const apiClient = new BoundlessClient(permanentToken);
apiClient.setInstanceId(process.env.BOUNDLESS_INSTANCE_ID as unknown as number);

if (baseURL) {
	apiClient.setBaseUrl(baseURL);
}

if (s3Prefix) {
	apiClient.setS3FolderPrefix(s3Prefix);
}

if (mediaServer) {
	apiClient.setMediaServerUrl(mediaServer);
}

export {apiClient};

export const perPage = 30;

//5 minutes revalidation
export const revalidate = 60 * 0;

export const defaultProductsSort = '-in_stock,title';

// export const nativeFetch = (localUrl: string, next?: NextFetchRequestConfig, cache?: RequestCache, headers?: {[key: string]: any}) => {
export const nativeFetch = (localUrl: string, {next, cache, headers}: {next?: NextFetchRequestConfig, cache?: RequestCache, headers?: {[key: string]: any}} = {}) => {
	const urlPrefix = baseURL || 'https://v1.api.boundless-commerce.com';

	return fetch(`${urlPrefix}${localUrl}`, {
		cache,
		next,
		headers: {
			Authorization: `Bearer ${permanentToken}`,
			...headers
		}
	});
};
