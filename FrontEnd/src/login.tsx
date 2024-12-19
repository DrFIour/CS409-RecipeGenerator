import React,{ useState } from 'react';
import axios, {AxiosError} from "axios";
import { useNavigate } from 'react-router-dom';
import Home from './home';

function Login() {
  const APIurl = "https://cs409-final-omega.vercel.app/api"
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [registerError, setRegisterError] = useState<string>('');
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    ingredients: {}
  });

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  const handleButton = async () => {

    setError('');
    if (!formData.email) {
      setError('Email is required.');
      return;
    }
    if (!formData.password) {
      setError("Password is required");
      return;
    }
    if (!validateEmail(formData.email)) {
      setError('Invalid email format.');
      return;
    }
    console.log(APIurl + "/users")
    try {
      const response = await axios.post(APIurl + "/users", formData);
      if (response.status === 201) {
        console.log(response)
        const userID = response.data.data._id
        alert(userID)
        navigate(`/${userID}/home`)
      }
    } catch (err:any) {
      if (err.response && err.response.status === 409) {
        const authenticateData = {email: formData.email, password: formData.password}
        try{
          const loginResponse = await axios.post(APIurl + "/authentication", authenticateData);
          if (loginResponse.status === 200) {
            console.log(loginResponse)
            const userID = loginResponse.data.data._id
            navigate(`/${userID}/home`)
          }
        } catch (authErr:any) {
          console.error(authErr.response.data.message)
          setError("Password not match or Email not match");
        }
        
      }
      return;
    }
  }


  return (
    <div>
      <div className='Title'>
        <h1> Login </h1>
      </div>
      <div className="AuthContainer">
        <input name = "email" type="email" placeholder='please enter your email' value = {formData.email} onChange={handleChange} />
        <input name = "userName" placeholder='please enter your name (optional)' value = {formData.userName} onChange={handleChange}/>
        <input name = "password" placeholder='please enter your password' value = {formData.password} onChange={handleChange}/>
        <button onClick={handleButton}> Login / Register</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
}

export default Login;
