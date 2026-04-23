import '../styles/index.css';
import '../styles/layout.css';
import { useEffect, useState } from 'react';
import { useRam } from '../useRam';
import { useShards } from '../useShards';
import { useBuffs } from '../useBuffs';
import { useNavigate } from 'react-router-dom';

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
    const { shardBalance } = useShards();
    const { activeBuffs } = useBuffs();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [showSetup, setShowSetup] = useState(() => {
        return !sessionStorage.getItem('ram_setup_done');
    });

    useEffect(() => {
        if (allocatedRam && ramBalance <= 0) {
            navigate('/crash');
        }
    }, [ramBalance, allocatedRam, navigate]);

    const handleConfirm = (mb) => {
        allocateRam(mb);
        sessionStorage.setItem('ram_setup_done', 'true');
        setShowSetup(false);
    };

    const formatRam = (mb) => {
        if (mb === null || mb === undefined) return '—';
        return mb >= 1024 ? (mb / 1024).toFixed(1) + ' GB' : mb + ' MB';
    };

    const activeBuffList = Object.values(activeBuffs);

    return (
        <div>
            {showSetup && <RamSetupModal onConfirm={handleConfirm} />}

            <div className='top-bar'>
                <div className="home-btn">
                    <button><a href="/home">RamScam</a></button>
                </div>

                <div className="balance-display">
                    <h2>Chip: {ramBalance} ◈</h2>
                    <h2 className='shard-display'>Shard: {shardBalance} ⟡</h2>
                    {allocatedRam && (
                        <h2 className='hafiza-display'>
                            Hafıza: <span className='hafiza-used'>{formatRam(usedRam)}</span> / {formatRam(allocatedRam)}
                        </h2>
                    )}

                    {activeBuffList.length > 0 && (
                        <div className='active-buffs'>
                            {activeBuffList.map(buff => (
                                <div key={buff.id} className='active-buff-icon' title={`${buff.name} — ${buff.remainingUses} ${buff.maxUses === 1 ? 'kullanım' : 'el'} kaldı`}>
                                    <span>{buff.icon}</span>
                                    <span className='active-buff-uses'>{buff.remainingUses}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className='auth-container'>
                    {!token ? (
                        <>
                            <div className="login-btn">
                                <a href="/login">Giriş Yap</a>
                            </div>
                            <div className='register-btn'>
                                <a href="/register">Kaydol</a>
                            </div>
                        </>
                    ) : (
                        <div className="logout-btn">
                            <button onClick={() => {
                                localStorage.removeItem('token');
                                window.location.href = '/login';
                            }}>
                                Çıkış Yap
                            </button>
                        </div>
                    )}
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
                            <a href="/games/blackjack">Blackjack</a>
                            <a href>Rulet</a>
                            <a href>Mayın Tarlası</a>
                        </div>
                        <br /><br />
                        <hr className="divider" />
                        <div className='other-links'>
                            <a href>İstatistikler</a>
                            <a href="/shop">Mağaza</a>
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