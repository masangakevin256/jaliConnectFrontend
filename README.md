# Jali Connect - Frontend

![Jali Connect Logo](public/vite.svg)

Jali Connect is a premium, state-of-the-art mental health orchestration platform designed to bridge the gap between users and specialized counseling services. This frontend implementation provides a professional, warm, and highly interactive user experience.

## ✨ Key Features

### 👤 User Dashboard
*   **Daily Check-ins**: Interactive mood tracking with visual feedback and history.
*   **Session Management**: Request, view, and join counseling sessions seamlessly.
*   **AI Mental Health Assistant**: 24/7 support using specialized AI models.
*   **Growth Tracking**: Visualize wellness trends with beautiful Recharts integration.

### 🩺 Counselor Dashboard
*   **Client Management**: Comprehensive overview of assigned clients and their history.
*   **Live Sessions**: Real-time communication interface with synchronized state.
*   **Practice Analytics**: Track session ratings and client progress metrics.
*   **Schedule Overview**: Efficient management of daily and weekly appointments.

### ⚙️ Admin Dashboard
*   **Platform Orchestration**: High-level metrics on user growth and session volume.
*   **System Health**: Real-time monitoring of server and database status.
*   **Staff Management**: Directory of licensed professionals and role assignments.

## 🎨 Design Documentation

The application features a **Premium Design System** built on a warm Teal and Orange palette:

*   **Color Tokens**: Uses `--primary-teal` (#2EC4B6) and `--accent-orange` (#F4A261).
*   **Glassmorphism**: Integrated translucent panels with backdrop blur for a modern aesthetic.
*   **Elevation**: Multi-layered shadow system for clear component hierarchy.
*   **Animations**: Smooth entry animations (`.animate-up`) and micro-interactions for a reactive feel.
*   **Typography**: Clean, professional Inter font with optimized line-height for readability.

## 🛠 Tech Stack

*   **Framework**: [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Bootstrap 5](https://getbootstrap.com/) + Custom Design System
*   **Icons**: [React Icons (Fi)](https://react-icons.github.io/react-icons/)
*   **Charts**: [Recharts](https://recharts.org/)
*   **Notifications**: [React Hot Toast](https://react-hot-toast.com/)
*   **Routing**: [React Router v6](https://reactrouter.com/)
*   **Real-time**: [Socket.io Client](https://socket.io/)

## 📂 Project Structure

```text
src/
├── api/            # Base API configurations and interceptors
├── components/     # UI Components organized by feature (Auth, Dashboard, Layout)
├── context/        # Global state management (AuthContext)
├── hooks/          # Domain-specific custom hooks (useAuth, useSocket)
├── pages/          # Root page level components and routing
├── services/       # API abstraction layer for backend communication
├── styles/         # Global design system and custom CSS variables
└── types/          # Shared TypeScript interfaces and types
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment (Create `.env` if necessary):
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_SOCKET_URL=http://localhost:5000
   ```
4. Start development server:
   ```bash
   npm run dev
   ```

## 📜 Deployment
To create a production build:
```bash
npm run build
```
The output will be in the `dist/` folder, ready for static hosting.

---
Built with ❤️ for mental wellness by Jali Connect Team.
