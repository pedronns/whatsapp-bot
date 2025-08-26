import dotenv from 'dotenv'
import { createModule, createMethod } from "kozz-module-maker";
import { getDefinition } from "src/API/definition"; 

dotenv.config()

const gatewayUrl = process.env.GATEWAY_URL ?? ''
const socketPath = process.env.SOCKET_PATH ?? ''

const helpMessage = `📌 *!def [palavra]*  
📖 Mostra a definição da palavra informada.  
Ex.: \`!def cavalo\``;


export const startDefinitionModule = () => {
	const instance = createModule({
		name: 'def',
		address: gatewayUrl,
		customSocketPath: socketPath,
		commands: {
			boundariesToHandle: ['*'],
			methods: {
				...createMethod('default', async requester => {
					requester.reply(helpMessage);
				}),
				...createMethod('fallback', async requester => {
					const query = requester.message.body.replace(/^!\s*def\s+/i, '').trim();

					if (!query) {
						return requester.reply(helpMessage);
					}

					const meanings = await getDefinition(query);
					
					requester.reply(
						meanings || `Não foi possível encontrar o significado de ${query}`
					);
				}),
			},
		},
	});

	return instance;
};
