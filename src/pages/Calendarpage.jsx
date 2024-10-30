import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Calendar from '../components/Calendar';

function Calendarpage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow bg-[#FFFCF2] flex items-center justify-center p-4">
        <div className="bg-[#FFFCF2] w-full max-w-4xl h-[80vh] overflow-auto">
          <Calendar />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Calendarpage;
