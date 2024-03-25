import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

function Login({ handleLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const Navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const usersResponse = await axios.get('https://65ee234e08706c584d9b1c74.mockapi.io/reactcrud/users');
  
      const user = usersResponse.data.find(user => user.email === email && user.password === password);
  
      if (user) {
        // Login successful
        toast.success('Login successful!');
        Navigate("/");
      } else {
        // Login failed
        toast.error('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      toast.error('Login failed. Please try again later.');
    }
    
  
    // try {
    //   const response = await axios.post('https://65ee234e08706c584d9b1c74.mockapi.io/reactcrud/users', {
    //     email,
    //     password
    //   });
  
    //   if (response.status === 200) {
    //     const { token } = response.data;
    //     console.log(response)
    //     Navigate("/");
    //     localStorage.setItem('token', token);
    //     toast.success('Login successful!');
      
    //   } else {
    //     toast.error('Login failed. Please check your credentials.');
    //   }
    // } catch (error) {
    //   console.error('Error logging in:', error);
    //   toast.error('Login failed. Please check your credentials.');
    // }
  };

 
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <ToastContainer />
      <div className="max-w-md w-full bg-white rounded-lg overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-105">
        <div className="p-8">
          <h2 className="text-3xl font-extrabold text-center text-gray-900">Sign in to your account</h2>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  id="email"
                  name="email"
                  type="text"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Don't have an account? Sign up
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
