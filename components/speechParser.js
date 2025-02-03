import { symbolToWord, customReplace } from "./dictionary.js";

// Replaces symbols using symbolToWord
function replaceSymbols(input) {
	// Replaces "}{" with "} {"
	input = input.replace(/}\{/g, "} {");

	// Converts {} symbols to words
	input = input.replace(/{[^}]+}/g, (match) => symbolToWord(match));

	return input
}

// Runs checks to make sure text is ready to be output
function stringPreening(input) {
	// Checks to make sure text is not undefined
	input = input ? input : "";

	// Calls replaceSymbols to replace {} with a string with formating
	input = replaceSymbols(input)

	// Replaces custom characters
	input = customReplace(input)

	//return preened text
	return input
}

// Builds each face of a card
function cardFaceBuilder(cardData) {
	// Card name
	let cardName;
	cardName = stringPreening(cardData.name);

	// Mana count
	let manaCount = stringPreening(cardData.mana_cost);
	manaCount = manaCount ? ` costs ${manaCount}` : "";

	// Card type
	let typeLine = stringPreening(cardData.type_line)
	typeLine = typeLine ? `It is type: ${typeLine}` : "";

	// Description
	let oracleText = stringPreening(cardData.oracle_text);
	let flavorText = ` ${stringPreening(cardData.flavor_text)}`;
	let description = `${oracleText}${flavorText}`

	// Power and toughness
	let power = stringPreening(cardData.power);
	let toughness = stringPreening(cardData.toughness);
	let powerTough = power ? `It has a power of ${power} and a toughness of ${toughness}.` : "";

	// Loyalty
	let loyalty = stringPreening(cardData.loyalty)
	loyalty = loyalty ? `It has a loyalty of ${loyalty}.` : "";

	// Defense
	let defense = stringPreening(cardData.defense)
	defense = defense ? `It has a defense of ${defense}.` : "";

	// Puts together and returns the final string
	let outputString = `${cardName}${manaCount}\n${typeLine}\n${description}\n${powerTough}${loyalty}${defense}`
	return outputString;
}

// Creates an output string with proper formating
export function speechParser(cardData) {
	// Stores each card face
	let cardFaces = [];

	// Checks to see if the card has multiple sides
	let cardSideCount = 1;
	if ("card_faces" in cardData) {
		// If the card has more than 1 face, add a prefix to the final string
		cardSideCount = cardData.card_faces.length;
		cardFaces.push(`${stringPreening(cardData.name)} has ${cardSideCount} sides.`)

		// Loops through each card face
		for (let i = 0; i < cardSideCount; i++) {
			// Makes cardData include the data for the current side
			cardFaces.push(` Side ${i + 1}: `); // Says what side it is on
			let currentFaceData = cardData.card_faces[i]; // Use a temporary variable
			cardFaces.push(cardFaceBuilder(currentFaceData));
		}
	} else {
		// If card has only one side
		cardFaces.push(cardFaceBuilder(cardData))
	}

	// Converts cardFaces array to string to be returned
	let finalString = cardFaces.toString();

	return finalString
}
