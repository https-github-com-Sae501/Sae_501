import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';

interface LegalNoticeProps {
  companyName: string;
  companyAddress: string;
  companyEmail: string;
  companyPhone: string;
}

const LegalNotice: React.FC<LegalNoticeProps> = ({}) => {
  return (
    <div className='h-screen bg-white'>
        <Header></Header>
        <div className=' p-4 pt-[3rem] bg-white h-full text-black text-center flex flex-col justify-center'>
            <h2 className='text-left'>Legal notice</h2>

            <h3>Site editor</h3>
            <p>Sculpt</p>
            <p>15 rue des tulipes Limoges </p>
            <p>Email: sculpt@gmail.com</p>
            <p>Téléphone: 3630363036</p>

            <h3>Liability</h3>
            <p>
                The contents of this website are provided for information purposes only.
                Sculpt cannot be held responsible for the accuracy, relevance or
                completeness of the information provided.
            </p>

            <h3>Copyright</h3>
            <p>
                The contents of this website, including text, images, graphics and other
                other elements, are the property of Sculpt and are protected by
                copyright laws.
            </p>

            <h3>Personal data</h3>
            <p>
                The information collected via this website will only be used for the purposes
                as required by law.
            </p>
        </div>
    <Footer></Footer>
    </div>
    
  );
};

export default LegalNotice;
