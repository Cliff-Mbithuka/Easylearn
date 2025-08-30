# Easylearn

Easylearn is a full-stack educational platform designed to provide interactive learning experiences for Kenyan students, especially those in Grades 1-9. The project features both a web interface and a USSD/SMS-based interface, making it accessible to users with smartphones and feature phones alike. Easylearn leverages AI to generate curriculum-aligned quiz questions and enhance user engagement.

---

## Features

- **USSD & SMS Learning:** Students can access quizzes and track their progress using any mobile phone via USSD or SMS, powered by Africa's Talking.
- **Web Interface:** A modern React-based frontend allows students to take quizzes, view scores, and manage their profiles.
- **Gamification:** Points, lives, and progress tracking motivate students to keep learning.
- **AI-Generated Content:** Quiz questions are dynamically generated using Google's Gemini AI, ensuring variety and curriculum relevance.
- **SQLite Database:** Lightweight, file-based storage for user progress and session management.
- **Logging & Monitoring:** Winston is used for robust logging and debugging.
- **Environment Management:** dotenv is used for secure configuration.

---

## Tools & Technologies Used

### Backend

- **Node.js & Express:** Core server and API logic.
- **Africa's Talking:** Integration for USSD and SMS services.
- **SQLite:** Simple, persistent storage for user data.
- **Winston:** Logging for debugging and monitoring.
- **dotenv:** Secure management of environment variables.
- **Axios:** HTTP client for making API requests to AI services.

### AI Integration

- **Google Gemini (Generative Language API):**
  - Used to generate unique, curriculum-aligned multiple-choice questions for quizzes.
  - Ensures questions are varied, contextually relevant, and suitable for the target grade.
  - The backend sends prompts to Gemini and parses the responses for use in both USSD and web interfaces.

### Frontend

- **React & TypeScript:** Modern, type-safe UI development.
- **Vite:** Fast development server and build tool.
- **Tailwind CSS:** Utility-first CSS framework for rapid UI styling.
- **Radix UI:** Accessible, unstyled UI primitives for dialogs, tooltips, and more.
- **Lucide Icons:** Icon library for a polished look.
- **React Query:** Data fetching and caching.
- **Custom Hooks & Components:** For toast notifications, dialogs, tooltips, and more.

---

## How It Works

### USSD/SMS Flow

1. **User Dials USSD Code:** The backend receives the request via Africa's Talking.
2. **Session Management:** The backend checks if the user exists and manages quiz sessions, points, and lives.
3. **AI Question Generation:** If a new session is needed, the backend requests new questions from Gemini AI.
4. **Quiz Interaction:** Users answer questions via USSD; feedback and scores are provided in real-time.
5. **SMS Notifications:** At the end of a session or game over, users receive their scores via SMS.

### Web Flow

1. **User Login:** Students log in with their phone number.
2. **Dashboard:** Users select grade and subject, then start a quiz.
3. **Quiz Experience:** Questions are presented one at a time, with progress and score tracking.
4. **Profile & Stats:** Users can view their quiz history and performance.

---

## Getting Started

### Prerequisites

- Node.js (v20+ recommended)
- npm

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Cliff-Mbithuka/Easylearn.git
   cd Easylearn/backend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure Environment Variables:**
   Create a `.env` file in the `backend` directory:
   ```
   AT_USERNAME=your_africastalking_username
   AT_API_KEY=your_africastalking_api_key
   ```
   If using Gemini AI, ensure your API key is set in `controllers/questionController.js`.

4. **Start the backend:**
   ```bash
   npm start
   ```

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd ../frontend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the frontend:**
   ```bash
   npm run dev
   ```

---

## Project Structure

```
Easylearn/
  backend/
    index.js
    controllers/
      dbController.js
      questionController.js
      ussdController.js
      webController.js
    users.db
    .env
    package.json
  frontend/
    src/
      components/
      hooks/
      pages/
      App.tsx
      main.tsx
    public/
    package.json
    tailwind.config.js
    postcss.config.js
```

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss your ideas.

---

## License

[ISC](LICENSE)

---

## Author

Cliff Mbithuka

---
