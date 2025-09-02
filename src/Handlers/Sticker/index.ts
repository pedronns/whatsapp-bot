import dotenv from 'dotenv'
import { createModule, createMethod } from 'kozz-module-maker'

dotenv.config()

const GatewayUrl = process.env.GATEWAY_URL ?? ''
const socketPath = process.env.SOCKET_PATH ?? ''

const helpMessage = `📌 *!st [imagem ou reply]*  
📝 Gera uma figurinha a partir de uma imagem enviada ou mencionada.  
Ex.: 🖼️📎 !st

📌 *!st toimg [reply]*  
📝 Converte uma figurinha em imagem comum.  
Ex.: !st toimg
`

const helpInstructions = `Envie uma imagem com _*!st*_ na legenda, _ou_ responda a imagem com _*!st*_`


const defaultMethod = createMethod(
	'default',
	(requester, { tags }) => {
		const { quotedMessage, media } = requester.message

		if (quotedMessage?.messageType == 'TEXT') {
			return requester.reply('⚠️ Não consigo gerar figurinhas a partir de textos (Por enquanto)')
		}

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
				return requester.reply('⚠️ Não sei como fazer figurinha desse tipo de mídia')
			} else {
				return requester.reply.withSticker(quotedMessage.media)
			}
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