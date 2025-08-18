import dotenv from 'dotenv'
import { createModule, createMethod } from "kozz-module-maker";

dotenv.config()

const gatewayUrl = process.env.GATEWAY_URL ?? ''
const socketPath = process.env.SOCKET_PATH ?? ''

const diceHelp = `📌 *!roll [n]*  
🎲 Rola um dado com _n_ lados (máx. 100).  
Ex.: \`!roll 6\` → 🎲: 3`

const queryDice = createMethod('fallback', async requester => {
	try {
		const query = requester.rawCommand!.query
		
		if (!query) {
			requester.reply(diceHelp);
			return
		}

		const sides = Number(query);
		
		if (isNaN(sides)) {
			requester.reply('⚠️ O valor precisa ser um número.\nEx: `!roll 20`');
			return;
		}

		if(sides < 1 || sides > 100) {
			requester.reply('⚠️ Escolha um valor entre *1* e *100*.');
			return;
		}

		if(!Number.isInteger(sides)) {
			requester.reply('⚠️ Não existem lados fracionários, colega.');
			return;
		}

		
		const result = Math.floor(Math.random() * sides) + 1
		requester.reply(`🎲: ${result}`)

	} catch (error) {
		requester.reply('Erro ao rolar o dado');
	}

});


export const startDiceModule = () => {
	const instance = createModule({
		commands: {
			boundariesToHandle: ['*'],
			methods: {
				...queryDice,
			},
		},
		name: 'roll',
		address: gatewayUrl,
		customSocketPath: socketPath,
	});

	return instance;
};
