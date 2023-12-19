"use client";
import React, { useState } from 'react';

interface OutilsProps {
  handleClick: (value: number) => void;
}

const Outils: React.FC<OutilsProps> = ({ handleClick }) => {

  return (
    <div className="fixed left-10 top-1/2 transform -translate-y-1/2  border-2 border-black rounded-lg w-max h-max">
      <div className=" flex flex-col gap-10 p-3">
        
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" width="35" height="38" viewBox="0 0 35 38" fill="none" className="cursor-pointer" onClick={() => handleClick(4)}>
          <path d="M34.4189 8.98444L28.7215 15.7744L18.0581 23.886L6.18298 37.5079L0.611743 32.8331L12.0066 19.2532L18.3795 6.35471L23.7117 1.90093e-05L34.4189 8.98444Z" fill="black"/>
          </svg>
        </div>
        
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="36" viewBox="0 0 32 36" fill="none" className="cursor-pointer" onClick={() => handleClick(2)}>
          <path d="M31.8496 6.61578L28.3435 10.7942L21.4744 15.5626L4.45513 35.8454L0.740975 32.7288L17.7602 12.4461L21.2054 4.8046L24.7115 0.626172L31.8496 6.61578Z" fill="black"/>
          </svg>
        </div>
        
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" width="31" height="36" viewBox="0 0 31 36" fill="none" className="cursor-pointer" onClick={() => handleClick(1)}>
          <path d="M30.4344 4.22037L23.13 15.0022L16.0197 22.2384L5.13617 35.209L0.348394 31.1915L11.232 18.221L17.3847 10.1813L26.4484 0.875786L30.4344 4.22037Z" fill="black"/>
          </svg>
        </div>
        
        
      </div>
    </div>
  );
};

export default Outils;
