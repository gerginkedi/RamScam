import '../styles/Register.css'
import '../styles/index.css'
import { useState } from 'react'

function Register() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    const handleRegister = async () => {
        setError('')
        setSuccess('')

        if (!email || !password || !passwordConfirm) {
            setError('Tüm alanları doldurun.')
            return
        }

        if (password !== passwordConfirm) {
            setError('Şifreler eşleşmiyor.')
            return
        }

        setLoading(true)
        try {
            const response = await fetch('/api/register', {
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
                setError('Bu e-posta adresi zaten kayıtlı.')
                return
            }

            setSuccess('Kayıt başarılı! Giriş yapabilirsiniz.')
            setTimeout(() => {
                window.location.href = '/login'
            }, 1500)
        } catch (_e) {
            console.error('Fetch hatası:', _e)
            setError('Sunucuya bağlanılamadı.')
        } finally {
            setLoading(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleRegister()
    }

    return (
        <div className="register-container">
            <div className="flex-container">
                <h1>Kayıt Olun</h1>

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

                    <label>Şifre Tekrar</label>
                    <div>
                        <input
                            type='password'
                            placeholder='••••••••'
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoCapitalize='off'
                            autoCorrect='off'
                        />
                    </div>
                </div>

                {error && <p className='register-error'>{error}</p>}
                {success && <p className='register-success'>{success}</p>}

                <div className="alt-row">
                    <button
                        type="button"
                        id='register'
                        onClick={handleRegister}
                        disabled={loading}
                    >
                        {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
                    </button>
                    <h5>Zaten bir hesabınız var mı? <a href="/login">Giriş yapın</a></h5>
                </div>
            </div>
        </div>
    )
}

export default Register