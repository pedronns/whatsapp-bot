import fetch, { RequestInit } from 'node-fetch';

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

interface TypeResponse {
  damage_relations: {
    double_damage_from: { name: string }[]
    half_damage_from: { name: string }[]
    no_damage_from: { name: string }[]
  }
}

const url =
	'https://pokeapi.co/api/v2/pokemon/';
const options: RequestInit = {
	method: 'GET',
	headers: {
		accept: 'application/json',
	},
};

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
	const response = await fetch(url, options);
	if (!response.ok) {
		throw new Error(`Erro HTTP: ${response.status}`);
	}
	return response.json() as Promise<T>;
}

export async function getPokemon(query: string): Promise<Pokemon | null> {
	try {
		const pokemon = await fetchJson<Pokemon>(
			`${url}/${query}`,
			options
		);

		const typeRelations = await Promise.all(
			pokemon.types.map(async t => {
				const typeData = await fetchJson<TypeResponse>(t.type.url, options);
				return typeData.damage_relations;
			})
		);

		const weaknesses = Array.from(new Set(typeRelations.flatMap(tr => tr.double_damage_from.map(d => d.name))));
    	const resistances = Array.from(new Set(typeRelations.flatMap(tr => tr.half_damage_from.map(d => d.name))));
    	const immunities = Array.from(new Set(typeRelations.flatMap(tr => tr.no_damage_from.map(d => d.name))));

		return { ...pokemon, weaknesses, resistances, immunities};

	} catch (error: any) {
		console.log('Erro ao buscar pokemon', error);
		return null;
	}
}


