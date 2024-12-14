import { XMarkIcon, Square2StackIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import Modal from 'react-modal';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { useRecoilValue } from 'recoil';
import userAtom from '../recoil/user';
Modal.setAppElement("#root");

const Photodump = ({ selectedSpot, photos }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useRecoilValue(userAtom);

  const toggleModal = () => setIsModalOpen((prev) => !prev);

  const settings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
  }

  return (
    <div>
      <div className="relative">
        <img 
          src={photos[0] || "../src/assets/img/logo.png"} 
          alt={selectedSpot.title}
          className="cursor-pointer w-full h-52 object-cover border border-[#403D39] rounded-md"
          onClick={toggleModal} />
        <div className="absolute top-2 right-2 flex items-center space-x-1 text-white">
          <Square2StackIcon className="w-6 h-6" />
        </div>
        <div className="absolute bottom-2 left-2 flex items-center space-x-2 text-white">
          <img 
            src={user.profileImgUrl}
            alt={user.nickname}
            className="w-6 h-6 rounded-full"
          />
          <div className="text-sm">{user.nickname}</div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={toggleModal}
        ariaHideApp={false}
        className="relative w-full h-full max-w-3xl bg-black rounded-lg bg-opacity-50 z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex grid place-items-center z-50 justify-center items-center"
      >
        <div className="relative w-full h-full bg-black bg-opacity-70 p-6 rounded-lg z-50 justify-center">
          <div 
            onClick={toggleModal}
            className="absolute top-4 right-4"
          >
            <XMarkIcon className="w-6 h-6 cursor-pointer bg-white rounded-full bg-opacity-80"/>
          </div>
          <div className="flex items-center space-x-2">
            <img
              src={user.profileImgUrl}
                className="w-10 h-10 rounded-full"
            />
            <div className="text-white">{user.nickname}</div>
          </div>
          <Slider {...settings}
            className="flex items-center h-full"
          >
            {photos.map((photo, index) => (
              <div key={index} className="flex h-full">
                <img 
                  src={photo} 
                  alt={`Photo ${index}`}
                  className="flex w-full h-auto object-contain"
                />
              </div>
            ))}
          </Slider>
        </div>
      </Modal>
    </div>
  )
}

export default Photodump;