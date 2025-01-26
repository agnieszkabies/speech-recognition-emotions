
# Speech Recognition with Emotion Analysis 🎙️😊😢

## Opis
Ten projekt to aplikacja, która przetwarza mowę użytkownika, zamienia ją na tekst, a następnie analizuje emocje zawarte w treści. Wykorzystuje zaawansowane modele AI:
- **Whisper** do rozpoznawania mowy.
- **Sentiment Classifier** opartego na `cardiffnlp/twitter-xlm-roberta-base-sentiment` do analizy emocji.

Technologie używane w projekcie:
- Backend: **Node.js**, **Python**
- Frontend: **React**
- AI/ML: **Transformers**, **Whisper**

---

## Funkcjonalności
- Rozpoznawanie mowy i konwersja do tekstu.
- Analiza emocji (pozytywne, neutralne, negatywne) w wypowiedzi użytkownika.
- Przejrzysty interfejs użytkownika w React.

---

## Wymagania
Do uruchomienia projektu potrzebujesz:
- **Python 3.9+**
- **Node.js 16+**
- **pip** (do instalowania zależności Pythona)
- **npm** lub **yarn** (do zarządzania pakietami w Node.js)

Zależności:
- Python:
  - `transformers`
  - `torch`
  - `whisper`
  - `numpy`
- Node.js:
  - `express`
  - `body-parser`
  - `cors`
- React:
  - `axios`
  - `react-router-dom`

---

## Instalacja

### Backend
1. Sklonuj repozytorium:
   git clone https://github.com/username/speech-recognition-emotions.git
   cd speech-recognition-emotions/backend

2. Utwórz środowisko wirtualne i zainstaluj zależności:
    python -m venv venv
    source venv/bin/activate  # Linux/Mac
    venv\Scripts\activate     # Windows
    pip install -r requirements.txt

3. Uruchom backend:
    python app.py

### Frontend
1. Przejdź do folderu frontendu:
    cd ../src

2. Zainstaluj zależności:
    npm install

3. npm start

### Jak uzywać?
    Otwórz aplikację w przeglądarce pod adresem:
    http://localhost:3000

### Architektura 

1. Frontend (React)
    Pobiera nagrania audio od użytkownika.
    Wyświetla wyniki analizy emocji.

2. Backend (Node.js):
    Obsługuje żądania HTTP.
    Przesyła dane do serwera Pythona.
3. Serwer Python:
    Przetwarza audio za pomocą modelu Whisper.
    Analizuje emocje za pomocą cardiffnlp/twitter-xlm-roberta-base-sentiment.

### Autorzy 
    Agnieszka Głowacka i Szymon Duda