import dotenv from 'dotenv'

import { createModule, createMethod } from "kozz-module-maker";
import { getPokemon } from 'src/API/pokemon';
import { typeMap } from 'src/Utils/pokemonTypes';
import { startCase } from 'lodash'

dotenv.config()

export interface Pokemon {
  id: number
  name: string
  height: number
  weight: number

  abilities: {
    ability: {
      name: string
      url: string
    }
    is_hidden: boolean
    slot: number
  }[]

  types: {
    type: {
      name: string
      url: string
    }
    slot: number
  }[]

  stats: {
    base_stat: number
    effort: number
    stat: {
      name: string
      url: string
    }
  }[]

  sprites: {
    front_default: string | null
    other?: {
      "official-artwork"?: {
        front_default: string | null
      }
    }
  }
  weaknesses: string[]
  resistances: string[]
  immunities: string[]

}



const gatewayUrl = process.env.GATEWAY_URL ?? ''
const socketPath = process.env.SOCKET_PATH ?? ''

const helpMessage = `📌 *!pokemon [nome/numero]*  
🎞️ Mostra informações sobre o pokémon pesquisado.  
Ex.: \`!poke ditto\`;
Ex.: \`!poke 156\``;

const mainMethod = createMethod('fallback', async requester => {
	const query = requester.rawCommand?.query;

	if (!query) {
		return requester.reply(helpMessage);
	}

	const pokemon = await getPokemon(query);	

	if (!pokemon) {
		return requester.reply('Pokémon não encontrado');
	}


	const sprite = pokemon.sprites.other?.['official-artwork']?.front_default
	
	function createPokemonDescription(pokemon: Pokemon): string {
		const name = startCase(pokemon.name)
		const height = (pokemon.height / 10).toFixed(1) + 'm'
		const weight = (pokemon.weight/ 10).toFixed(1) + 'kg';

		const types = pokemon.types.map(t => typeMap[t.type.name]).join(', ') || 'N/A';
		const abilities = pokemon.abilities.map(a =>  startCase(a.ability.name)).join(', ') || 'N/A';

		const hp = pokemon.stats.find(s => s.stat.name === "hp")?.base_stat ?? 0
		const atk = pokemon.stats.find(s => s.stat.name === "attack")?.base_stat ?? 0
		const def = pokemon.stats.find(s => s.stat.name === "defense")?.base_stat ?? 0
		const specialAtk = pokemon.stats.find(s => s.stat.name === "special-attack")?.base_stat ?? 0
		const specialDef =
			pokemon.stats.find(s => s.stat.name === 'special-defense')?.base_stat ?? 0;
		const spd = pokemon.stats.find(s => s.stat.name === "speed")?.base_stat ?? 0

		const weaknesses = pokemon.weaknesses.length
			? pokemon.weaknesses.map(w => typeMap[w]).join(', ')
			: 'Nenhum';

		const resistances = pokemon.resistances.length
			? pokemon.resistances.map(r => typeMap[r]).join(', ')
			: 'Nenhum';

		const immunities = pokemon.immunities.length
			? pokemon.immunities.map(i => typeMap[i]).join(', ')
			: 'Nenhum';

		return (
			`*${name} - #${pokemon.id}*\n\n` +
			`📏 Altura: ${height}\n` +
			`⚖️ Peso: ${weight}\n` +
			`🔮 Tipo(s): ${types}\n` +
			`✨ Habilidade(s): ${abilities}\n\n` +

			`📈 Forte contra: ${resistances}\n` +
			`📉 Fraco contra: ${weaknesses}\n` +
			`⛔ Imune contra: ${immunities}\n\n` +

			`❤️ Stats:\n` +
			`- HP: ${hp}\n` +
			`- ATK: ${atk}\n` +
			`- DEF: ${def}\n` +
			`- SP. ATK: ${specialAtk}\n` +
			`- SP. DEF: ${specialDef}\n` +
			`- SPD: ${spd}` 
		);
	}

	const description = createPokemonDescription(pokemon);

	if (sprite) {
		return requester.reply.withMedia.fromUrl(sprite, 'image', description);
	} else {
		return requester.reply(description);
	}
});

export const startPokemonModule = () => {
	const instance = createModule({
		name: 'poke',
		address: gatewayUrl,
		customSocketPath: socketPath,
		commands: {
			boundariesToHandle: ['*'],
			methods: {
				...createMethod('default', async requester => {
					requester.reply(helpMessage);
				}),
				...createMethod('help', requester => {
					requester.reply(helpMessage);
				}),
				...mainMethod,
			},
		},
	});

	return instance;
};
