"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import Axios from 'axios';
import Header from '../components/header';
import Footer from '../components/footer';
import '../styles/formulaire.css';

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
  }, []);

  const handleRegistrationSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (registrationData.plainPassword !== registrationData.confirmPassword) {
      setRegistrationResponse('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const response = await Axios.post(
        'https://127.0.0.1:8000/api/users',
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
      const response = await Axios.post('https://127.0.0.1:8000/authentication_token', loginData);
      const token = response.data.token;

      localStorage.setItem('authToken', token);

      setLoginResponse('Connexion réussie !');

  
      setLoginData({
        email: '',
        password: '',
      });
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
    <div>
      <Header />
      <div className="centered-container">
        <form onSubmit={handleLoginSubmit} className="form-container">
          <h2>Connexion</h2>
          <div className="form-group">
            <label>Email de connexion:</label>
            <input
              type="email"
              name="email" 
              value={loginData.email}
              onChange={handleLoginInputChange}
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label>Mot de passe:</label>
            <input
              type="password"
              name="password" 
              value={loginData.password}
              onChange={handleLoginInputChange}
              className="input-field"
            />
          </div>
          <button type="submit" className="submit-button">
            Se connecter
          </button>
          {loginResponse && <p className="success-message">{loginResponse}</p>}
        </form>
        <form onSubmit={handleRegistrationSubmit} className="form-container">
          <h2>Inscription</h2>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={registrationData.email}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label>Mot de passe:</label>
            <input
              type="password"
              name="plainPassword"
              value={registrationData.plainPassword}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label>Confirmer le mot de passe:</label>
            <input
              type="password"
              name="confirmPassword"
              value={registrationData.confirmPassword}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>
          <button type="submit" className="submit-button">
            S'inscrire
          </button>
          {registrationResponse && <p className="success-message">{registrationResponse}</p>}
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Formulaire;