import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';

const LegalNotice = () => {
  return (
    <div className='h-screen bg-white'>
        <Header></Header>
        <div className=' p-4 pt-[3rem] bg-white h-full text-black text-center flex flex-col justify-start'>
            <h2 className='text-3xl font-semibold'>Legal notice</h2>

            

            <h3 className='text-left py-2 text-xl'>Liability :</h3>
            <p>
                The contents of this website are provided for information purposes only.
                Sculpt cannot be held responsible for the accuracy, relevance or
                completeness of the information provided.
            </p>

            <h3 className='text-left py-2 text-xl'>Copyright :</h3>
            <p>
                The contents of this website, including text, images, graphics and other
                other elements, are the property of Sculpt and are protected by
                copyright laws.
            </p>

            <h3 className='text-left py-2 text-xl'>Personal data :</h3>
            <p>
                The information collected via this website will only be used for the purposes
                as required by law.
            </p>
            <div className='flex flex-row gap-4 align-center justify-center pt-[3rem]'>
              <p className='text-left'>Siège social: 15 rue des tulipes Limoges </p>
              <p className='text-left'>Email: sculpt@gmail.com</p>
              <p className='text-left'>Téléphone: 3630363036</p>
            </div>
            
        </div>
    <Footer></Footer>
    </div>
    
  );
};

export default LegalNotice;
