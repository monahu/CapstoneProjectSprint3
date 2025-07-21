# RestJam - Restaurant Social Media Application

A full-stack social media platform for sharing restaurant experiences and recommendations.

## Project Links

FigJam Design Board: https://www.figma.com/board/dfU3ZlTdQUzOBkqz3kDND7/Capstone-FIgJam?node-id=0-1&t=5dUhe3uWqOWyfBnV-1

## Tech Stack

### Frontend

- **React** with Vite for fast development
- **TailwindCSS** + **DaisyUI** for responsive styling
- **Apollo Client** for GraphQL state management
- **Redux Toolkit** for app state
- **Firebase Auth** for authentication
- **React Router** for navigation

### Backend

- **Node.js** + **Express** server
- **Apollo Server** for GraphQL API
- **MongoDB** with Mongoose ODM
- **Firebase Admin SDK** for auth verification
- **Cloudinary** for image storage
- **Stripe** for payment processing

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database
- Firebase project with Auth enabled
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd CapstoneProject0718Fork
   ```

2. **Install dependencies**

   ```bash
   # Install server dependencies
   cd server && npm install

   # Install client dependencies
   cd ../client && npm install
   ```

3. **Set up environment variables**

   **Server (.env in `/server` directory):**

   ```env
   PORT=3500
   NODE_ENV=development
   MONGO_URI=mongodb+srv://your-connection-string

   # Firebase Admin SDK
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY="your-private-key"
   FIREBASE_CLIENT_EMAIL=your-client-email

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret

   # Stripe
   STRIPE_SECRET_KEY=your-stripe-secret-key

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

   **Client (.env in `/client` directory):**

   ```env
   VITE_GRAPHQL_ENDPOINT=http://localhost:3500/graphql
   VITE_APP_MODE=development
   VITE_HAS_BACKEND=true

   # Firebase Client Config
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

4. **Start the development servers**

   ```bash
   # Start backend server (from /server directory)
   npm start

   # Start frontend development server (from /client directory)
   npm run dev
   ```

   - Backend runs on http://localhost:3500
   - Frontend runs on http://localhost:5173
