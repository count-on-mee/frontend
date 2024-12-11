import React, { useEffect } from 'react';

const FAQ = () => {
  useEffect(() => {
    // JavaScript for FAQ toggle functionality
    document.querySelectorAll('[data-toggle="faq"]').forEach(button => {
      button.addEventListener('click', () => {
        const answer = button.nextElementSibling;
        const svg = button.querySelector('svg');

        if (answer.classList.contains('hidden')) {
          answer.classList.remove('hidden');
          svg.classList.add('rotate-180');
        } else {
          answer.classList.add('hidden');
          svg.classList.remove('rotate-180');
        }
      });
    });
  }, []);

  return (
    <section className="py-10 bg-gray-50 sm:py-16 lg:py-24">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
            Explore Common Questions
          </h2>
        </div>
        <div className="max-w-3xl mx-auto mt-8 space-y-4 md:mt-16">
          {[
            {
              question: 'How can I get started?',
              answer:
                "Getting started is easy! Sign up for an account, and you'll have access to our platform's features. No credit card required for the initial signup.",
            },
            {
              question: 'What is the pricing structure?',
              answer:
                'Our pricing structure is flexible. We offer both free and paid plans. You can choose the one that suits your needs and budget.',
            },
            {
              question: 'What kind of support do you provide?',
              answer:
                'We offer comprehensive customer support. You can reach out to our support team through various channels, including email, chat, and a knowledge base.',
            },
            {
              question: 'Can I cancel my subscription anytime?',
              answer:
                'Yes, you can cancel your subscription at any time without any hidden fees. We believe in providing a hassle-free experience for our users.',
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 shadow-lg cursor-pointer transition-all duration-200 hover:bg-gray-50"
            >
              <button
                type="button"
                className="flex items-center justify-between w-full px-4 py-5 sm:p-6"
                data-toggle="faq"
              >
                <span className="text-lg font-semibold text-black">
                  {item.question}
                </span>
                <svg
                  className="w-6 h-6 text-gray-400 transform transition-transform duration-200"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 9l-7 7-7-7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <div className="hidden px-4 pb-5 sm:px-6 sm:pb-6">
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
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
