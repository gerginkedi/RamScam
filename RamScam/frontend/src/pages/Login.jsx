import '../styles/Login.css'
import '../styles/index.css'
import { useState } from 'react'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async () => {
    setError('')

    if (!email || !password) {
        setError('E-posta ve şifre gereklidir.')
        return
    }

    setLoading(true)
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                Email: email,
                Password: password
            })
        })

        let data = null
        try {
            data = await response.json()
        } catch (_e) {
            console.error('JSON parse hatası')
        }

        console.log('Response status:', response.status)
        console.log('Response data:', data)

        if (!response.ok) {
            setError('E-posta veya şifre hatalı.')
            return
        }

        localStorage.setItem('token', data.token)
        window.location.href = '/home'
    } catch (_e) {
        console.error('Fetch hatası:', _e)
        setError('Sunucuya bağlanılamadı.')
    } finally {
        setLoading(false)
    }
  }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleLogin()
    }

    return (
        <div className="login-container">
            <div className="flex-container">
                <h1>Hesabınıza Giriş Yapın</h1>

                <div className='ust-row'>
                    <label>E-posta Adresi</label>
                    <div>
                        <input
                            type='email'
                            placeholder='ornek@gmail.com'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoCapitalize='off'
                            autoCorrect='off'
                        />
                    </div>

                    <label>Şifre</label>
                    <div>
                        <input
                            type='password'
                            placeholder='••••••••'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoCapitalize='off'
                            autoCorrect='off'
                        />
                    </div>
                </div>

                {error && <p className='login-error'>{error}</p>}

                <div className="alt-row">
                    <button id='forgot-password'>Şifremi Unuttum</button>
                    <button
                        type="button"
                        id='sign-in'
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                    </button>
                    <h5>Hesabınız yok mu? <a href="/register">Şimdi kaydolun</a></h5>
                </div>
            </div>
        </div>
    )
}

export default Login