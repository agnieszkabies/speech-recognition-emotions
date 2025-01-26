from flask import Flask, request, jsonify
import whisper
from transformers import pipeline
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

whisper_model = whisper.load_model("medium", device = 'cpu')
sentiment_classifier = pipeline("sentiment-analysis", model="cardiffnlp/twitter-xlm-roberta-base-sentiment")

@app.route('/speech-to-text', methods=['POST'])
def speech_to_text():
    audio_file = request.files['audio']
    audio_path = f"./temp/{audio_file.filename}"
    audio_file.save(audio_path)
    result = whisper_model.transcribe(audio_path, language="pl")
    return jsonify({"transcription": result["text"]})

@app.route('/analyze-emotion', methods=['POST'])
def analyze_emotion():
    data = request.json
    text = data.get("text", "").strip() 

    try:
        result = sentiment_classifier(text)
        simplified_result = {
            "label": result[0]["label"],
            "score": round(result[0]["score"], 2)
        }
        return jsonify({"emotion": simplified_result})
    except Exception as e:  
        return jsonify({"error": f"Emotion analysis failed: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(debug=True)

'''
which python
source venv/bin/activate
which python
'''