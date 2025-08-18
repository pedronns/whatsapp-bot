import { createModule, createMethod } from "kozz-module-maker";
const defaultGatewayUrl = 'ws://localhost:4521';

import { getFunFact } from "src/API/funFact"; 

const helpMessage = `📌 *!conselho*  
📝 Exibe um conselho aleatório (EN-US).  
Ex.: \`!fact\``;


export const startFunFactModule = () => {
	const instance = createModule({
		name: 'fact',
		address: defaultGatewayUrl,
		customSocketPath: '/socket.io/',
		commands: {
			boundariesToHandle: ['*'],
			methods: {
			...createMethod('default', async requester => {
				const advice = await getFunFact()
				requester.reply(advice || 'Não foi possível obter um fato curioso.')
			}),
			...createMethod('help', requester => {
				requester.reply(helpMessage)
			}),
		},
		},
	});

	return instance;
};
