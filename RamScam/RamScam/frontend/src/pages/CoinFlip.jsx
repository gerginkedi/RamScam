import '../styles/layout.css';
import '../styles/index.css';
import '../styles/CoinFlip.css';
import Layout from '../components/layout';
import { useState } from 'react';

function CoinFlip() {
    const [blur, setBlur] = useState(true);
    const toggleBlur = () => {
        setBlur(!blur);
    }

    return (
        <div>
            {blur && (
                <div className='intro-blur'>
                    <div className='intro-box'>
                        <h2>Coin Flip Oyununa Hoş Geldiniz!</h2>
                        <p>Kurallar basittir: Tek bir madeni para atılır ve siz yazı mı tura olduğunu tahmin edersiniz. Doğru tahmin yaparsanız ödül kazanırsınız, yanlış tahmin yaparsanız kaybedersiniz.</p>
                        <button onClick={toggleBlur}>Tamam</button>
                    </div>
                </div>
            )}
                <Layout>
                    <h1>Coin Flip Oyunu</h1>
                    <p>Bu sayfada Coin Flip oyunu oynanacak.</p>
                </Layout>         
        </div>
    )
}

export default CoinFlip