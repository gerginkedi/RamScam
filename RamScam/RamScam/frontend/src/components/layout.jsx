import '../styles/index.css';
import '../styles/layout.css';

function Layout({ children }) {
    return (
        <div>
            <div className='top-bar'>
                <div className="home-btn">
                    <button><a href="/home">RamScam</a></button>
                </div>
                <div className='auth-container'>
                    <div className="login-btn">
                        <a href="/login">Login</a>
                    </div>
                    <div className='register-btn'>
                        <a href="/register">Register</a>
                    </div>
                </div>
            </div>

            <div className='layout'>        
            <div className="left-bar">
                <div className='left-bar-content'>
                                    
                    <div className="btn-group">

                    </div>
                </div>
            </div>
            <div className="main-content">
            
                { children }
            </div>
            <div className="right-bar">
            <h1>Sag Bar burasi</h1>
            </div>
            </div>
        </div>
    )
}

export default Layout