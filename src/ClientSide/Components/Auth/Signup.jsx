
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
 
function Signup({ handleLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    if (password.length < 6) {
      toast.error('Password should be at least 6 characters long.');
      return;
    }
 
    try {
 
        const response = await axios.post('http://20.84.109.30:8090/auth/register', {
        username,
        password
      });
 
      if (response.status === 200) {
        handleLogin(response.data); 
        toast.success('Signup successful!');
        setUsername('');
        setPassword('');
        const { token, userId } = response.data;
 
       
        localStorage.setItem('token', token); 
        let parsed = parseJwt(token);
        let {sub,user_Id} = parseJwt(token);
        localStorage.setItem('userId', user_Id);
        localStorage.setItem('username',sub)
        // navigate('/'); 
      } else {
        toast.error('Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      toast.error(error.response?.data?.message || 'Signup failed. Please try again.');
    }
  };
 
  function parseJwt(token) {
    const parts = token.split('.');
    if (parts.length !== 3) {
        throw new Error('The token is invalid');
    }
 

    const payload = parts[1];
    const decodedPayload = atob(payload.replace(/_/g, '/').replace(/-/g, '+'));
 
    return JSON.parse(decodedPayload);
}
 
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <ToastContainer />
      <div className="max-w-md w-full space-y-8 bg-white rounded-lg overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-105">
        <div className="p-8">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create an account</h2>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
 
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Already have an account? Log in
                </Link>
              </div>
            </div>
 
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
 
export default Signup;