import { useState } from 'react';
import { StyleSheet, Pressable, StatusBar } from 'react-native';
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition'; //https://www.npmjs.com/package/expo-speech-recognition
import * as textToSpeech from 'expo-speech'; //https://docs.expo.dev/versions/latest/sdk/speech/
import { Audio } from "expo-av"; //https://docs.expo.dev/versions/latest/sdk/av/
import * as NavigationBar from 'expo-navigation-bar'; //https://docs.expo.dev/versions/latest/sdk/navigation-bar/

import { wordsToNumbers } from "words-to-numbers"; //https://www.npmjs.com/package/words-to-numbers

import { rollDice, setMonarch, giveBlessing, createCounters, editCounters } from './components/commands';
import { cardRequest } from './components/commandRunner';
import { speechParser } from './components/speechParser';

export default function App() {
  // Player count
  const [playerCount, setPlayerCount] = useState(0);

  // Monarch
  const [currentMonarch, setCurrentMonarch] = useState();

  // City's Blessing
  const [hasBlessing, setHasBlessing] = useState([]);

  // Counters
  const [counters, setCounters] = useState({
    "health": [],
  });

  // Start state
  const [startState, setStartState] = useState(0);

  // Type of press states
  const [pressState, setPressState] = useState("");

  // Makes the text to speech say input
  function startSpeaking(input) {
    textToSpeech.speak(input, {
      onDone: () => {
        // Changes background color
        setBgColor('#000000'); //Black
      },
    });
  }

  // Plays sound
  async function playSound(soundFile) {
    let sound;

    // Select the sound file based on input
    if (soundFile === "recording") {
      ({ sound } = await Audio.Sound.createAsync(require("./audio/Recording.wav")));
    } else if (soundFile === "card") {
      ({ sound } = await Audio.Sound.createAsync(require("./audio/Card.wav")));
    } else if (soundFile === "aborted") {
      ({ sound } = await Audio.Sound.createAsync(require("./audio/Aborted.wav")));
    }

    if (sound) {
      await sound.setVolumeAsync(0.5);
      await sound.playAsync();
    }
  }

  // Turns transcript into an array with each word as a value as well as other things to clean the string
  function stringToArray(input) {
    let output = input

    // Converts to lowercase
    output = output.toLowerCase();

    // Converts all words to numbers
    output = String(wordsToNumbers(output));

    // Splits each word into values by spaces
    output = output.split(" ");

    return output
  }

  // Background color state
  const [bgColor, setBgColor] = useState('#000000');

  // Makes navigation bar only show when swiped up
  NavigationBar.setBehaviorAsync('overlay-swipe')
  NavigationBar.setVisibilityAsync("hidden");

  // Speech to text states
  const [transcript, setTranscript] = useState("");
  const [isRecognizing, setIsRecognizing] = useState(false);

  // Speech to text event listeners
  // Runs when the speech to text has started listening
  useSpeechRecognitionEvent("start", () => {
    // Changes background color
    setBgColor('#ff0000'); //Red
    setIsRecognizing(true);
  });

  // Runs when the speech to text has stopped listening
  useSpeechRecognitionEvent("end", () => {
    setIsRecognizing(false);

    // Runs if no speech was detective, either because nothing was said or they aborted the speech recognition
    if (transcript == "") {
      // Changes background color
      setBgColor('#000000'); //Black
      return;
    } else {
      // Changes background color
      setBgColor('#00ff00'); //Green
    }

    // Changes listen function based on if it was a quick or long press
    if (pressState == "long") {
      // Requests card data from API
      cardRequest(transcript)
        .then(cardData => {
          if (cardData) {
            // Sends card data to the speech parser
            const output = speechParser(cardData);

            // Speaks the output
            startSpeaking(output);

          } else {
            console.log("Failed to fetch card data.");
            //textToSpeech.speak(`I could not find a card with the name "${transcript}".`);
            startSpeaking(`I could not find a card with the name "${transcript}".`);
          }
        })
        .catch(error => {
          console.error("Error fetching card data:", error);
          startSpeaking("There was an error fetching the card data.");
        });
    } else if (pressState == "quick") {
      // Converts a string to an array of words
      let inputArray = stringToArray(transcript);

      // Start setup
      if (startState == 1) {
        // Number of players
        setPlayerCount(Number(inputArray[0]));

        setStartState(2);
        startSpeaking("Starting health?");

      } else if (startState == 2) {
        let startingHealth = Number(inputArray[0]);

        // Adds starting health to player health array for each player
        let healthArray = {};

        // Sets starting health value for every value in array
        healthArray["health"] = new Proxy([], {
          get(target, prop) {
            return prop in target ? target[prop] : startingHealth;
          }
        });

        setCounters(healthArray);

        // Chooses player to go first
        let firstPlayer = Math.floor(Math.random() * playerCount) + 1;
        startSpeaking(`Game has started. Player ${firstPlayer} will go first.`);

        // Reverts the start state back to 0
        setStartState(0);

        // Reverts monarch and city's blessing back to default values
        setCurrentMonarch();
        setHasBlessing([]);
      }

      // Start
      if (inputArray[0] == "start") {
        startSpeaking("How many players?");
        setStartState(1);

        // Dice roll
      } else if (inputArray[0] == "roll") {
        let diceMax = inputArray[1] ? Number(inputArray[1]) : undefined;

        startSpeaking(rollDice(Number(diceMax)))

        // Set monarch
      } else if (inputArray[0] == "monarch") {
        let referencePlayer = inputArray[2] ? Number(inputArray[2]) : undefined;

        // Runs the setMonarch string by sending the input, the reference player, and the current monarch
        let [monarchString, newMonarch] = setMonarch(inputArray, referencePlayer, currentMonarch);

        startSpeaking(monarchString);

        // Sets the newly appointed monarch
        setCurrentMonarch(newMonarch);

        // Set city's blessing
      } else if (inputArray[1] == "blessing") {
        let referencePlayer = inputArray[3] ? Number(inputArray[3]) : undefined;

        // Runs the setMonarch string by sending the input, the reference player, and the current monarch
        let [blessingString, newBlessing] = giveBlessing(inputArray, referencePlayer, hasBlessing);

        startSpeaking(blessingString);

        // Sets the newly appointed monarch
        setHasBlessing(newBlessing);

        // Edit counters
      } else if (inputArray[0] == "counter") {
        // Runs createCounters by sending the input and the current counter dictionary
        let [counterString, newCounter] = createCounters(inputArray, counters);

        startSpeaking(counterString);

        // Updates the counters
        setCounters(newCounter);

        // Edit specific counter
      } else if (inputArray[0] in counters) {
        let counterDictionary = counters;
        let referenceCounter = inputArray[0];
        let referenceArray = counters[referenceCounter];
        let referencePlayer = inputArray[2] ? Number(inputArray[2]) : undefined;

        // Runs editCounters by sending the input, reference player, referenced array, and reference counter
        let [arrayString, newValue] = editCounters(inputArray, referencePlayer, referenceArray[referencePlayer - 1], referenceCounter);

        startSpeaking(arrayString);

        // Update the array
        referenceArray[referencePlayer - 1] = newValue;
        counterDictionary[referenceCounter] = referenceArray;
        setCounters(counterDictionary);

      } else {
        // Gives an error but only if the user is not currently starting the game
        if (startState == 0) {
          startSpeaking(`No command or counter was found for ${transcript}.`);
        }
      }
    }
  });

  // Runs when the program is ready to display a result
  useSpeechRecognitionEvent("result", (event) => {
    setTranscript(event.results[0]?.transcript);
  });

  // Runs when an error in the speech to text has occured
  useSpeechRecognitionEvent("error", (event) => {
    console.log("error code:", event.error, "error message:", event.message);
  });

  // Ensures permissions are granted first
  const handleStart = async () => {
    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!result.granted) {
      console.warn("Permissions not granted", result);
      return;
    }

    // Start speech recognition
    ExpoSpeechRecognitionModule.start({
      lang: "en-US",
      interimResults: true,
      maxAlternatives: 1,
      requiresOnDeviceRecognition: true,
    });
  };

  // Returns what is displayed on the screen
  return (
    <>
      <StatusBar hidden={true} />
      <Pressable
        style={[styles.container, { backgroundColor: bgColor }]}
        // Starts listening on first tap
        onPressIn={async () => {
          const isSpeaking = await textToSpeech.isSpeakingAsync();

          // Resets transcript back to ""
          setTranscript("")

          // Checks to see if the tts is already speaking. If it is, stop.
          if (isSpeaking) {
            textToSpeech.stop();

            // Changes background color
            setBgColor('#000000'); //Black

            // Checks if speech to text is listening, if it is, stop.
          } else if (isRecognizing) {
            ExpoSpeechRecognitionModule.abort();

            // Changes background color
            setBgColor('#000000'); //Black

            // Play aborted sound
            playSound("aborted");

            // If none of this is true, start speech to text
          } else {
            // Play start sound
            playSound("recording");

            handleStart();
          }
        }}
        // If that tap was a quick tap, start listening for commands
        onPress={() => {
          setPressState("quick");
        }}
        // If that tap was a long tap (1000ms), start listening for cards
        onLongPress={() => {
          setPressState("long");
          setBgColor('#0000ff'); //Blue

          // Play card sound
          playSound("card");
        }}
        delayLongPress={1000}
      />
    </>
  );
}

// Style sheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
