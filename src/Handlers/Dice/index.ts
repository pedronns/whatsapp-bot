import { createModule, createMethod } from "kozz-module-maker";
const defaultGatewayUrl = 'ws://localhost:4521';

const queryDice = createMethod('fallback', async requester => {
	try {
		const query = requester.rawCommand!.query
		
		if (!query) {
			requester.reply('🎲 Role um dado com _n_ lados `(máx. 100)`. ');
			return
		}

		const sides = Number(query);
		
		if (isNaN(sides)) {
			requester.reply('⚠️ O valor precisa ser um número. Ex: `!roll 20`');
			return;
		}
		const validSides = (sides >= 1 && sides <= 100) ? sides : 6;
		
		const result = Math.floor(Math.random() * validSides) + 1
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
		address: defaultGatewayUrl,
		customSocketPath: '/socket.io/',
	});

	return instance;
};
