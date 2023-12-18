"use client";

import React, { useState, useEffect } from 'react';

import Header from '../components/header'
import Sculpt from '../components/sculpt'
import Footer from '../components/footer'
import Botton from '../components/bottonSave'
import BottonRefresh from '../components/bottonRefresh'
import Outils from '../components/outils'

const PageSculpt: React.FC = () => {
    const [toolSize, settoolSize] = useState<number>(1);
  
    const handleClick = (info: number) => {
      settoolSize(info);
    };
    useEffect(() => {
      if (typeof window !== 'undefined') {
      }
    }, []);
  
    return (
      <main className="flex min-h-screen flex-col items-center justify-between">
          <Header></Header>
          <Sculpt toolSize={toolSize}></Sculpt>
          <BottonRefresh></BottonRefresh>
          <Outils handleClick={handleClick}></Outils>
          <Botton></Botton>
          <Footer></Footer>
      </main>
    );
  };
  
  export default PageSculpt;
  