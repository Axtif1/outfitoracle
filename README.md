# OutfitOracle - Virtual Try-On Web App

A production-ready full-stack MERN application for Virtual Clothing Try-On, powered by Google Gemini 2.0 Flash AI.

## Architecture
- **Frontend**: React, Vite, Tailwind CSS, Redux Toolkit, Framer Motion
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **AI Integration**: Google Generative AI SDK (`gemini-2.0-flash-exp`)
- **Asset Storage**: Cloudinary (Image uploads)

## Setup Instructions

### 1. Backend Setup
1. Open the `virtual-tryon-backend` directory.
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and fill in your API keys (MongoDB, Cloudinary, Gemini).
4. **Seed Database**: Run `node seedClothes.js` to initially populate the clothing gallery.
5. Start development server: `npm run dev` (Runs on http://localhost:5000)

### 2. Frontend Setup
1. Open the `virtual-tryon-frontend` directory.
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` if needed (`VITE_API_URL` uses localhost:5000 by default).
4. Start development web app: `npm run dev` (Runs on http://localhost:5173)

### 3. Usage
- Go to the homepage to upload a photo of a person.
- Select an uploaded clothing item from the gallery.
- Click "Generate Try-On" to run the image through the Gemini 2.0 AI.
- An admin page is available at `/admin` to upload new clothes to the database easily.
