# Nedro Bot

A WhatsApp Bot built with the Kozz Bot framework

## Prerequisites

- Node.js >= 18
- [Yarn](https://yarnpkg.com/) (recommended)
- WhatsApp account


## Installation

1. Clone the necessary repositories into a common folder:

```bash
git clone https://github.com/pedronns/whatsapp-bot.git
git clone https://github.com/Kozz-Bot/Kozz-Gateway.git
git clone https://github.com/Kozz-Bot/kozz-baileys.git
```

2. Install dependencies:

```bash
# From the root folder
yarn add kozz-types kozz-module-maker link-module-alias node-fetch
yarn add -D @types/express @types/jest @types/node-fetch nodemon typedoc typescript

cd whatsapp-bot
```

3. Set environment variables (create a `.env` file in `whatsapp-bot`):

```bash
GATEWAY_URL=<your_gateway_url>
SOCKET_PATH=<your_socket_path>
TMDB_API_TOKEN=<your_tmdb_api_token>
```

4. Generate keys

```bash
cd ../Kozz-Gateway
yarn start
# And copy the generated keys folder into the other project folders: kozz-baileys and whatsapp-bot
```


5. Start the bot
```bash
cd whatsapp-bot
yarn start
```

6. Scan the QR code in the terminal with the desired WhatsApp account (first start only)

## Usage

- 🎲 Roll a die  
- 💡 Get advice or a fun fact  
- 📚 Look up words in the Portuguese dictionary  
- 🎬 Search for movies  
- 🖼️ Create a sticker  
- 🐱🐶 Get pictures of random cats and dogs!!!  

> Send `!help` in WhatsApp for more information about each command.


## Examples

```typescript
import dotenv from 'dotenv'
import { createModule, createMethod } from "kozz-module-maker";

dotenv.config()

const gatewayUrl = process.env.GATEWAY_URL ?? ''
const socketPath = process.env.SOCKET_PATH ?? ''

const helpMessage = ''

const startExampleModule = () => {
    const instance = createModule({
		name: 'example',
		commands: {
			boundariesToHandle: ['*'],
			methods: {
				...createMethod('default', requester => {
                    requester.reply('Hello World!')
                }),
                ...createMethod('help', requester => {
                    requester.reply(helpMessage)
                })
			},
		},
		address: gatewayUrl,
		customSocketPath: socketPath,
	});

    return instance
}

startExampleModule()
```