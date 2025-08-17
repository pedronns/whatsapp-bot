import { createMethod, createModule } from 'kozz-module-maker'
const defaultGatewayUrl = 'ws://localhost:4521'
const defaultSocketPath = '/socket.io/'

import { getAdvice } from './API/advice'
import { getFunFact } from './API/funFact'
import { getDefinition } from './API/dictionary'

import { startHelpModule } from './Handlers/Help/index'
import { startDiceModule } from './Handlers/Dice/index'

const helpModule = startHelpModule()

const diceModule = startDiceModule()

const adviceModule = createModule({
	name: 'conselho',
	address: defaultGatewayUrl,
	customSocketPath: defaultSocketPath,
	commands: {
		boundariesToHandle: ['*'],
		methods: {
			...createMethod('default', async requester => {
				const advice = await getAdvice()
				requester.reply(advice || 'Não foi possível obter um conselho.')
			}),
			...createMethod('help', requester => {
				const help = 'Exibe um conselho aleatório (EN-US).'
				requester.reply(help)
			}),
		},
	},
})

const factModule = createModule({
	name: 'fato',
	address: defaultGatewayUrl,
	customSocketPath: defaultSocketPath,
	commands: {
		boundariesToHandle: ['*'],
		methods: {
			...createMethod('default', async requester => {
				const funFact = await getFunFact()
				requester.reply(funFact || 'Não foi possível obter um fato curioso.')
			}),
			...createMethod('help', requester => {
				const help = 'Exibe um fato curioso aleatório (EN-US).'
				requester.reply(help)
			}),
		},
	},
})

const dictionaryHelp = `💡 *Comandos disponíveis:*

\`!word  [palavra]\` → Mostra a definição da palavra

Exemplo: \`!word cavalo\``

const dictionaryModule = createModule({
	name: 'word',
	address: defaultGatewayUrl,
	customSocketPath: defaultSocketPath,
	commands: {
		boundariesToHandle: ['*'],
		methods: {
			...createMethod('default', async requester => {
				requester.reply(dictionaryHelp)
			}),
			...createMethod('fallback', async requester => {
				const query = requester.rawCommand!.query

				if(!query) {
					return requester.reply('Insira uma palavra')
				}

				const meaning = await getDefinition(query)
				requester.reply(
					meaning || `Não foi possível encontrar o significado de ${query}`
				)
			}),
			// TODO: synonym method
		},
	},
})

