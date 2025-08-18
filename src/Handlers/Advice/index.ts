import { createModule, createMethod } from "kozz-module-maker";
const defaultGatewayUrl = 'ws://localhost:4521';

import { getAdvice } from "src/API/advice"; 

const helpMessage = `📌 *!conselho*  
📝 Exibe um conselho aleatório (EN-US).  
Ex.: \`!advice\``;


export const startAdviceModule = () => {
	const instance = createModule({
		name: 'advice',
		address: defaultGatewayUrl,
		customSocketPath: '/socket.io/',
		commands: {
			boundariesToHandle: ['*'],
			methods: {
			...createMethod('default', async requester => {
				const advice = await getAdvice()
				requester.reply(advice || 'Não foi possível obter um conselho.')
			}),
			...createMethod('help', requester => {
				requester.reply(helpMessage)
			}),
		},
		},
	});

	return instance;
};
