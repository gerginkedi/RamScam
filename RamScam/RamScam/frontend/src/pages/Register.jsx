import '../styles/Register.css'
import '../styles/index.css'


function Register() {
  return (
    <div className="login-container">
      <div className="flex-container">
        <form className='ust-row'>
            <label>E-posta Adresi</label>
            <div>
                <input type='text' placeholder='ornek@gmail.com' autoCapitalize='off' autoCorrect='off'/>
            </div>
            <label>Şifre</label>
            <div>   
                <input type='text' placeholder='••••••••' autoCapitalize='off' autoCorrect='off'/>
            </div>
            <label>Şifre Tekrar</label>
            <div>   
                <input type='text' placeholder='' autoCapitalize='off' autoCorrect='off'/>
            </div>            
        </form>
        <div className="alt-row">
            <button id='register'>Kayıt Ol</button>
            <h5>Zaten bir hesabınız var mı? <a href="/login">Giriş yapın</a></h5>
        </div>       
      </div>
    </div>
  )
}

export default Register