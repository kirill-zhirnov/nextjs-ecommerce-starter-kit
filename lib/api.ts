import {BoundlessClient} from 'boundless-api-client';

export const baseURL = process.env.NEXT_PUBLIC_BOUNDLESS_API_BASE_URL;
export const permanentToken = process.env.NEXT_PUBLIC_BOUNDLESS_API_PERMANENT_TOKEN;
export const instanceId = process.env.NEXT_PUBLIC_BOUNDLESS_INSTANCE_ID as unknown as number;
export const s3Prefix = process.env.NEXT_PUBLIC_BOUNDLESS_S3_PREFIX;
export const mediaServer = process.env.NEXT_PUBLIC_BOUNDLESS_MEDIA_SERVER;

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

export {apiClient};

export const perPage = 30;

//5 minutes revalidation
export const revalidate = 60 * 5;


