import '../styles/layout.css';
import '../styles/index.css';
import '../styles/CoinFlip.css';
import Layout from '../components/layout';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRam } from '../useRam'

const CHROMA_CONFIG = {
    keyColor: { r: 0, g: 180, b: 0 },
    threshold: 135,
    feather: 30,
};

const VIDEOS = [
    { id: 1, label: 'yazi', src: '/videos/coinflip-tails.mp4' },
    { id: 2, label: 'tura', src: '/videos/coinflip-heads.mp4' },
];

function chromaKeyRemove(imageData, config) {
    const { keyColor, threshold, feather } = config;
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const distance = Math.sqrt(
            (r - keyColor.r) ** 2 +
            (g - keyColor.g) ** 2 +
            (b - keyColor.b) ** 2
        );

        if (distance < threshold) {
            data[i + 3] = 0;
        } else if (distance < threshold + feather) {
            const alpha = ((distance - threshold) / feather) * 255;
            data[i + 3] = alpha;
        }
    }
    return imageData;
}

function CoinFlip() {
    const [blur, setBlur] = useState(() => !sessionStorage.getItem('coinflip_intro_seen'));
    
    const toggleBlur = () => {
    sessionStorage.setItem('coinflip_intro_seen', 'true');
    setBlur(false);
    };

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const animRef = useRef(null);
    const ctxRef = useRef(null);
    const videoEndOutcome = useRef(null); // Video bitince sonucu okumak için

    const [isPlaying, setIsPlaying] = useState(false);

    // --- YENİ STATE'LER ---
    const { ramBalance, addRam, removeRam } = useRam();
    const [betAmount, setBetAmount] = useState('');
    const [result, setResult] = useState(null);   // null | 'win' | 'lose'
    const [betError, setBetError] = useState(''); // Input validation mesajı

    useEffect(() => {
        if (canvasRef.current && !ctxRef.current) {
            ctxRef.current = canvasRef.current.getContext('2d', { willReadFrequently: true });
        }
    }, []);

    const resetGameState = useCallback(() => {
        setIsPlaying(false);
        if (animRef.current) cancelAnimationFrame(animRef.current);
        if (canvasRef.current && ctxRef.current) {
            ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    }, []);

    const processFrame = useCallback(function processFrame() {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;

        if (!video || !canvas || !ctx || video.paused || video.ended) return;

        try {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
            chromaKeyRemove(frame, CHROMA_CONFIG);
            ctx.putImageData(frame, 0, 0);
        } catch (error) {
            console.error("Frame işleme hatası:", error);
            resetGameState();
            return;
        }

        animRef.current = requestAnimationFrame(processFrame);
    }, [resetGameState]);

    const handleVideoLoadedData = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 360;
        }
    };

    const handleVideoPlay = () => {
        if (animRef.current) cancelAnimationFrame(animRef.current);
        animRef.current = requestAnimationFrame(processFrame);
    };

    const handleVideoEnded = () => {
        const outcome = videoEndOutcome.current;
        const bet = parseInt(betAmount);

        if (outcome === 'win') addRam(bet);
        else if (outcome === 'lose') removeRam(bet);

        setResult(outcome);
        resetGameState();
    };

    const handleVideoError = (e) => {
        console.error("Video Oynatma Hatası:", e);
        resetGameState();
    };

    const handleBetInput = (e) => {
        setBetError('');
        setResult(null);
        const val = e.target.value;
        // Sadece pozitif tam sayı kabul et
        if (val === '' || /^\d+$/.test(val)) {
            setBetAmount(val);
        }
    };

    const handleCoin = (choice) => {
        if (isPlaying) return;

        // --- VALIDASYON ---
        const bet = parseInt(betAmount);
        if (!betAmount || isNaN(bet) || bet <= 0) {
            setBetError('Geçerli bir miktar girin.');
            return;
        }
        if (bet > ramBalance) {
            setBetError('Yetersiz RAM bakiyesi.');
            return;
        }

        setBetError('');
        setResult(null);
        resetGameState();
        setIsPlaying(true);

        // Random sonuç seç ve kullanıcı seçimiyle karşılaştır
        const pick = VIDEOS[Math.floor(Math.random() * VIDEOS.length)];
        videoEndOutcome.current = pick.label === choice ? 'win' : 'lose';

        const video = videoRef.current;
        if (video) {
            video.src = pick.src;
            video.load();
            video.play().catch(e => {
                console.error("Play metodu engellendi:", e);
                resetGameState();
            });
        }
    };

    useEffect(() => {
        return () => resetGameState();
    }, [resetGameState]);
    
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
                <div className='coinflip-game' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '60vh', justifyContent: 'center' }}>
                    <div className='game-coin' style={{ width: '100%' }}>
                        <div className='gsp-root' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>

                            {/* CANVAS */}
                            <canvas
                                ref={canvasRef}
                                width={800}
                                height={600}
                                style={{
                                    width: '100%',
                                    maxWidth: '800px',
                                    aspectRatio: '16/9',
                                    backgroundColor: 'transparent',
                                    margin: '20px'
                                }}
                            />

                            {/* SONUÇ MESAJI */}
                            {result === 'win' && (
                                <div className='result-msg result-win' >
                                    <audio autoPlay>
                                        <source src="/sounds/coinflip-win.mp3" type="audio/mpeg" />
                                    </audio>
                                </div>
                            )}
                            {result === 'lose' && (
                                <div className='result-msg result-lose'>
                                    <audio autoPlay>
                                        <source src="/sounds/coinflip-lose.mp3" type="audio/mpeg" />
                                    </audio>
                                </div>
                            )}

                            {/* BAHİS INPUT */}
                            <div className='bet-area'>
                                <input
                                    type='text'
                                    inputMode='numeric'
                                    placeholder='Bahis miktarı (RAM)'
                                    value={betAmount}
                                    onChange={handleBetInput}
                                    disabled={isPlaying}
                                    className='bet-input'
                                />
                                {betError && <span className='bet-error'>{betError}</span>}
                            </div>

                            {/* BUTONLAR */}
                            <div className='gsp-btn-row'>
                                <button
                                    onClick={() => handleCoin('yazi')}
                                    disabled={isPlaying}
                                    className='gsp-coin-btn'
                                >
                                    Yazı
                                </button>
                                <button
                                    onClick={() => handleCoin('tura')}
                                    disabled={isPlaying}
                                    className='gsp-coin-btn'
                                >
                                    Tura
                                </button>
                            </div>

                            <video
                                ref={videoRef}
                                playsInline
                                style={{ display: "none" }}
                                onLoadedData={handleVideoLoadedData}
                                onPlay={handleVideoPlay}
                                onEnded={handleVideoEnded}
                                onError={handleVideoError}
                            />
                        </div>
                    </div>
                </div>
            </Layout>
        </div>
    );
}

export default CoinFlip;