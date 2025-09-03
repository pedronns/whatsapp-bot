import dotenv from 'dotenv'
import { createModule, createMethod } from "kozz-module-maker";

dotenv.config()

const gatewayUrl = process.env.GATEWAY_URL ?? ''
const socketPath = process.env.SOCKET_PATH ?? ''

const helpMessage = `
✨ *Lista de Comandos* ✨

📌 *!st*
Gera uma figurinha a partir de uma imagem enviada, ou de uma imagem/texto em uma mensagem mencionada.
Ex.: \`🖼️📎 !st\`

*!st toimg [resposta]*  
Converte uma figurinha mencionada em imagem.
Ex.: \`!st toimg\`

📌 *!advice*  
📝 Exibe um conselho aleatório (🇬🇧🇺🇸).  
Ex.: \`!advice\`

📌 *!cat*  
🐱 Mostra uma imagem aleatória de um gato.  
Ex.: \`!cat\`

📌 *!def [palavra]*  
📖 Mostra a definição da palavra informada.  
Ex.: \`!def casa\`

📌 *!dog*  
🐶 Mostra uma imagem aleatória de um cachorro.  
Ex.: \`!dog\`

📌 *!fact*  
📝 Exibe um fato aleatório (🇬🇧🇺🇸).  
Ex.: \`!fact\`

📌 *!movie [nome]*  
🎞️ Mostra informações sobre o filme pesquisado.  
Ex.: \`!movie matrix\`

📌 *!roll [n]*  
🎲 Rola um dado com _n_ lados (máx. 100).  
Ex.: \`!roll 6\` → 🎲: 3

📌 *!yt audio/video [pesquisa]*  
🚧 _*Módulo em construção*_ 🚧  
▶️ Retorna o primeiro resultado do YouTube como áudio ou vídeo.  
Ex.: \`!yt video Never Gonna Give You Up\`  
Ex.: \`!yt audio Relaxing Music\`

📌 *!clima [cidade]*
🚧 _*Módulo em construção*_ 🚧  
🌤️ Mostra a previsão do tempo para a cidade informada.  
Ex.: \`!clima São Paulo\`

📌 *!syn [palavra]*
🚧 _*Módulo em construção*_ 🚧  
📝 Mostra sinônimos da palavra informada.  
Ex.: \`!syn feliz\`
`;

export const startHelpModule = () => {
	const instance = createModule({
		name: 'help',
		address: gatewayUrl,
		customSocketPath: socketPath,
		commands: {
			boundariesToHandle: ['*'],
			methods: {
				...createMethod('default', requester => {
					// requester.react('❓')
					requester.reply(helpMessage)
				}),
			},
		},
	});

	return instance;
};
