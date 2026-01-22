# BlindMTG

A companion app for the trading card game Magic: The Gathering that allows users to look up cards, track health, and roll dice using speech inputs rather than visual inputs. Designed with the visually impaired in mind, it uses text-to-speech and basic primary colors for better visibility.

### Breakdown YouTube Video
[![YouTube Video Thumbnail](https://img.youtube.com/vi/kcLFb18sB7I/maxresdefault.jpg)](https://www.youtube.com/watch?v=kcLFb18sB7I)

## Inspiration
I was first inspired to make BlindMTG after watching a video on how blind and visually impaired people play Magic: The Gathering. The person in the video explained that he used a [Perkins Brailler](https://en.wikipedia.org/wiki/Perkins_Brailler) to add the card name (often abbreviated), mana cost, and card type to the card sleeve. That was the most information he could include on his cards because of space limitations, so knowing what any given card did was left to memory or having a sighted person read it to him.

Being a computer science student as well as someone interested in the field of assistive technology, I figured that there should be a better way to do this. BlindMTG was the result. BlindMTG allows a blind or visually impaired user to search for a card while only using the name of the card. This makes playing with unfamiliar cards much easier.

## Features

### Card searching
Using the [Scryfall API](https://scryfall.com/docs/api), a user can provide a card's name and hear all relevant card information such as the mana cost, type, oracle and flavor text, power and toughness, and loyalty. [Symbols](https://api.scryfall.com/symbology) are converted into English text for better understandability and the text-to-speech transcript is altered to read more like how a human would read the card (4/4 will be read as "four four" as opposed to "four slash four"). Additionally, for cards with multiple faces, such as "[Tovolar, Dire Overlord](https://scryfall.com/card/sld/1612/)", each side will be read so the card's full context can be heard even when only one side name is given.

To search for a card in BlindMTG, tap and hold the screen for one second; the screen will turn blue to indicate card searching has activated. Then, simply say the name of the card. For cards with non-English names, such as "[Fblthp, the Lost](https://scryfall.com/card/rvr/44/)", the user may spell out any non-English words ("F-B-L-T-H-P the lost").

### Dice rolling

A user may roll a simulated die by using the command `roll [number to be rolled]`. BlindMTG will give a random number from one to the number provided.

### Monarch

A user may crown a monarch by using the command `monarch player [player number]`. This will set that player as the monarch and remove whoever was previously monarch if one was previously appointed. To check which player is currently the monarch, a user can use the command `monarch`, which will return the player who is currently monarch.

### City's Blessing

A user may give a player the city's blessing by using the command `city's blessing player [player number]`. To check who currently has the city's blessing, a user may use the command `city's blessing` which will return all players who currently have the city's blessing.

### Custom counters

A user may create a custom counter using the command `counter create [name of counter]`. The name of the counter must only be one word. This will create a counter with that name for all players with a default value of zero. Once a counter has been created, a user may add to, subtract from, and set this counter using the commands `[counter name] player [player number] plus [amount to be added]`, `[counter name] player [player number] minus [amount to be subtracted]`, and `[counter name] player [player number] set [amount to be set]` respectively. To get what value a counter is currently set to, a user may use the command `[counter name] player [player number]`.

### Health

By default, a health counter will be created, and a starting health value will be added when the user starts a game using the `start` command. The health counter can be edited the same way a custom counter can be.

### Day/night

A user can change the day state to day or the day state to night by using the `day` command or the `night` command respectivly. To check the current day state, a user can use the `day night` command.

## Starting a game

By saying the command `start`, BlindMTG will ask for the number of players and the starting health of all players. The health counter will be set at the starting health. Then, BlindMTG will choose a random player to go first. Starting a game will remove all counters (except for health) and reset monarch and city's blessing values.

## Command reference guide

#### Rolling dice
- Roll die: `Roll [number of die sides]`

#### Monarch
- Crown a monarch: `Monarch player [player number]`
- Check who is monarch: `Monarch`

#### City's blessing
- Give city's blessing: `City's Blessing player [player number]`
- Check who has the city's blessing: `City's Blessing`

#### Custom counters
- Create a new counter: `Counter create [counter name (one word max)]`
- Add to counter: `[counter name] player [player number] plus [number to be added]`
- Subtract from counter: `[counter name] player [player number] minus [number to be subtracted]`
- Set counter: `[counter name] player [player number] set [number to be set to]`
- Get counter value: `[counter name] player [player number]`

#### Health (created after the game has started)
- Add to health: `Health player [player number] plus [number to add]`
- Subtract from health: `Health player [player number] minus [number to subtract]`
- Set health: `Health player [player number] set [number to add]`
- Get health value: `Health player [player number]`

#### Day/Night
- Set day state to day: `Day`
- Set day state to night: `Night`
- Get day state: `Day night`

#### Starting a game
- Start game: `Start`

## Future Improvements
- Settings menu
- IOS support
- Offline mode

## Known Bugs
- After numerous taps, audio will stop playing entirely
- Spam tapping the screen causes app to stop listening
- Long delay between tapping screen and audio playing
- Swiping up to show navigation bar is also treated at tapping the screen