import dotenv from 'dotenv'
import { createModule, createMethod } from "kozz-module-maker";
import { getAdvice } from "src/API/advice"; 

dotenv.config()

const gatewayUrl = process.env.GATEWAY_URL ?? ''
const socketPath = process.env.SOCKET_PATH ?? ''

const helpMessage = `📌 *!conselho*  
📝 Exibe um conselho aleatório (EN-US).  
Ex.: \`!advice\``;


export const startAdviceModule = () => {
	const instance = createModule({
		name: 'advice',
		address: gatewayUrl,
		customSocketPath: socketPath,
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
