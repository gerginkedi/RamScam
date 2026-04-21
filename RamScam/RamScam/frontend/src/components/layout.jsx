import '../styles/index.css';
import '../styles/layout.css';
import { useState } from 'react';
import { useRam } from '../useRam';

function RamSetupModal({ onConfirm }) {
    const [mb, setMb] = useState(512);

    return (
        <div className='ram-setup-overlay'>
            <div className='ram-setup-box'>
                <h2>RAM Tahsisi</h2>
                <p>Oyun için ne kadar RAM ayırmak istiyorsunuz?</p>
                <span className='ram-setup-preview'>
                    {mb >= 1024 ? (mb / 1024).toFixed(1) + ' GB' : mb + ' MB'}
                    {' → '}
                    {Math.floor(mb * 100 / 1024)} Chip
                </span>
                <input
                    type='range'
                    min={256}
                    max={2048}
                    step={256}
                    value={mb}
                    onChange={e => setMb(parseInt(e.target.value))}
                    className='ram-setup-slider'
                />
                <div className='ram-setup-range-labels'>
                    <span>256 MB</span>
                    <span>2048 MB</span>
                </div>
                <button className='ram-setup-btn' onClick={() => onConfirm(mb)}>
                    Tahsis Et
                </button>
            </div>
        </div>
    );
}

function Layout({ children }) {
    const { ramBalance, allocatedRam, usedRam, allocateRam } = useRam();
    const [showSetup, setShowSetup] = useState(() => {
    return !sessionStorage.getItem('ram_setup_done');
    });

    const handleConfirm = (mb) => {
        allocateRam(mb);
        sessionStorage.setItem('ram_setup_done', 'true');
        setShowSetup(false);
    };

    const formatRam = (mb) => {
        if (mb === null || mb === undefined) return '—';
        return mb >= 1024 ? (mb / 1024).toFixed(1) + ' GB' : mb + ' MB';
    };

    return (
        <div>
            {showSetup && <RamSetupModal onConfirm={handleConfirm} />}

            <div className='top-bar'>
                <div className="home-btn">
                    <button><a href="/home">RamScam</a></button>
                </div>
                <div className="balance-display">
                    <h2>Chip: {ramBalance} ◈</h2>
                    {allocatedRam && (
                        <h2 className='hafiza-display'>
                            Hafıza: <span className='hafiza-used'>{formatRam(usedRam)}</span> / {formatRam(allocatedRam)}
                        </h2>
                    )}
                </div>
                <div className='auth-container'>
                    <div className="login-btn">
                        <a href="/login">Giriş Yap</a>
                    </div>
                    <div className='register-btn'>
                        <a href="/register">Kaydol</a>
                    </div>
                </div>
            </div>

            <div className='layout'>
                <div className="left-bar">
                    <div className='left-bar-content'>
                        <div className="btn-group">
                            <a href>Popüler Oyunlar</a>
                            <a href>Yeni Oyunlar</a>
                            <a href>En Son Oynanlar</a>
                            <a href="/games">Oyunlar</a>
                        </div>
                        <hr className="divider" />
                        <div className='quick-access'>
                            <a href="/games/coinflip">Coin Flip</a>
                            <a href>Slot Makinesi</a>
                            <a href>Rulet</a>
                            <a href>Mayın Tarlası</a>
                        </div>
                        <br /><br />
                        <hr className="divider" />
                        <div className='other-links'>
                            <a href>İstatistikler</a>
                            <a href>Cansız Destek</a>
                            <a href>Ayarlar</a>
                        </div>
                    </div>
                </div>
                <div className="main-content">
                    {children}
                </div>
                <div className="right-bar"></div>
            </div>
        </div>
    );
}

export default Layout;