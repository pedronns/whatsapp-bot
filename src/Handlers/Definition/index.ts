import { createModule, createMethod } from "kozz-module-maker";
const defaultGatewayUrl = 'ws://localhost:4521';

import { getDefinition } from "src/API/definition"; 

const helpMessage = `📌 *!def [palavra]*  
📖 Mostra a definição da palavra informada.  
Ex.: \`!def cavalo\``;


export const startDefinitionModule = () => {
	const instance = createModule({
		name: 'def',
		address: defaultGatewayUrl,
		customSocketPath: '/socket.io/',
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
