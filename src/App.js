import React, { useState, useRef } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import "./App.css";
import "./Roboto-Regular"; 

function App() {
  const [step, setStep] = useState(0);
  const [text, setText] = useState("");
  const [emotion, setEmotion] = useState("");
  const [pdfGenerated, setPdfGenerated] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const [audioBlob, setAudioBlob] = useState(null);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" });
        setAudioBlob(blob);
        console.log("Recording stopped and blob created.");
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const handleMicrophoneRecognition = async () => {
    if (!audioBlob) {
      alert("No audio recorded yet!");
      return;
    }

    const formData = new FormData();
    formData.append("audio", audioBlob, "recorded_audio.wav");

    try {
      const response = await axios.post("http://127.0.0.1:5000/speech-to-text", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setText(response.data.transcription);
      setStep(2);
    } catch (error) {
      console.error("Error recognizing speech:", error);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("audio", file);

    try {
      const response = await axios.post("http://127.0.0.1:5000/speech-to-text", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setText(response.data.transcription);
      setStep(2);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleEmotionAnalysis = async () => {
    if (!text || text.trim().length === 0) {
      alert("No transcription available for emotion analysis.");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:5000/analyze-emotion", {
        text: text.trim(),
      });

      console.log("Emotion analysis response:", response.data);

      if (response.data.emotion) {
        setEmotion(response.data.emotion);
      } else {
        alert("No emotion data found in response.");
      }
    } catch (error) {
      console.error("Error analyzing emotion:", error.response?.data || error.message);
      alert("Error analyzing emotion. Please check the server logs.");
    }
  };

  const handleGeneratePDF = () => {
    const doc = new jsPDF({
      unit: "mm",
      format: "a4",
    });

    doc.setFont("Roboto-Regular", "normal");
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const textWidth = pageWidth - margin * 2;
    let currentY = 20;

    doc.setFontSize(18);
    doc.text("Speech Recognition and Emotion Analysis", margin, currentY);
    currentY += 10;

    doc.setFontSize(14);
    doc.text("Transcription:", margin, currentY);
    currentY += 10;

    const wrappedText = doc.splitTextToSize(text, textWidth);
    wrappedText.forEach((line) => {
      doc.text(line, margin, currentY);
      currentY += 8;
    });

    if (emotion) {
      currentY += 10;
      doc.setFontSize(16);
      doc.text("Emotion Detected:", margin, currentY);
      currentY += 10;

      doc.setFontSize(14);
      doc.text(`Label: ${emotion.label}`, margin, currentY);
      currentY += 8;

      doc.text(`Confidence: ${(emotion.score * 100).toFixed(2)}%`, margin, currentY);
    }
    
    doc.save("speech_analysis.pdf");
    setPdfGenerated(true);
  };

  if (step === 0) {
    return (
      <div className="container">
        <h1>Speech Recognition and Emotion Analysis</h1>
        <button onClick={() => setStep(1)}>Speech to Text</button>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="container">
        <h1>Speech to Text</h1>
        <p>Select an option:</p>
        {!isRecording ? (
          <button onClick={handleStartRecording}>Start Recording</button>
        ) : (
          <button onClick={handleStopRecording}>Stop Recording</button>
        )}
        {audioBlob && <button onClick={handleMicrophoneRecognition}>Transcribe Recording</button>}

        <label htmlFor="file-upload" className="button-style">
          Choose File
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".wav"
          onChange={handleFileUpload}
        />

        <button onClick={() => setStep(0)}>Back</button>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="container">
        <h1>Speech Result</h1>
        <p><strong>Transcription:</strong> {text}</p>
        <button onClick={handleEmotionAnalysis}>Analyze Emotions</button>
        <button onClick={handleGeneratePDF}>Generate PDF</button>

        {emotion && (
          <div>
            <h2>Detected Emotion:</h2>
            <p>
              <strong>Label:</strong> {emotion.label}<br />
              <strong>Confidence:</strong> {(emotion.score * 100).toFixed(2)}%
            </p>
          </div>
        )}

        {pdfGenerated && <p>PDF File Generated. Check your downloads folder.</p>}
        <button onClick={() => setStep(0)}>Back to Start</button>
      </div>
    );
  }

  return null;
}

export default App;
