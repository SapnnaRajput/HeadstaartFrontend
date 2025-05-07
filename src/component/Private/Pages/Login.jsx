import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import axios from 'axios'
import { UserState } from '../../../context/UserContext';
import { notify } from '../../../Utiles/Notification';
import Loader from '../../../Utiles/Loader';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {

  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  // const [rememberMe, setRememberMe] = useState(false)
  const { setUser } = UserState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const Login = async () => {
    if(!email || !password){
      notify('error', 'Please enter email and password');
      return;
    }
    setLoading(true)
    try {
      const response = await axios.post(`${baseUrl}/user_login`, {
        email: email,
        password: password
      });
      if (response.data.status) {
        const { user, token } = response.data;
        const userData = { ...user, token };
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(response.data);
        notify('success', 'Logged in successfully');
      }else{
        notify('error', response.data.message);
      }
    } catch (err) {
      notify('error' , 'Invalid Credentials')
      console.log(err)
    }
    setLoading(false)
  }

  return (
    <>
      {loading && <Loader />}
      <div className="min-h-screen flex items-center justify-center  bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 p-4">
        <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg">
          <h1 className="text-2xl font-semibold text-center text-gray-800 mb-2">
            Login to Account
          </h1>
         

          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm text-gray-600">
                Email address:
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter Email"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm text-gray-600">
                  Password
                </label>
                {/* <button
                  type="button"
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  Forget Password?
                </button> */}
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              onClick={Login}
              className="w-full py-2.5 px-4 text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

