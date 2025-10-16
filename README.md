# 🏆 Live Auction System

A real-time auction application built with **Node.js**, **Express**, **Socket.IO**, **Server-Sent Events (SSE)**, and **React** with **TypeScript**.

## 🚀 Features

- **Real-time Bidding**: Live auction with WebSocket and SSE support
- **Multiple Communication Methods**: WebSocket, SSE, and REST API
- **Single Product Auction**: Focused on one auction item
- **Cross-tab Synchronization**: Updates across multiple browser tabs
- **Toast Notifications**: User feedback for bids and connection status
- **Backend-driven State**: Server as single source of truth

## 🏗️ Architecture

### Backend
- **Express.js** server with TypeScript
- **Socket.IO** for real-time WebSocket communication
- **Server-Sent Events (SSE)** for alternative real-time updates
- **REST API** for auction operations
- **Single Product Model** with bid management

### Frontend
- **React** with TypeScript
- **Context API** for state management
- **Custom Hooks** for SSE and WebSocket logic
- **Modular Architecture** with separated concerns
- **Tailwind CSS** for styling

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation & Running

1. **Clone the repository**
   ```bash
   git clone https://github.com/KareemAllam/realtime-auction
   cd Auction
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Run the application**
   ```bash
   # Terminal 1: Start backend server
   cd backend
   npm run dev

   # Terminal 2: Start frontend development server
   cd frontend
   npm start
   ```

4. **Access the application**
   - Open `http://localhost:3000` in your browser
   - Navigate between different views: Auction, WebSockets, Server-Sent Events

## 📱 Available Views

- **Auction**: Main auction interface with WebSocket connection
- **WebSockets**: WebSocket connection monitoring and controls
- **Server-Sent Events**: SSE-based auction with REST API integration

## 🔧 Development

- **Backend**: `http://localhost:5000`
- **Frontend**: `http://localhost:3000`
- **WebSocket**: `ws://localhost:5000`
- **SSE**: `http://localhost:5000/api/sse`

## 📁 Project Structure

```
Auction/
├── backend/                 # Express.js server
│   ├── src/
│   │   ├── routes/         # API routes (products, SSE)
│   │   ├── socket/         # Socket.IO logic
│   │   ├── models/         # Data models
│   │   └── app.ts          # Server setup
├── frontend/               # React application
│   ├── src/
│   │   ├── sse/           # SSE implementation
│   │   ├── websocket/     # WebSocket implementation
```

---

#### Happy Bidding! 🎉**
