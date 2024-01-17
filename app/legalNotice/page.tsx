import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';

const LegalNotice = () => {
  return (
    <div className='h-screen bg-gray-100 text-black'>
    <Header />
    <div className='p-4 pt-[3rem] bg-zinc-900 h-full text-white text-center flex flex-col justify-center'>
        <h2 className='text-3xl font-semibold mb-4'>Legal Notice</h2>

        <div className='text-center py-2'>
            <h3 className='text-xl mb-2'>Liability :</h3>
            <p className='mb-4'>
                The contents of this website are provided for information purposes only.
                Sculpt cannot be held responsible for the accuracy, relevance, or
                completeness of the information provided.
            </p>

            <h3 className='text-xl mb-2'>Copyright :</h3>
            <p className='mb-4'>
                The contents of this website, including text, images, graphics, and other
                elements, are the property of Sculpt and are protected by
                copyright laws.
            </p>

            <h3 className='text-xl mb-2'>Personal Data :</h3>
            <p className='mb-4'>
                The information collected via this website will only be used for purposes
                required by law.
            </p>
        </div>

        <div className='flex flex-row gap-4 align-center justify-center pt-[3rem]'>
            <p className='text-left'>Siège social: 15 rue des tulipes Limoges</p>
            <p className='text-left'>Email: sculpt@gmail.com</p>
            <p className='text-left'>Téléphone: 3630363036</p>
        </div>
    </div>
    <Footer />
</div>

    
  );
};

export default LegalNotice;
