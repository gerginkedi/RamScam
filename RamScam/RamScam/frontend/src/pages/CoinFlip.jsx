import '../styles/layout.css';
import '../styles/index.css';
import '../styles/CoinFlip.css';
import Layout from '../components/layout';
import { useCallback, useEffect, useRef, useState } from 'react';

const CHROMA_CONFIG = {
    keyColor: { r: 0, g: 180, b: 0 },
    threshold: 135,
    feather: 30,
};

const VIDEOS = [
    { id: 1, label: 'Yazı', src: '/videos/coinflip-tails.mp4' },
    { id: 2, label: 'Tura', src: '/videos/coinflip-heads.mp4' },
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
    const [blur, setBlur] = useState(true);
    const toggleBlur = () => setBlur(false);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const animRef = useRef(null);
    const ctxRef = useRef(null); // Canvas Context'i burada tutacağız

    const [isPlaying, setIsPlaying] = useState(false);

    // 1. ADIM: Sayfa yüklendiğinde Canvas Context'i GARANTİ OLARAK al
    useEffect(() => {
        if (canvasRef.current && !ctxRef.current) {
            ctxRef.current = canvasRef.current.getContext('2d', { willReadFrequently: true });
        }
    }, []);

    const resetGameState = useCallback(() => {
        setIsPlaying(false);
        if (animRef.current) cancelAnimationFrame(animRef.current);
        
        // Video bittiğinde veya hata verdiğinde ekranı temizlemek istersen (Opsiyonel)
        if (canvasRef.current && ctxRef.current) {
            ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    }, []);

    const processFrame = useCallback(function processFrame() {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;

        if (!video || !canvas || !ctx || video.paused || video.ended) {
            return;
        }

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

    // Video verisi gerçekten okunabilir olduğunda boyutları ayarla
    const handleVideoLoadedData = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        
        if (video && canvas) {
            // Gerçek video boyutunu al, bulamazsa varsayılanı kullan
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 360;
        }
    };

    const handleVideoPlay = () => {
        if (animRef.current) cancelAnimationFrame(animRef.current);
        animRef.current = requestAnimationFrame(processFrame);
    };

    const handleVideoEnded = () => resetGameState();
    const handleVideoError = (e) => {
        console.error("Video Oynatma Hatası:", e);
        resetGameState();
    };

    const handleCoin = () => {
        if (isPlaying) return;

        resetGameState();
        setIsPlaying(true);
        
        const pick = VIDEOS[Math.floor(Math.random() * VIDEOS.length)];
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
                            
                            {/* CANVAS - VİDEO BURADA GÖSTERİLECEK */}
                            <canvas
                                ref={canvasRef}
                                width={640}
                                height={360}
                                style={{ 
                                    width: '100%', 
                                    maxWidth: '640px', 
                                    aspectRatio: '16/9', // Boşken bile yer kaplamasını sağlar
                                    backgroundColor: 'transparent'
                                }}
                            />

                            {/* BUTONLAR - VİDEONUN ALTINDA */}
                            <div className='gsp-btn-row' style={{ display: 'flex', gap: '15px' }}>
                                <button onClick={handleCoin} disabled={isPlaying} className='gsp-coin-btn'>Yazı</button>
                                <button onClick={handleCoin} disabled={isPlaying} className='gsp-coin-btn'>Tura</button>
                            </div>

                            {/* GİZLİ VİDEO KAYNAĞI */}
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