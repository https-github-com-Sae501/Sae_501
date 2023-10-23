import React from 'react';
import Header from './components/header'
import Footer from './components/footer'

const LibraryPage = () => {
  return (
    <div className="bg-white h-screen w-screen">
    <Header></Header>
      <h1 className="text-4xl font-bold p-4">Library</h1>
    <Footer></Footer>
    </div>
  );
};

export default LibraryPage;
