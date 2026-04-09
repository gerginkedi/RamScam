import '../styles/index.css';
import '../styles/layout.css';

function Layout({ children }) {
    return (
        <div>
            <div className='top-bar'>
                <div className="home-btn">
                    <button><a href="/home">RamScam</a></button>
                </div>
                <div className="balance-display">
                    <h2>Chip: 1024 ◈</h2>
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
                    </div>
                    <hr className="divider" />
                    <div className='quick-access'>
                        <a href>Coin Flip</a>
                        <a href>Slot Makinesi</a>
                        <a href>Rulet</a>
                        <a href>Mayın Tarlası</a>
                    </div>
                    <br />
                    <br />
                    <hr className="divider" />
                    <div className='other-links'>
                        <a href>İstatistikler</a>
                        <a href>Cansız Destek</a>
                        <a href>Ayarlar</a>
                    </div>
                </div>
            </div>
            <div className="main-content">
            
                { children }
            </div>
            <div className="right-bar">
            </div>
            </div>
        </div>
    )
}

export default Layout