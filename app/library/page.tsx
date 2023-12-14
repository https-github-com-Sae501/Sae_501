"use client";

import React, { useEffect, useState } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import BottonCreate from '../components/bottonCreate';
import Link from 'next/link';

const LibraryPage = () => {
  const [localStorageKeys, setLocalStorageKeys] = useState([]);
  
  localStorage.removeItem('historiqueCubes');

  useEffect(() => {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      if (key !== 'ally-supports-cache' && key !== 'historiqueCubes' && key !== 'authToken') {
        keys.push(key);
      }
    }
    setLocalStorageKeys(keys);
  }, []);

  return (
    <div className="bg-white h-screen w-screen color-foreground">
      <Header />
      <h1 className=" text-black text-4xl font-bold p-4 pt-12">Library</h1>
      <ul className='pl-8'>
        {localStorageKeys.map((key, index) => (
          <li className='text-black' key={index}>
             <Link href={`/sculpt?name=${key}`}>
              {key}
            </Link>
          </li>
        ))}
      </ul>
      <Link href='./sculpt'><BottonCreate></BottonCreate></Link>
      <Footer />
    </div>
  );
};

export default LibraryPage;
