import { createModule, createMethod } from "kozz-module-maker";
const defaultGatewayUrl = 'ws://localhost:4521';

const helpMessage = `
✨ *Lista de Comandos* ✨

📌 *!sticker*  
📝 Gera uma figurinha a partir de uma mensagem de texto ou imagem.

📌 *!conselho*  
📝 Exibe um conselho aleatório (pode conter erros de tradução).

📌 *!gato*  
🐱 Mostra uma imagem aleatória de um gato.

📌 *!cachorro*  
🐶 Mostra uma imagem aleatória de um cachorro.

📌 *!fato*  
📝 Exibe um fato aleatório (pode conter erros de tradução).

📌 *!yt audio/video [pesquisa]*  
▶️ Retorna o primeiro resultado do YouTube como áudio ou vídeo.  
Ex.: \`!yt video Never Gonna Give You Up\`

📌 *!roll [n]*  
🎲 Rola um dado com _n_ lados (máx. 100).  
Ex.: \`!roll 6\` → 🎲: 3

📌 *!clima [cidade]*  
🌤️ Mostra a previsão do tempo para a cidade informada.

📌 *!word [palavra]*  
📖 Mostra o significado da palavra informada.

📌 *!sinonimo [palavra]*  
📝 Mostra sinônimos da palavra informada.
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
