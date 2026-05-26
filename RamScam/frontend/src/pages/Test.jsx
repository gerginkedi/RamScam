import '../styles/index.css';
import { useState } from 'react';
import { useRamBomb } from '../context/RamBombContext';

function Test() {
    const { start, stop } = useRamBomb();
    const [confirmed, setConfirmed] = useState(false);

    return (
        <div style={{ padding: '40px', fontFamily: 'Exo 2, sans-serif' }}>
            <h1 style={{ color: '#e05533' }}>⚠ TEST SAYFASI — GELİŞTİRİCİ ORTAMI</h1>

            <div style={{
                border: '2px solid #e05533',
                borderRadius: '8px',
                padding: '28px',
                marginBottom: '32px',
                backgroundColor: 'rgba(224, 85, 51, 0.08)',
                maxWidth: '680px',
                lineHeight: '1.7'
            }}>
                <h2 style={{ color: '#ff4444', margin: '0 0 16px' }}>
                    🛑 KRİTİK UYARI: RAM BOMBASI AKTİF
                </h2>

                <p style={{ color: '#ff8888', fontWeight: 'bold', margin: '0 0 12px' }}>
                    Bu sayfa production ortamına KESINLIKLE alınmamalıdır.
                </p>

                <p style={{ color: '#ccc', margin: '0 0 10px' }}>
                    <strong style={{ color: '#fff' }}>Ne yapar:</strong> "Başlat" butonuna basıldığında
                    <code style={{ color: '#ff4444', backgroundColor: '#1a1a1a', padding: '2px 6px', borderRadius: '3px', margin: '0 4px' }}>
                        useRamBomb
                    </code>
                    hook'u her frame'de <strong style={{ color: '#ff4444' }}>100MB</strong> büyüklüğünde
                    <code style={{ color: '#ff4444', backgroundColor: '#1a1a1a', padding: '2px 6px', borderRadius: '3px', margin: '0 4px' }}>
                        ArrayBuffer
                    </code>
                    allocate ederek referansları bir dizide tutar.
                    Bu, JavaScript Garbage Collector'ın belleği geri almasını engeller.
                </p>

                <p style={{ color: '#ccc', margin: '0 0 10px' }}>
                    <strong style={{ color: '#fff' }}>Etkisi:</strong> Sanal bellek{' '}
                    <strong style={{ color: '#ff4444' }}>5–6 saniye içinde 70GB+'a</strong> ulaşabilir.
                    Bu noktada işletim sistemi bellek baskısı altında kalır;
                    tarayıcı sekmesi çökebilir, sistem donabilir, diğer uygulamalar kapanabilir
                    ve nadir durumlarda veri kaybı yaşanabilir. MAVİ EKRAN DAHİ OLDUĞU DURUMLAR MEVCUTTUR.
                    <strong style={{ color: '#ff4444', fontWeight: 'bold' }}> SANAL RAMİNİZİN AZ OLMASI ÖNEMLİ DEĞİLDİR.
                        WINDOWS OTOMATİK OLARAK SWAP KAPASİTESİNİ ARTTIRARAK DEVAM EDECEKTİR, BU DA SİSTEMİNİZİN ÇOK DAHA HIZLI BİR ŞEKİLDE ÇÖKMESİNE NEDEN OLUR.</strong>
                </p>

                <p style={{ color: '#ccc', margin: '0 0 10px' }}>
                    <strong style={{ color: '#fff' }}>Neden var:</strong> Bu fonksiyon RamScam'in
                    "RAM dolduğunda sistem çöküyor" oyun mekaniğinin prototip testidir.
                    Gerçek kullanıcı akışında bu işlem simüle edilir, gerçek bellek yazımı yapılmaz.
                    Bu sayfa yalnızca <strong style={{ color: '#fff' }}>GC bypass davranışını doğrulamak</strong> için mevcuttur.
                </p>

                <p style={{ color: '#ccc', margin: '0 0 10px' }}>
                    <strong style={{ color: '#fff' }}>Durdurma:</strong> "Durdur" butonuna basıldığında
                    referanslar serbest bırakılır ve GC devreye girer. Ancak sistem zaten
                    kritik bellek baskısına girdiyse durdurma yeterli olmayabilir —
                    tarayıcıyı ve gerekirse sistemi yeniden başlatın.
                </p>

                <p style={{ color: '#ffaa00', fontWeight: 'bold', margin: '0 0 20px' }}>
                    ⚡ Sadece geliştirici makinasında, diğer çalışmalar kaydedildikten sonra test edin.
                    RAM miktarınızın en az 2 katı swap alanınız yoksa başlatmayın.
                </p>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: '#ccc' }}>
                    <input
                        type='checkbox'
                        checked={confirmed}
                        onChange={e => setConfirmed(e.target.checked)}
                        style={{ width: '18px', height: '18px', accentColor: '#e05533' }}
                    />
                    Yukarıdaki riskleri okudum, anlıyorum ve devam etmek istiyorum.
                </label>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
                <button
                    onClick={() => start(100)}
                    disabled={!confirmed}
                    style={{
                        padding: '10px 24px',
                        backgroundColor: confirmed ? '#e05533' : '#444',
                        color: confirmed ? '#fff' : '#888',
                        border: 'none',
                        borderRadius: '5px',
                        fontFamily: 'Exo 2, sans-serif',
                        fontSize: '16px',
                        cursor: confirmed ? 'pointer' : 'not-allowed',
                        transition: '300ms'
                    }}
                >
                    RAM Bombası Başlat (100MB/frame)
                </button>
                <button
                    onClick={stop}
                    style={{
                        padding: '10px 24px',
                        backgroundColor: 'transparent',
                        color: '#aaa',
                        border: '1px solid #555',
                        borderRadius: '5px',
                        fontFamily: 'Exo 2, sans-serif',
                        fontSize: '16px',
                        cursor: 'pointer',
                        transition: '300ms'
                    }}
                >
                    Durdur
                </button>
            </div>
        </div>
    )
}

export default Test