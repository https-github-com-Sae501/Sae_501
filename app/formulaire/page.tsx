"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import Axios from 'axios';
import Header from '../components/header';
import Footer from '../components/footer';

const Formulaire: React.FC = () => {
  const [registrationData, setRegistrationData] = useState({
    email: '',
    plainPassword: '',
    confirmPassword: '',
  });

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [registrationResponse, setRegistrationResponse] = useState<string | null>(null);
  const [loginResponse, setLoginResponse] = useState<string | null>(null);

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');

    if (authToken) {
      console.log('L\'utilisateur est déjà connecté.');
      window.location.href = '/';
    }
  }, []);

  const handleRegistrationSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (registrationData.plainPassword !== registrationData.confirmPassword) {
      setRegistrationResponse('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const response = await Axios.post(
        'https://mmi21-01.mmi-limoges.fr/api/users',
        registrationData,
        {
          headers: {
            'Content-Type': 'application/ld+json',
          },
        }
      );

      setRegistrationResponse('Inscription réussie ! Vous pouvez maintenant vous connecter.');

      setRegistrationData({
        email: '',
        plainPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error(error);
      setRegistrationResponse('Une erreur s\'est produite lors de l\'inscription. Veuillez réessayer.');
    }
  };

  const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await Axios.post('https://mmi21-01.mmi-limoges.fr/authentication_token', loginData);
      const token = response.data.token;

      localStorage.setItem('authToken', token);

      setLoginResponse('Connexion réussie !');

      setLoginData({
        email: '',
        password: '',
      });

      window.location.href = '/';
    } catch (error) {
      console.error(error);
      setLoginResponse('Une erreur s\'est produite lors de la connexion. Veuillez réessayer.');
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegistrationData({ ...registrationData, [name]: value });
  };

  const handleLoginInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  return (
    <div className="h-screen text-black">
      <Header />
      <div className='h-full overflow-x-scroll'>
        <div className='flex flex-col md:flex-row justify-center items-center min-h-screen bg-gray-100 gap-10 w-full pt-2'>
          <form onSubmit={handleLoginSubmit} className=" p-8 md:w-1/2 max-w-xl w-full">
            <h1 className="text-3xl mb-4 flex flex-row gap-2 text-black" >ALREADY <p className='font-bold text-black'>REGISTERED</p> ?</h1>
            <h2 className="text-xl mb-4 text-black">Connect now !</h2>
            <div className="mb-6">
              <label className="block font-bold text-black">Mail:</label>
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginInputChange}
                className="w-full p-3 border border-gray-300 rounded text-black"
              />
            </div>
            <div className="mb-6">
              <label className="block font-bold text-black">Password:</label>
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginInputChange}
                className="w-full p-3 border border-gray-300 rounded text-black"
              />
            </div>
            <button type="submit" className=" w-full bg-black text-white p-3 rounded text-xl cursor-pointer transition duration-300 hover:bg-gray-700">
              Connect
            </button>
            {loginResponse && <p className="text-green-500 mt-4">{loginResponse}</p>}
          </form>
          <div className="hidden lg:block w-px bg-gray-700 h-96"></div>
          <form onSubmit={handleRegistrationSubmit} className="p-8 md:w-1/2 max-w-xl w-full">
            <h1 className="text-3xl mb-4 text-black flex  flex-row gap-2"> <p className='font-bold text-black'>FIRST</p> VISIT ?</h1>
            <h2 className="text-xl mb-4 text-black">Register now !</h2>
            <div className="mb-6">
              <label className="block font-bold text-black">Mail:</label>
              <input
                type="email"
                name="email"
                value={registrationData.email}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded text-black"
              />
            </div>
            <div className="mb-6">
              <label className="block font-bold text-black">Password:</label>
              <input
                type="password"
                name="plainPassword"
                value={registrationData.plainPassword}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded text-black"
              />
            </div>
            <div className="mb-6">
              <label className="block font-bold text-black">Confirm Password:</label>
              <input
                type="password"
                name="confirmPassword"
                value={registrationData.confirmPassword}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded text-black"
              />
            </div>
            <button type="submit" className="w-full bg-black text-white p-3 rounded text-xl cursor-pointer transition duration-300 hover:bg-gray-700">
              Register
            </button>
            {registrationResponse && <p className="text-green-500 mt-4">{registrationResponse}</p>}
          </form>
        </div>
      </div>

      <Footer />
    </div>

  );
};

export default Formulaire;