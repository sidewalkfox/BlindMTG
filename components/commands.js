// Run dice roll command
export function rollDice(diceMax) {
	// Gives an error if no number followed "roll"
	if (!diceMax) {
		return `No number was given.`
	}

	// Gets a random number from 1 - diceMax
	let randomNumber = Math.floor(Math.random() * diceMax) + 1;

	return `Rolled a ${diceMax} sided die and got ${randomNumber}.`
}

// Gives player monarch
export function setMonarch(input, referencePlayer, monarch) {
	// If the command starts with "Monarch player" then set currently monarch to referenced player
	if (input[1] == "player") {
		// Handles error if no player name was given
		if (!referencePlayer) {
			return ["No player was given.", monarch]
		}

		return [`Player ${referencePlayer} is now monarch.`, referencePlayer]

		// If user only says "Monarch" then read out who is currently monarch
	} else {
		// If there is a current monarch, read out current monarch
		if (monarch) {
			return [`Player ${monarch} is currently the monarch.`, monarch]

			// If there is not a current monarch, then say as such
		} else {
			return [`Nobody is currently the monarch.`, monarch]
		}
	}
}

// Converts the array of blessed players into English
function blessedPlayers(indices) {
	// Adds +1 to each element in indices to account for arrays starting at 0
	const playerIndices = indices.map(player => player + 1);

	// If there is only one person with the city's blessing using singular
	if (playerIndices.length == 1) {
		return `Player ${playerIndices[0]} has the city's blessing.`

		// If there is more than one player with the city's blessing, use plurar
	} else {
		// Splits up the last and all but last to make sure grammar is proper
		const allButLast = playerIndices.slice(0, -1).join(', ');
		const last = playerIndices[playerIndices.length - 1];

		return `Player's ${allButLast}, and ${last} have the city's blessing.`
	}
}

// Gives player city's blessing
export function giveBlessing(input, referencePlayer, hasBlessing) {
	// If the third word in the array is player, give referenced player city's blessing
	if (input[2] == "player") {
		// Handles error if no player name was given
		if (!referencePlayer) {
			return ["No player was given.", hasBlessing]
		}

		// Creates an array that is a copy of the current blessing values
		let blessingArray = hasBlessing;
		blessingArray[referencePlayer - 1] = true;

		return [`Player ${referencePlayer} has been given the city's blessing.`, blessingArray]

		// If the user only says "City's blessing", then read out who has the city's blessing
	} else {
		// Gets all array locations where true is
		const indices = hasBlessing
			.map((value, index) => value === true ? index : -1)
			.filter(index => index !== -1);

		// Checks to make sure at least one person has city's blessing
		if (indices.length > 0) {
			return [blessedPlayers(indices), hasBlessing]
		} else {
			return ["Nobody has the city's blessing.", hasBlessing]
		}
	}
}

// Creates counters
export function createCounters(input, counters) {
	// Gives error if only "counter" was said
	if (input.length <= 1) {
		return ["No counter command was given.", counters]

	// Gives error if only "counter [command]"
	} else if (input.length <= 2) {
		return ["No counter name was given.", counters]
	}

	// Creates a counter
	if (input[1] == "create") {
		let counterName = input[2];

		// Checks if the counter already exists
		if (counterName in counters) {
			return [`${counterName} is already a counter.`, counters]

			// Adds counter to dictionary
		} else {
			// Creates an array and sets every value to 0
			counters[counterName] = new Proxy([], {
				get(target, prop) {
					return prop in target ? target[prop] : 0;
				}
			});

			return [`Added counter ${counterName}.`, counters]
		}
	}
}

// Edits specific counter "[referenceCounter] player 1 minus 1"
export function editCounters(input, referencePlayer, referenceData, referenceCounter) {
	let counterDelta = Number(input.at(-1));

	// Handles error if only counter name was said
	if (!referencePlayer) {
		return ["No player was given.", referenceData]
	}

	// Subtract from counter
	if (input.at(-2) == "-" || input.at(-2) == "minus") {
		referenceData -= counterDelta

		return [`Subtracted ${counterDelta} from player ${referencePlayer}'s ${referenceCounter}. They now have ${referenceData}.`, referenceData]

		// Add to counter
	} else if (input.at(-2) == "+" || input.at(-2) == "plus") {
		referenceData += counterDelta

		return [`Added ${counterDelta} to player ${referencePlayer}'s ${referenceCounter}. They now have ${referenceData}.`, referenceData]

		// Set counter directly
	} else if (input.at(-2) == "set") {
		referenceData = counterDelta

		return [`Set player ${referencePlayer}'s ${referenceCounter} to ${counterDelta}.`, referenceData]

	} else {
		return [`Player ${referencePlayer}'s ${referenceCounter} is ${referenceData}.`, referenceData]
	}
}