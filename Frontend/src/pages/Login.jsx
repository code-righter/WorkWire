// src/pages/Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig.js';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate()

  function submitHandler(e) {
    
    e.preventDefault();

    axiosInstance.post('/auth/sign-in', {
      email, 
      password
    }).then((res)=>{
      console.log(res.data)
      navigate('/')
    }).catch((err)=>{
      console.log(err.response.data)
    })
  }
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg border border-transparent transition-all duration-300 hover:border-green-400/50">
        
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-50">Sign In</h1>
          <p className="mt-2 text-gray-400">Welcome back! Please enter your details.</p>
        </div>

        {error && <p className="text-red-400 text-center">{error}</p>}

        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-600 rounded-md bg-gray-700 text-gray-50 placeholder-gray-500 
                         focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-600 rounded-md bg-gray-700 text-gray-50 placeholder-gray-500 
                         focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-2 px-4 text-white font-semibold bg-blue-400 rounded-md 
                       hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign In
          </button>
        </form>

        <div className="text-sm text-center">
          <a href="#" className="font-medium text-green-400 hover:text-green-300 hover:underline">
            Forgot your password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;