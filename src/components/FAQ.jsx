import React, { useState, useEffect } from 'react';

const FAQ = () => {
  const [faqItems, setFaqItems] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await fetch('http://localhost:8888/support/faqs');
        const data = await response.json();
        setFaqItems(data || []);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      }
    };
    fetchFaqs();
  }, []);

  const toggleFAQ = index => {
    setOpenIndex(prevIndex => (prevIndex === index ? null : index));
  };

  return (
    <section className="p-4 bg-[#FFFCF2] sm:py-8 lg:py-12">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="max-w-3xl mx-auto mt-8 space-y-4 md:mt-16">
          {Array.isArray(faqItems) && faqItems.length > 0 ? (
            faqItems.map((item, index) => (
              <div
                key={item.faqId}
                className={`text-2xl font-light leading-6 text-[#403D39] border border-[#403D39] px-4 py-3 transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'bg-gray-50' : ''
                }`}
                style={{
                  borderRadius: openIndex === index ? '1.5rem' : '9999px',
                  transition:
                    'border-radius 0.3s ease-in-out, background-color 0.3s ease-in-out',
                }}
              >
                <button
                  type="button"
                  className="flex items-center justify-between w-full"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="text-lg font-semibold text-black">
                    {item.question}
                  </span>
                  <span className="text-[#252422] text-lg font-bold">
                    {openIndex === index ? 'X' : '+'}
                  </span>
                </button>
                {openIndex === index && (
                  <div className="mt-2 text-sm text-black">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-lg text-black">No FAQ available.</p>
          )}
        </div>
        <p className="mt-9 text-base text-center text-gray-600">
          Still have questions?{' '}
          <span className="cursor-pointer font-medium text-tertiary transition-colors duration-200 hover:text-tertiary">
            Contact our support
          </span>
        </p>
      </div>
    </section>
  );
};

export default FAQ;
