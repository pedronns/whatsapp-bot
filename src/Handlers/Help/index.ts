import { createModule, createMethod } from "kozz-module-maker";
const defaultGatewayUrl = 'ws://localhost:4521';

const helpMessage = `
✨ *Lista de Comandos* ✨

📌 *!st [texto ou reply]*  
📝 Gera uma figurinha a partir de uma mensagem de texto ou imagem.  
Ex.: \`!st Olá mundo\`
Ex.: \`🖼️📎 !st\`

📌 *!advice*  
📝 Exibe um conselho aleatório (EN-US).  
Ex.: \`!advice\`

📌 *!cat*  
🐱 Mostra uma imagem aleatória de um gato.  
Ex.: \`!cat\`

📌 *!dog*  
🐶 Mostra uma imagem aleatória de um cachorro.  
Ex.: \`!dog\`

📌 *!fact*  
📝 Exibe um fato aleatório (EN-US).  
Ex.: \`!fact\`

📌 *!yt audio/video [pesquisa]*  
▶️ Retorna o primeiro resultado do YouTube como áudio ou vídeo.  
Ex.: \`!yt video Never Gonna Give You Up\`  
Ex.: \`!yt audio Relaxing Music\`

📌 *!roll [n]*  
🎲 Rola um dado com _n_ lados (máx. 100).  
Ex.: \`!roll 6\` → 🎲: 3

📌 *!clima [cidade]*  
🌤️ Mostra a previsão do tempo para a cidade informada.  
Ex.: \`!clima São Paulo\`

📌 *!def [palavra]*  
📖 Mostra a definição da palavra informada.  
Ex.: \`!def casa\`

📌 *!syn [palavra]*  
📝 Mostra sinônimos da palavra informada.  
Ex.: \`!syn feliz\`
`;



export const startHelpModule = () => {
	const instance = createModule({
		name: 'help',
		address: defaultGatewayUrl,
		customSocketPath: '/socket.io/',
		commands: {
			boundariesToHandle: ['*'],
			methods: {
				...createMethod('default', requester => {
					requester.reply(helpMessage)
				}),
			},
		},
	});

	return instance;
};
