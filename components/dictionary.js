// Imports json file
import symbols from '../json files/symbology.json' with { type: "json"};

// Replaces characters from the transcript before the card is searched
export function transcriptReplace(input){
	// Replaces "are" with "r" and "you" with "u" (for Ur-Dragon)
	input = input.replace(/\bare\b/g, "r");
	input = input.replace(/\byou\b/g, "u");

	return input
}

// Replaces characters that are not symbols
export function customReplace(input) {
	// Replaces − with -
	input = input.replace(/−/g, '-');

	// Converts negative numbers from -/+ to negative/positive but only if followed by an integer
	input = input.replace(/-(\d)/g, (_, digit) => { return `minus ${digit}`; });
	input = input.replace(/\+(\d)/g, (_, digit) => { return `plus ${digit}`; });

	// Converts roman numeral I to string when followed by " —" (Urza's Saga type cards)
	input = input.replace(/\bI(?= —)/g, 'one');

	// Replaces "/" with " " only when the number before / is an in (power/toughness will not be read as a fraction)
	input = input.replace(/(\d)\//g, '$1 ');

	// Replaces "//" with "/" (Dusk // Dawn type cards)
	input = input.replace(/\/\/ /g, '/');

	return input
}

//https://api.scryfall.com/symbology
// Converts symbol to string using json file
export function symbolToWord(inputSymbol) {
	// Loops through symbol json file to find matching symbol and return string
	for (let i = 0; i < symbols.data.length; i++) {
		if (inputSymbol == symbols.data[i].symbol) {
			//console.log(symbols.data[i].english)
			return symbols.data[i].english;
		}
	}
}
