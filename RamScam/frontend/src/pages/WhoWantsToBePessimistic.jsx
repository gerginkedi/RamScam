import React, { useState, useEffect } from 'react';
import Layout from '../components/layout';
import '../styles/WhoWantsToBePessimistic.css';

const QUESTIONS = [
    {
        q: "Hayatının geri kalanında sadece birini seçebilirsin.",
        a: "Seni çok seven ama senin sevemediğin biriyle olmak",
        b: "Çok sevdiğin ama seni hiçbir zaman sevmeyecek biriyle olmak"
    },
    {
        q: "Hangisini tercih edersin?",
        a: "Geçmişindeki en mutlu gününü tekrar yaşamak ama sonrasında bugüne dönmek",
        b: "Gelecekte yaşayacağın en mutlu günü görmek ama ona ulaşamadan ölmek"
    },
    {
        q: "Bir seçim yapmak zorundasın.",
        a: "Herkes seni hatırlayacak ama kimse seni gerçekten tanımayacak",
        b: "Kimse seni hatırlayacak ama seni tanıyan herkes seni çok sevecek"
    },
    {
        q: "Bir düğmeye basacaksın.",
        a: "Tüm pişmanlıklarını unutacaksın",
        b: "Tüm hatalarını düzelteceksin ama anıları silemeyeceksin"
    },
    {
        q: "Hangisi daha ağır gelir?",
        a: "Hayatının aşkını hiç tanımamış olmak ona yaklaşıyor gibi hissedip hiçbir zaman ulaşamamak",
        b: "Tanıyıp sonsuza kadar kaybetmek"
    },
    {
        q: "Bir gerçek öğreniyorsun.",
        a: "Hayatındaki herkes sana her zaman yalan söyledi",
        b: "Sen hayatındaki herkese fark etmeden zarar verdin"
    },
    {
        q: "Birini kurtarabilirsin.",
        a: "Şu ana kadar yaşadığın kendini",
        b: "Gelecekteki kendini"
    },
    {
        q: "Bir kapı açılacak.",
        a: "Hiç yaşanmamış ihtimallerini göreceksin",
        b: "Kaçırdığın fırsatların sonucunu göreceksin"
    },
    {
        q: "Hangisi daha ağır gelir?",
        a: "Seni hiç kimsenin anlamadığını bilmek",
        b: "Seni anlayan tek kişinin artık hayatında olmaması"
    },
    {
        q: "Hangisini tercih edersin?",
        a: "Seni üzen herkes neden yaptığını açıklayacak",
        b: "Seni mutlu eden herkes aslında hangi çıkarlarla yaptığını açıklayacak"
    }
];

function WhoWantsToBePessimistic() {
    const [showWarning, setShowWarning] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [brightness, setBrightness] = useState(100);

    useEffect(() => {
        // Cleanup: Reset brightness when leaving the page
        return () => {
            window.dispatchEvent(new CustomEvent('pessimistBrightness', {
                detail: { brightness: 100 }
            }));
        };
    }, []);
    const [gpuClicks, setGpuClicks] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const [showOverthink, setShowOverthink] = useState(false);

    const handleAnswer = () => {
        if (currentIndex < QUESTIONS.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setIsGameOver(true);
        }
    };

    const handleGpuUse = () => {
        if (gpuClicks >= 4) return;

        const NewGpuClicks = gpuClicks + 1;
        const newBrightness = Math.max(0, brightness - 25);

        setGpuClicks(NewGpuClicks);
        setBrightness(newBrightness);

        // Tell the header to update
        window.dispatchEvent(new CustomEvent('pessimistBrightness', {
            detail: { brightness: newBrightness }
        }));

        if (NewGpuClicks === 4) {
            // Yavaş kararma için 1 saniye bekle, sonra Overthink ekranını aç
            setTimeout(() => {
                setShowOverthink(true);
            }, 1000);
        } else {
            handleAnswer();
        }
    };

    if (showOverthink) {
        return (
            <div
                className='overthink-screen'
                onClick={() => window.location.href = '/home'}
                style={{ cursor: 'pointer' }}
            >
                {/* Background Music */}
                <iframe
                    width="0"
                    height="0"
                    src="https://www.youtube.com/embed/Aahhz8fTcGg?start=70&autoplay=1&mute=0&controls=0"
                    title="Overthink Music"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    style={{ position: 'absolute', opacity: 0 }}
                ></iframe>

                <div className='overthink-text'>ŞİMDİ OVERTHINK ZAMANI</div>
                <div style={{ color: 'rgba(255,255,255,0.2)', position: 'absolute', bottom: '40px', fontSize: '0.8rem', letterSpacing: '2px' }}>
                    [ AYRILMAK İÇİN TIKLAYIN ]
                </div>
            </div>
        );
    }

    return (
        <Layout>
            {showWarning && (
                <div className='intro-blur' onClick={() => window.location.href = '/home'}>
                    <div className='intro-box' onClick={(e) => { e.stopPropagation(); }}>
                        <h2>☣ DİKKAT: YÜKSEK KARAMSARLIK</h2>
                        <p>
                            Bu oyun tamamen kişinin düşünmeye cesaret edemeyeceği sorular üzerinde toplanmıştır.
                            Eğer derin düşüncelere dalmak, varoluşsal sancılar çekmek istemiyorsanız bu oyunu oynamayınız.
                            <br /><br />
                            <strong>⚠️ Unutmayın: Sadece 4 kez cevaplardan kaçma (GPU Zorlama) hakkınız var!</strong>
                        </p>
                        <button
                            onClick={() => setShowWarning(false)}
                            style={{ padding: '10px 25px', fontSize: '0.9rem', width: 'auto' }}
                        >
                            KABUL ET VE BAŞLA
                        </button>
                    </div>
                </div>
            )}

            {/* Global Darkening Overlay - Bütün Ekranı Kaplayan Karartma */}
            <div
                className='global-darkness-overlay'
                style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'black',
                    opacity: (100 - brightness) / 100,
                    pointerEvents: 'none',
                    zIndex: 9998, /* Intro ve modal'ların bir tık altında */
                    transition: 'opacity 0.8s ease'
                }}
            />

            <div className='pessimist-root'>
                <h1 className='pessimist-title'>Kim Karamsar Olmak İster?</h1>

                {!isGameOver ? (
                    <div className='pessimist-board'>
                        <div className='q-progress'>
                            <div
                                className='q-progress-bar'
                                style={{ width: `${((currentIndex + 1) / QUESTIONS.length) * 100}%` }}
                            />
                        </div>

                        <div className='question-text'>
                            {QUESTIONS[currentIndex].q}
                        </div>

                        <div className='options-grid'>
                            <button className='option-btn' onClick={handleAnswer}>
                                <span>A</span>
                                {QUESTIONS[currentIndex].a}
                            </button>
                            <button className='option-btn' onClick={handleAnswer}>
                                <span>B</span>
                                {QUESTIONS[currentIndex].b}
                            </button>
                        </div>

                        <button className='gpu-trigger' onClick={handleGpuUse}>
                            ⚠ Ekran Kartımı Kullan ({4 - gpuClicks} Hak Kaldı)
                        </button>

                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '10px' }}>
                            Soru {currentIndex + 1} / {QUESTIONS.length}
                        </div>
                    </div>
                ) : (
                    <div className='pessimist-board final-screen'>
                        <h2>Oyun Bitti</h2>
                        <p className='question-text'>Karamsarlık seviyeniz analiz edildi. Zihninizdeki yüklerle baş başasınız.</p>
                        <button
                            className='ai-chat-new-fact-btn'
                            style={{ maxWidth: '200px' }}
                            onClick={() => window.location.reload()}
                        >
                            Yeniden Dene
                        </button>
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default WhoWantsToBePessimistic;
