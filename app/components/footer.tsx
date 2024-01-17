import React from 'react';
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="fixed bottom-0 w-full z-50 ">
        <div className="flex flex-row gap-2 p-2 px-3 bg-black text-white w-full text-xs">
            <p className=''>
                <Link href="./copyright">
                    Copyright 2023
                </Link> 
            </p>
            <p className=''>
            </p>
            <p className=''>
                -
            </p>
            <p className=''>
                <Link href="./legalNotice">
                    Legal notice
                </Link> 
            </p>
        </div>
      
    </footer>
  );
};

export default Footer;
