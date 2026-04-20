import {BrowserRouter, Routes, Route} from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import CoinFlip from "./pages/CoinFlip"
import AiChatWidget from "./components/AiChatWidget"

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/games/coinflip" element={<CoinFlip />} />
        </Routes>

        {/* Widget'ı buraya (Routing haricine ama tarayıcı içine) koyuyoruz. 
            Böylece kullanıcı hangi sayfaya giderse gitsin sağ altta hep duracak! */}
        <AiChatWidget />
      </BrowserRouter>
    </div>
  )
}

export default App