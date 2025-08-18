import { createModule, createMethod } from 'kozz-module-maker';
import { MessageObj } from 'kozz-module-maker/dist/Message';
import { Media } from 'kozz-types';
import { generateQuote } from 'src/API/QuoteApi';
const defaultGatewayUrl = 'ws://localhost:4521';


const helpMessage = `📌 *!st [texto ou reply]*  
📝 Gera uma figurinha a partir de uma mensagem de texto ou imagem.  
Ex.: \`!st Olá mundo\`
Ex.: \`🖼️📎 !st\``;

const helpInstructions = `Envie uma imagem com _*!st*_ na legenda, _ou_ responda a imagem com _*!st*_`

const makeQuote = async (requester: MessageObj) => {
	const { quotedMessage } = requester.message;

	if (!quotedMessage || !quotedMessage.body) {
		return requester.reply(helpMessage);
	}

	const text = quotedMessage.taggedConctactFriendlyBody;
	const name = quotedMessage.contact.publicName;

	console.log(quotedMessage);

	const profilePicUrl = await requester.ask.boundary(
		requester.message.boundaryName,
		'contact_profile_pic',
		{
			id: quotedMessage.from,
		}
	);
	const quoteB64 = await generateQuote(text, name, profilePicUrl.response);

	if (!quoteB64) {
		return requester.reply('Erro ao gerar o sticker');
	}

	const stickerMedia: Media = {
		data: quoteB64,
		fileName: `${text}.png`,
		mimeType: 'image',
		sizeInBytes: null,
		transportType: 'b64',
		stickerTags: ['💬', '🗯', '💭'],
		duration: null,
	};

	requester.reply.withSticker(stickerMedia);
};

const defaultMethod = createMethod(
	'default',
	(requester, { tags }) => {
		const { quotedMessage, media } = requester.message;

		if (media) {
			return requester.reply.withSticker({
				...media,
				stickerTags: tags?.split('') ?? [],
			});
		}

		if (quotedMessage?.media) {
			if (quotedMessage.messageType === 'STICKER') {
				return requester.reply.withSticker(quotedMessage.media);
			}

			if (
				quotedMessage?.media &&
				!['IMAGE', 'VIDEO', 'TEXT'].includes(quotedMessage.messageType)
			) {
				console.log('Entrou');
				return requester.reply('Não sei como fazer figurinha desse tipo de mídia');
			} else {
				return requester.reply.withSticker(quotedMessage.media);
			}
		}

		if (quotedMessage) {
			return makeQuote(requester);
		}

		requester.reply(helpInstructions);
	},
	{
		tags: 'string?',
	}
);

const toImg = createMethod('toimg', message => {
	if (!message.message.quotedMessage?.media) {
		return message.reply('⚠️ Mencione uma mensagem com figurinha');
	}

	return message.reply.withMedia(message.message.quotedMessage.media);
});

const fromLink = createMethod('from-link', requester => {
	const link = requester.rawCommand?.immediateArg;
	if (!link) {
		return requester.reply('Por favor envie um link');
	}
	try {
		const url = new URL(link);
		return requester.reply.withSticker({
			data: url.href,
			duration: 0,
			fileName: 'sticker',
			mimeType: 'image/jpeg',
			sizeInBytes: 0,
			stickerTags: [],
			transportType: 'url',
		});
	} catch (_) {
		return requester.reply('⚠️ O link provido não é válido');
	}
});


export const startStickerModule = () => {
	const instance = createModule({
		commands: {
			boundariesToHandle: ['*'],
			methods: {
				...defaultMethod,
				...toImg,
				...fromLink,
			},
		},
		name: 'st',
		customSocketPath: '/socket.io/',
		address: defaultGatewayUrl,
	})

	return instance;
};