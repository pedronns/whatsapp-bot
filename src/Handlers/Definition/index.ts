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
					const query = requester.message.body.split(' ').pop();

					if (!query) {
						return requester.reply(helpMessage);
					}

					const meaning = await getDefinition(query);
					requester.reply(
						meaning || `Não foi possível encontrar o significado de ${query}`
					);
				}),
			},
		},
	});

	return instance;
};
