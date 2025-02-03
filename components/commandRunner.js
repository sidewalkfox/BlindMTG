// https://scryfall.com/docs/api/

// Makes a request to the card API
export function cardRequest(cardName) {
    // API url
    const url = "https://api.scryfall.com/cards/named?fuzzy="

    // Makes API request with fetch
    return fetch(`${url}${cardName}`)
        .then(response => {
            if (response.ok) {
                return response.json(); // Parse the JSON response
            } else {
                console.error(`Request failed with status code: ${response.status}`);
                return null;
            }
        })
        .then(data => {
            if (data) {
                return data; // Processed data
            } else {
                return null; // Failed request
            }
        })
        .catch(error => {
            console.error(`Error occurred: ${error.message}`);
            return null;
        });
}
