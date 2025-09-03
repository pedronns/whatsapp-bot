import dotenv from 'dotenv'
import { createModule, createMethod } from 'kozz-module-maker'
import { MessageObj } from 'kozz-module-maker/dist/Message'
import { renderBubble } from 'src/API/msgBubble'
import { Media } from 'kozz-types'

dotenv.config()

const GatewayUrl = process.env.GATEWAY_URL ?? ''
const socketPath = process.env.SOCKET_PATH ?? ''

const helpMessage = `📌 *!st*
Gera uma figurinha a partir de uma imagem enviada, ou de uma imagem/texto em uma mensagem mencionada.
Ex.: \`🖼️📎 !st\`

📌 *!st toimg [resposta]*  
Converte a figurinha mencionada em imagem.
Ex.: \`!st toimg\``

const helpInstructions = `Envie uma imagem com _*!st*_ na legenda, _ou_ responda a imagem com _*!st*_`

const makeQuote = async (requester: MessageObj) => {
	const { quotedMessage } = requester.message;

	if (!quotedMessage || !quotedMessage.body) {
		return requester.reply(helpMessage);
	}

	const text = quotedMessage.taggedConctactFriendlyBody;
	const author = quotedMessage.contact.publicName || 'AUTHOR_NOT_FOUND' // sometimes it doesn't work
	const timestamp = quotedMessage.timestamp

	const clocktime = (timestamp: number) => {
		const date = new Date(timestamp * 1000);
    	const hours = String(date.getHours()).padStart(2, '0');
    	const minutes = String(date.getMinutes()).padStart(2, '0');
    	return `${hours}:${minutes}`;
	}

	const time = clocktime(timestamp);
	
	const profilePicUrl = await requester.ask.boundary(
		requester.message.boundaryName,
		'contact_profile_pic',
		{
			id: quotedMessage.from,
		}
	);

	const quoteB64 = await renderBubble(text, author, time, profilePicUrl.response);

	if (!quoteB64) {
		return requester.reply('erro');
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
	async (requester, { tags }) => {
		const { quotedMessage, media } = requester.message

		if (media) {
			return requester.reply.withSticker({
				...media,
				stickerTags: tags?.split('') ?? [],
			})
		}

		
		
		if (quotedMessage?.media) {
			if (quotedMessage.messageType === 'STICKER') {
				return requester.reply.withSticker(quotedMessage.media)
			}
			
			if (
				quotedMessage?.media &&
				!['IMAGE', 'VIDEO', 'TEXT'].includes(quotedMessage.messageType)
			) {
				return requester.reply('⚠️ Não consigo fazer figurinha desse tipo de mídia')
				
			} else {
				return requester.reply.withSticker(quotedMessage.media)
			}
		}

		if (quotedMessage) {
			return makeQuote(requester)
		}
		
		requester.reply(helpInstructions)
	},
	{
		tags: 'string?',
	}
)

const toImg = createMethod('toimg', message => {
	if (!message.message.quotedMessage?.media) {
		return message.reply('⚠️ Mencione uma mensagem com figurinha')
	}

	return message.reply.withMedia(message.message.quotedMessage.media)
})

/* const fromLink = createMethod('from-link', requester => {
	const link = requester.rawCommand?.immediateArg
	
	if (!link) {
		return requester.reply('⚠️ Por favor envie um link')
	}

	try {
		const url = new URL(link)
		return requester.reply.withSticker({
			data: url.href,
			duration: 0,
			fileName: 'sticker',
			mimeType: 'image/jpeg',
			sizeInBytes: 0,
			stickerTags: [],
			transportType: 'url',
		})
	} catch (_) {
		return requester.reply('⚠️ O link provido não é válido')
	}
}) */

const help = createMethod('help', requester => {
	return requester.reply(helpMessage)
})

export const startStickerModule = () => {
	const instance = createModule({
		commands: {
			boundariesToHandle: ['*'],
			methods: {
				...defaultMethod,
				...toImg,
				//...fromLink,
				...help
			},
		},
		name: 'st',
		customSocketPath: socketPath,
		address: GatewayUrl,
	})

	return instance
}