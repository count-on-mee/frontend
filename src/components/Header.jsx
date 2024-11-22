'use client';

import { useState } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-[#FFFCF2]">
      <nav
        aria-label="Global"
        className="flex max-w-full items-center justify-between py-2 px-10 border-b-2 border-[#403D39]"
      >
        <div className="flex">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img
              alt="logo"
              src="/src/assets/img/icon.png"
              className="w-24 h-15 border border-[#403D39]"
            />
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-5">
          <Link
            to="/map/spot"
            className="font-prompt text-2xl font-light leading-6 text-[#403D39] border border-[#403D39] rounded-3xl px-6 pt-2 pb-3 hover:bg-[#EB5E28]"
          >
            spot
          </Link>
          <Link
            to="/map/curation"
            className="font-prompt text-2xl font-light leading-6 text-[#403D39] border border-[#403D39] rounded-3xl px-6 pt-2 pb-3 hover:bg-[#EB5E28]"
          >
            curation
          </Link>
          <Link
            to="/com/my-trip-list"
            className="font-prompt text-2xl font-light leading-6 text-[#403D39] border border-[#403D39] rounded-3xl px-6 pt-2 pb-3 hover:bg-[#EB5E28]"
          >
            count on me
          </Link>
          <Link
            to="/#"
            className="font-prompt text-2xl font-light leading-6 text-[#403D39] border border-[#403D39] rounded-3xl px-6 pt-2 pb-3 hover:bg-[#EB5E28]"
          >
            support
          </Link>
        </div>
        <div className="hidden lg:flex lg:justify-end">
          <Link
            to="/login"
            className="font-prompt font-thin leading-6 text-[#403D39] mx-3 hover:font-light"
          >
            Log in
          </Link>
        </div>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-[#FFFCF2] px-6 py-6 sm:max-w-sm sm:ring-2 sm:ring-[#403D39] ">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                alt=""
                src="/src/assets/img/icon.png"
                className="h-16 w-24 border border-[#403D39]"
              />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-[#403D39]/10">
              <div className="space-y-2 py-6">
                <Link
                  to="/map/spot"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-[#403D39] hover:bg-[#EB5E28]/20"
                >
                  spot
                </Link>
                <Link
                  to="/map/curation"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-[#403D39] hover:bg-[#EB5E28]/20"
                >
                  curation
                </Link>
                <Link
                  to="/com/calendar"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-[#403D39] hover:bg-[#EB5E28]/20"
                >
                  count on me
                </Link>
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-[#403D39] hover:bg-[#EB5E28]/20"
                >
                  support
                </a>
              </div>
              <div className="py-6">
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-[#403D39] hover:bg-[#EB5E28]/20"
                >
                  Log in
                </a>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
