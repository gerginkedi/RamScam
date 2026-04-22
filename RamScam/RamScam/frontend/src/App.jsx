import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import CoinFlip from "./pages/CoinFlip"
import Test from "./pages/Test"
import Crash from "./pages/Crash"
import BlackJack from "./pages/BlackJack"
import AiChatWidget from "./components/AiChatWidget"
import Games from "./pages/Games"

function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token')
    if (!token) return <Navigate to="/login" replace />
    return children
}

function WidgetWrapper() {
    const location = useLocation()
    const publicPaths = ['/login', '/register']
    const token = localStorage.getItem('token')
    if (publicPaths.includes(location.pathname) || !token) return null
    return <AiChatWidget />
}

function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                    <Route path="/games" element={<ProtectedRoute><Games /></ProtectedRoute>} />
                    <Route path="/games/coinflip" element={<ProtectedRoute><CoinFlip /></ProtectedRoute>} />
                    <Route path="/games/blackjack" element={<ProtectedRoute><BlackJack /></ProtectedRoute>} />
                    <Route path="/crash" element={<ProtectedRoute><Crash /></ProtectedRoute>} />
                    <Route path="/test" element={<ProtectedRoute><Test /></ProtectedRoute>} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
                <WidgetWrapper />
            </BrowserRouter>
        </div>
    )
}

export default App