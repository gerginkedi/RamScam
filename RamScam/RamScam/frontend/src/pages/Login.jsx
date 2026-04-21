import '../styles/Login.css'
import '../styles/index.css'
import { useState } from 'react'



function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
    const handleLogin = async () => {
      try {
        // Giriş işlemi için API çağrısı yapabilirsiniz
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              Email: email, 
              RawPassword: password })
        })

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Hata:", errorData);
            return;
          }


        const data = await response.json()
        console.log(data)
    } catch (error) {
        console.error("Giriş hatası:", error)
    }
  }

  return (
    <div className="login-container">
      <div className="flex-container">
        <h1>Hesabınıza Giriş Yapın</h1>       
        <form className='ust-row'>
            <label>E-posta Adresi</label>
            <div>
              <input type='email' 
              placeholder='ornek@gmail.com' 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoCapitalize='off' 
              autoCorrect='off'/>
            </div>

            <label>Şifre</label>
            <div>   
              <input type='password' 
              placeholder='••••••••' 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoCapitalize='off' 
              autoCorrect='off'/>
            </div>
        </form>
        <div className="alt-row">
            <button id='forgot-password'>Şifremi Unuttum</button>
            <button type="button" id='sign-in' onClick={handleLogin}>Giriş Yap</button>
            <h5>Hesabınız yok mu? <a href="/register">Şimdi kaydolun</a></h5>
        </div>       
      </div>
    </div>
  )
}

export default Login