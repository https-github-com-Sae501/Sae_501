"use client";

import React, { useState } from 'react';

import Header from '../components/header'
import Sculpt from '../components/sculpt'
import Footer from '../components/footer'
import Botton from '../components/bottonSave'
import BottonRefresh from '../components/bottonRefresh'
import Outils from '../components/outils'

const PageSculpt: React.FC = () => {
  const [infoFromChild, setInfoFromChild] = useState<number>();

  const handleChildInfo = (info: number) => {
    setInfoFromChild(info);
    console.log(infoFromChild)
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
        <Header></Header>
        <Sculpt infoFromChild={infoFromChild}></Sculpt>
        <BottonRefresh></BottonRefresh>
        <Outils onChildInfo={handleChildInfo}></Outils>
        <Botton></Botton>
        <Footer></Footer>
    </main>
  )
};

export default PageSculpt;