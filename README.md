# Educational Chatbot

A React + Vite-based educational chatbot integrated with the **Google Gemini API**. The application features an AI assistant built specifically for educational purposes, providing clear JSON-structured answers containing thorough explanations, summaries, and learning resources. 

---

## ✨ Features

- **React + Vite** frontend for lightning-fast performance
- **Node.js Express Proxy** to securely interact with the Gemini API (protecting your API key)
- Responsive UI designed for easy learning
- Concurrent execution to run both frontend and backend seamlessly

## 🛠️ Requirements

- **Node.js** (v18.0.0 or higher recommended)
- **npm** (comes with Node.js)
- **Google Gemini API Key** ([Get your API Key here](https://aistudio.google.com/))

---

## ⚙️ Setup & Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <your-repository-url>
   cd Chatbot
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables (API Key)**:
   - Duplicate the `.env.example` file and rename it to `.env`.
   - Open the `.env` file and insert your Google Gemini API Key.
   
   *Example `.env` content:*
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   PORT=3000
   ```

> ⚠️ **Important:** Never hard-code your API key or commit your `.env` file to version control. The repository uses `dotenv` to load the key securely on the backend proxy server.

---

## 🚀 Running the Application

You can launch both the frontend (Vite dev server) and the backend (Express proxy) simultaneously using concurrently:

1. **Start the project**:
   ```bash
   npm start
   ```

2. **Access the application**:
   - The React frontend runs on: `http://localhost:5173`
   - The Express proxy backend runs on: `http://localhost:3000`

---

## 📁 Project Structure

```text
├── .env                  # Environment Variables (Create this file!)
├── server.js             # Express Backend Proxy (Protects API Key)
├── vite.config.js        # Vite Configuration
├── package.json          # Project Dependencies & Scripts
├── public/               # Public assets
└── src/                  # React Frontend Source Code
    ├── api/              # API Clients (Gemini service)
    ├── components/       # Chatbot UI Components
    └── ...
```

## 📝 Scripts

- `npm start` - Starts both frontend and backend servers together.
- `npm run dev` - Starts only the React Next-Gen frontend.
- `npm run server` - Starts only the backend proxy server.
- `npm run build` - Builds the application for production.

