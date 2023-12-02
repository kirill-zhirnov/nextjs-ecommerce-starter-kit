import {NextRequest, NextResponse} from 'next/server';
import {createHash} from 'crypto';
import {revalidateTag} from 'next/cache';

export async function POST (request: NextRequest) {
	const postedData = await request.json();

	const keySource = `${process.env.WEBHOOK_SIGN_KEY}.${JSON.stringify(postedData)}`;
	const sign = createHash('md5').update(keySource).digest('hex');

	if (request.headers.get('boundless-checksum-md5') !== sign) {
		return new NextResponse(null, { status: 401, statusText: 'Signature is incorrect'});
	}

	let model: string|undefined;
	if (postedData?.data?.model) {
		model = postedData?.data?.model;
	}

	try {
		switch (model) {
			case 'category':
				revalidateTag('categories');
				break;
			default:
				revalidateTag('products');
				break;
		}
	} catch (e) {
		console.error('Error on purge cache:', e);
	}

	return NextResponse.json({result: true}, {status: 200});
}
