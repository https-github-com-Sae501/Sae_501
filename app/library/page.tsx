import React from 'react';
import Header from '../components/header'
import Footer from '../components/footer'
import Button from '../components/button_create'
import Link from 'next/link';

const LibraryPage = () => {
  return (
    <div className="bg-white h-screen w-screen">
    <Header></Header>
      <h1 className="text-4xl font-bold p-4 pt-[3rem]">Library</h1>
      <Link href="/">  <Button></Button></Link>
    <Footer></Footer>
    </div>
  );
};

export default LibraryPage;
