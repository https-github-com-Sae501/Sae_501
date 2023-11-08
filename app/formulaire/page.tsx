"use client";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import Axios from 'axios';
import Header from '../components/header';
import Footer from '../components/footer';
import '../styles/formulaire.css'

const Formulaire: React.FC = () => {
  const [registrationData, setRegistrationData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    address: '',
    zipcode: '',
    city: '',
    password: ''
  });

  const [loginData, setLoginData] = useState({
    loginEmail: '',
    loginPassword: ''
  });

  const [registrationResponse, setRegistrationResponse] = useState<string | null>(null);
  const [loginResponse, setLoginResponse] = useState<string | null>(null);

  const handleRegistrationSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await Axios.post('http://127.0.0.1:8000/api/users', registrationData);

      setRegistrationResponse('Inscription réussie ! Vous pouvez maintenant vous connecter.');

      // Réinitialiser le formulaire d'inscription
      setRegistrationData({
        firstname: '',
        lastname: '',
        email: '',
        address: '',
        zipcode: '',
        city: '',
        password: ''
      });
    } catch (error) {
      console.error(error);
      setRegistrationResponse('Une erreur s\'est produite lors de l\'inscription. Veuillez réessayer.');
    }
  };

  const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Ajoutez ici la logique pour gérer la connexion
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
              name="loginEmail"
              value={loginData.loginEmail}
              onChange={handleLoginInputChange}
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label>Mot de passe:</label>
            <input
              type="password"
              name="loginPassword"
              value={loginData.loginPassword}
              onChange={handleLoginInputChange}
              className="input-field"
            />
          </div>
          <button type="submit" className="submit-button">Se connecter</button>
          {loginResponse && <p>{loginResponse}</p>}
        </form>
        <form onSubmit={handleRegistrationSubmit} className="form-container">
          <h2>Inscription</h2>
          <div className="form-group">
            <label>Prénom:</label>
            <input
              type="text"
              name="firstname"
              value={registrationData.firstname}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label>Nom de famille:</label>
            <input
              type="text"
              name="lastname"
              value={registrationData.lastname}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>
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
            <label>Adresse:</label>
            <input
              type="text"
              name="address"
              value={registrationData.address}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label>Code postal:</label>
            <input
              type="text"
              name="zipcode"
              value={registrationData.zipcode}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label>Ville:</label>
            <input
              type="text"
              name="city"
              value={registrationData.city}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label>Mot de passe:</label>
            <input
              type="password"
              name="password"
              value={registrationData.password}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>
          <button type="submit" className="submit-button">S'inscrire</button>
          {registrationResponse && <p>{registrationResponse}</p>}
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Formulaire;
