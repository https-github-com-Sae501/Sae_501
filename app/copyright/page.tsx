import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';

const App: React.FC = () => {
  return (
    <div className="bg-zinc-900 h-screen">
        <Header></Header>
        <div className='pt-[3rem] bg-zinc-900 h-full text-white text-center flex flex-col justify-center'>
            <p className=''>&copy; {new Date().getFullYear()} Sculpt. All rights reserved.</p>
            <p>The contents of this website, including text, images, graphics and other elements, are the property of Sculpt and are protected by copyright laws.</p>
            <p>Any unauthorized reproduction, distribution, modification or use of the content without the prior consent of Sculpt is strictly prohibited.</p>
            <p>The brands and logos mentioned on this site are the property of their respective owners.</p>
        </div>
        <Footer></Footer>
    </div>
  );
};

export default App;