import axios from 'axios';

type QuoteSuccess = {
	ok: true;
	result: {
		image: string;
		type: string;
		width: number;
		height: number;
	};
};

type QuoteFail = {
	ok: false;
	error: {
		code: number;
		message: string;
	};
};

export const generateQuote = async (
	quote: string,
	name: string,
	imageUrl: string | undefined,
	customColor?: string
) => {
	try {
		const response = imageUrl
			? await axios.get<Buffer>(imageUrl, {
					responseType: 'arraybuffer',
			  })
			: undefined;

		const json = {
			type: 'quote',
			format: 'png',
			backgroundColor: customColor || '#353535',
			width: 384,
			height: 768,
			scale: 2,
			messages: [
				{
					entities: [],
					avatar: true,
					from: {
						id: 1,
						name: name || '__NAME_NOT_FOUND__',
						photo: response ? { b64: response?.data.toString('base64') } : undefined,
					},
					text: quote,
					replyMessage: {},
				},
			],
		};

		const result = await axios
			.post<QuoteSuccess | QuoteFail>('http://192.168.15.4:8000/quote/generate', json)
			.then(resp => resp.data);

		if(!result.ok) {
			throw new Error(`Quote API failed: ${result.error.message}`)
		}

		return result.result.image;
	} catch (e: unknown) {
		if (axios.isAxiosError(e)) {
			console.error('Axios error', e.response?.data || e.message);
		} else {
			console.error('Unexpected error', e);
		}
		throw e;
	}
};
