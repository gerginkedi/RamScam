import '../styles/index.css';
import { useRamBomb } from '../context/RamBombContext';

function Test() {
    const { start, stop } = useRamBomb();

    return (
        <div>
            <h1>Test Sayfası</h1>
            <p>Bu sayfa sadece test amaçlıdır.</p>
            <button onClick={() => start(100)}>RAM Bombası Başlat (100MB/frame)</button>
            <button onClick={stop}>RAM Bombasını Durdur</button>
        </div>
    )
}

export default Test