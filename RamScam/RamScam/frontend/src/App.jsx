import {BrowserRouter, Routes, Route} from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import CoinFlip from "./pages/CoinFlip"
import Test from "./pages/Test"
import Crash from "./pages/Crash"
import BlackJack from "./pages/BlackJack"
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/games/coinflip" element={<CoinFlip />} />
          <Route path="/test" element={<Test />} />
          <Route path="/crash" element={<Crash />} />
          <Route path="/games/blackjack" element={<BlackJack />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App