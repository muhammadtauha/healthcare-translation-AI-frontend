import { useState } from "react";
import axios from "axios";

function App() {
  const [text, setText] = useState("");
  const [translation, setTranslation] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState("es"); // Default: Spanish

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = false;

  // 🌟 Start Speech Recognition
  const startListening = () => {
    setIsListening(true);
    recognition.start();
    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setText(spokenText);
    };
    recognition.onend = () => setIsListening(false);
  };

  // 🌍 Translate Text via Backend API
  const translateText = async () => {
    if (!text.trim()) {
      alert("Please enter or speak some text first!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/translate", {
        text,
        targetLanguage,
      });

      setTranslation(response.data.translation);
    } catch (error) {
      console.error("Translation Error:", error);
      setTranslation("Translation failed.");
    }
  };

  // 🔊 Speak the Translated Text
  const speakTranslation = () => {
    if (!translation) return;

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(translation);

    // Language map for speech synthesis
    const languageMap = {
      en: "en-US",
      es: "es-ES",
      fr: "fr-FR",
      de: "de-DE",
      ur: "ur-PK",
    };

    utterance.lang = languageMap[targetLanguage] || "en-US";
    synth.speak(utterance);
  };

  return (
    <div className="container">
      <h1>Healthcare Translation App</h1>

      {/* 🔹 Language Selection */}
      <label>
        Select Target Language:
        <select value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)}>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="ur">Urdu</option>
          <option value="en">English</option>
        </select>
      </label>

      <br /><br />

      {/* 🎤 Speech Input */}
      <button className="start-speaking" onClick={startListening} disabled={isListening}>
        {isListening ? "Listening..." : "🎤 Start Speaking"}
      </button>

      <br /><br />

      {/* ✏️ Text Input */}
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Speak or type text..."
      />

      <br /><br />

      {/* 🌍 Translate Button */}
      <button className="translate" onClick={translateText}>
        🌍 Translate
      </button>

      <br /><br />

      {/* 📜 Translation Output */}
      {translation && (
        <div>
          <p><strong>Translation:</strong> {translation}</p>
          <button onClick={speakTranslation}>
            🔊 Speak Translation
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
