"use client";

import React, { useState, ChangeEvent, FormEvent } from 'react';
import Axios from 'axios';
import Header from '../components/header';
import Footer from '../components/footer';

const Formulaire: React.FC = () => {
  const [formData, setFormData] = useState<{ username: string; password: string }>({ username: '', password: '' });
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await Axios.post('http://127.0.0.1:8000/api/users', formData);

      setResponseMessage('Inscription réussie ! Vous pouvez maintenant vous connecter.');

      setFormData({ username: '', password: '' });
    } catch (error) {
      console.log(error)
      setResponseMessage('Une erreur s\'est produite lors de l\'inscription. Veuillez réessayer.');
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  

  return (
    <div>
    <Header />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        {responseMessage && <p>{responseMessage}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Nom d'utilisateur:
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Mot de passe:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </label>
          <button type="submit">S'inscrire</button>
        </form>
    </div>
    <Footer />
  </div>
  );
};

export default Formulaire;
