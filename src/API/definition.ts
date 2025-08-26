import fetch from "node-fetch";
import { DOMParser } from "xmldom";

type WordEntry = {
	word: string;
	xml: string;
	sense: number;
	word_id: number;
	timestamp: string;
	creator: string;
	revision_id: number;
	moderator?: string | null;
	deletor?: string | null;
	normalized?: string;
	derived_from?: string | null;
};

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erro HTTP: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function getDefinition(query: string): Promise<string | null> {
  try {
	
    const data = await fetchJson<WordEntry[]>(`https://api.dicionario-aberto.net/word/${query}`);

    const parser = new DOMParser();
    let meanings: string[] = [];

	function escapeWhatsAppMarkdown(text: string): string {
		// remove os caracteres que afetam a formatação em WhatsApp: * _ ~ `
		return text.replace(/([*`])/g, '\\$1');
	}

    data.forEach(entry => {
			const xmlDoc = parser.parseFromString(entry.xml, 'text/xml');
			const defs = xmlDoc.getElementsByTagName('def');

			for (let i = 0; i < defs.length; i++) {
				const raw = defs[i].textContent;
				if (!raw) continue;

				// divide múltiplos significados por linha
				raw.split('\n').forEach(line => {
					const trimmed = line.trim();
					if (trimmed) meanings.push(escapeWhatsAppMarkdown(trimmed));
				});
			}
		});

	
    if (!meanings.length) return null;

	 const formatted = meanings
      .slice(0, 3)
      .map((m, i) => `*${i + 1}.* ${m}`)
      .join("\n");

    const remaining = meanings.length - 3
	const finalFormatted =
		remaining > 0
			? `${formatted}\n_*Mais ${remaining} definiç${remaining == 1 ? 'ão' : 'ões'}*_`
			: formatted;

	return finalFormatted

  } catch (error) {
    console.error("Erro ao buscar significado:", error);
    return null;
  }
}
