import '../styles/Register.css'
import '../styles/index.css'
import { useState } from 'react'

function Register() {
  const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
      const handleRegister = async () => {
        try {
          const response = await fetch('/api/register', {
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
          console.error("Kayıt hatası:", error)
      }
    }
  
  return (
    <div className="register-container">
      <div className="flex-container">
        <h1>Kayıt Olun</h1> 
        <form className='ust-row'>
            <label>E-posta Adresi</label>
            <div>
                <input type='email' 
                placeholder='ornek@gmail.com' 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoCapitalize='off' 
                autoCorrect='off'
                />
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
            <label>Şifre Tekrar</label>
            <div>   
                <input type='password' placeholder='••••••••' autoCapitalize='off' autoCorrect='off'/>
            </div>            
        </form>
        <div className="alt-row">
            <button type="button" id='register' onClick={handleRegister}>Kayıt Ol </button>
            <h5>Zaten bir hesabınız var mı? <a href="/login">Giriş yapın</a></h5>
        </div>       
      </div>
    </div>
  )
}

export default Register