const webpack = require('webpack');

/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config) => {
		const defineMap = {};

		[
			'BOUNDLESS_API_BASE_URL',
			'BOUNDLESS_API_PERMANENT_TOKEN',
			'BOUNDLESS_S3_PREFIX',
			'BOUNDLESS_INSTANCE_ID',
			'BOUNDLESS_MEDIA_SERVER'
		].forEach((key) => defineMap[`process.env.${key}`] = JSON.stringify(process.env[key]));

		config.plugins.push(
			new webpack.DefinePlugin(defineMap)
		);

		return config;
	},
}

module.exports = nextConfig
