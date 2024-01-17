"use client";

import Header from '../components/header';
import Footer from '../components/footer';
import Image from 'next/image';
import BottonCreate from '../components/bottonCreate';
import Botton from '../components/bottonSave'
import BottonRefresh from '../components/bottonRefresh'
import Outils from '../components/outils'
import Link from 'next/link';

const Home = () => {
  const handleClick = (info: number) => {

  };
  return (
    <div className="bg-zinc-900 h-screen w-screen color-foreground text-white">
      <Header />
      <div className='h-full overflow-x-scroll p-4'>
        <h1 className='text-4xl font-bold p-2 pt-12 pb-6 text-white'>Sculpt</h1>

        <div className='pl-3 pb-3 text-xl text-white'>
          <div className='flex flex-row justify-around items-center'>
            <p className='w-1/2 p-2 text-center'>Sculpt is a stone carving game. The principle is simple: you have 3 cube sizes to choose from, small, medium and large.</p>
            <div className='flex justify-center p-4 w-1/2'>
              <Image src="/chooseSize.PNG" alt="chooseSize" width={1000} height={1000} className='' />
            </div>
          </div>
          
          <div className='flex flex-row justify-around items-center'>
            
            <p className='max-w-5xl w-1/2 p-2 text-center'> You can then carve using various tools, such as the tungsten engraver, which breaks one cube, the steel engraver, which breaks two cubes, and the soft stone chisel, which breaks four cubes. There&apos;s also a rewind and restart button for starting a new sculpture.</p>

            <div className='flex sm:flex-row flex-col justify-center items-center gap-6 p-4 w-1/2'>
              {/* <Outils handleClick={handleClick}></Outils> */}
              <button className=" bg-black text-white px-3  py-[0.5rem] rounded-md cursor-pointer h-12 w-12 flex justify-center items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 18 18" fill="none">
                  <path d="M17 7.98506C16.7554 6.22528 15.9391 4.59472 14.6766 3.34455C13.4142 2.09439 11.7758 1.29398 10.0137 1.06661C8.25159 0.839245 6.46362 1.19754 4.9252 2.0863C3.38678 2.97507 2.18325 4.34499 1.5 5.98506M1 1.98506V5.98506H5M1 9.98506C1.24456 11.7448 2.06093 13.3754 3.32336 14.6256C4.58579 15.8757 6.22424 16.6761 7.98633 16.9035C9.74841 17.1309 11.5364 16.7726 13.0748 15.8838C14.6132 14.995 15.8168 13.6251 16.5 11.9851M17 15.9851V11.9851H13" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
              </button>
              <button id="undoButton" className="px-3 py-2 bg-black text-white rounded-md cursor-pointer select-none">
                UNDO
              </button>          
            </div>


          </div>
          <div className='flex flex-row justify-between items-center'>
            <p className='w-1/2 flex justify-center items-center p-2'>
              Once your sculpture is finished, you can save it.
            </p>
            <div className="mt-4 flex items-center justify-center p-4 w-1/2">
              <p className="bg-black text-white px-3 py-1 rounded cursor-pointer w-28 h-11 flex justify-center items-center">
              Save
              </p>
            </div>
          </div>
          
          <div className='flex flex-row justify-around items-center'>
            <p className='w-1/2 p-2 text-center'> If it&apos;s not finished, you can come back and modify it in your library.
            </p>
            <div className='flex justify-center p-4 w-1/2'>
              <Image src="/libraryPage.PNG" alt="chooseSize" width={1000} height={750} className='' />
            </div>
          </div>
          

          <h2 className='text-3xl font-bold p-2 pt-4 text-white text-center'>It&apos;s your turn to play</h2>

          <div className='flex items-center justify-center p-4 pb-20'>
            <Link href='./sculpt'><BottonCreate ></BottonCreate></Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
