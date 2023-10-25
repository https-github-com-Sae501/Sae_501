"use client";

import React, { useEffect, useState } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import Link from 'next/link';

const LibraryPage = () => {
  const [localStorageKeys, setLocalStorageKeys] = useState([]);

  
  useEffect(() => {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      if (key !== 'ally-supports-cache' && key !== 'historiqueCubes') {
        keys.push(key);
      }
    }
    setLocalStorageKeys(keys);
  }, []);

  return (
    <div className="bg-white h-screen w-screen">
      <Header />
      <h1 className="text-4xl font-bold p-4 pt-[3rem]">Library</h1>
      <ul className='pl-[2rem]'>
        {localStorageKeys.map((key, index) => (
          <li key={index}>
             <Link href={`/sculpt?name=${key}`}>
              {key}
            </Link>
          </li>
        ))}
      </ul>
      <Footer />
    </div>
  );
};

export default LibraryPage;
