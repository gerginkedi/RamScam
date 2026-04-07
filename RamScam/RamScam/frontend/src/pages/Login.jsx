import '../styles/Login.css'
import '../styles/index.css'


function Login() {
  return (
    <div className="login-container">
      <div className="flex-container">
        <h1>Hesabınıza Giriş Yapın</h1>       
        <form className='ust-row'>
            <label>E-posta Adresi</label>
            <div>
            <input type='text' placeholder='ornek@gmail.com' autoCapitalize='off' autoCorrect='off'/>
            </div>
            <label>Şifre</label>
            <div>   
            <input type='text' placeholder='••••••••' autoCapitalize='off' autoCorrect='off'/>
            </div>
        </form>
        <div className="alt-row">
            <button id='forgot-password'>Şifremi Unuttum</button>
            <button id='sign-in'>Giriş Yap</button>
            <h5>Hesabınız yok mu? <a href="/register">Şimdi kaydolun</a></h5>
        </div>       
      </div>
    </div>
  )
}

export default Login