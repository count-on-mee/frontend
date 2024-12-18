'use client';

import heroSectionImg from '../assets/img/heroSection.jpg';

export default function HeroSection() {
  return (
    <div
      className="bg-cover bg-center bg-no-repeat min-h-screen font-prompt flex-grow"
      style={{ backgroundImage: `url(${heroSectionImg})` }}
    >
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-right">
            <h1 className="text-balance text-4xl font-regular tracking-tight text-[#FFFCF2] sm:text-7xl">
              당신의 여행을 비범하게,
            </h1>
            <div className="mt-60 flex items-center justify-center gap-x-6">
              <a
                href="/map"
                className="rounded-[40px] bg-[#FFFCF2] px-12 py-4 text-xl font-regular text-black shadow-sm hover:bg-[#EB5E28] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EB5E28] border-2 border-[#252422]"
              >
                지금 시작하기
              </a>
              <a href="#" className="text-xl font-semibold text-[#FFFCF2]">
                Learn more <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
