import React, { useState } from "react";
import { FaMicrophone } from "react-icons/fa";

const SpeechButton = ({ fieldName, setFieldValue }) => {
    const [listening, setListening] = useState(false);

    const handleStartListening = () => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Your browser does not support Speech Recognition.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        setListening(true);
        recognition.start();

        recognition.onresult = (event) => {
            const spokenText = event.results[0][0].transcript;
            setFieldValue(fieldName, spokenText);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setListening(false);
        };

        recognition.onend = () => {
            setListening(false);
        };
    };

    return (
        <button
            type="button"
            onClick={handleStartListening}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 disabled:opacity-50"
            disabled={listening}
            title={listening ? "Listening..." : "Click to speak"}
        >
            <FaMicrophone className={listening ? "text-red-500" : ""} />
        </button>
    );
};

export default SpeechButton;
