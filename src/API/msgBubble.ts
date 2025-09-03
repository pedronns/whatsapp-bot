import axios from "axios";

export async function renderBubble(
  text: string,
  author: string,
  timeText: string,
  avatar?: string,
): Promise<string> {
  const payload = {
		mode: 'normal',
		msgAuthor: author,
		bodyText: text,
		avatarSrc: avatar,
		timeText: timeText,
		bubbleRadius: 24,
	};

  try {
    const response = await axios.post('http://localhost:3699/render', payload, {
      responseType: 'arraybuffer', // importante para receber binário
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const base64 = Buffer.from(response.data).toString('base64');
    return base64;
  } catch (err: any) {
    console.error('Erro ao renderizar a bolha:', err.details);
    throw err;
  }
}
