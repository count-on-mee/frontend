import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import Modal from 'react-modal';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

Modal.setAppElement('#root');

const Photodump = ({ photoDump }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReivewId] = useState(null);

  const selectedReview = photoDump.find(
    (r) => r.spotReviewId === selectedReviewId,
  );

  const openModal = (reviewId) => {
    setSelectedReivewId(reviewId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReivewId(null);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div>
      {/* 썸네일 */}
      {photoDump.length === 0 ? (
        <p className="pt-5 pl-2">아직 등록된 후기가 없습니다.</p>
      ) : (
        <div className="pt-10 grid grid-cols-2 gap-2">
          {photoDump.map((review, idx) => (
            <div className="relative" key={review.spotReviewId ?? idx}>
              <img
                src={review.imgUrls[0]}
                alt={`thumbnail-${review.spotReviewId}`}
                className="cursor-pointer w-40 h-52 object-cover border border-[#403D39] rounded-md justify-center items-center mx-2"
                onClick={() => openModal(review.spotReviewId)}
              />
              <div className="flex">
                <img
                  src={review.author.imgUrl}
                  className="absolute left-3 bottom-0.5 w-5 h-5 rounded-2xl "
                />
                <p className="absolute left-10 bottom-0.5 text-background-gray text-sm truncate">
                  {review.author.nickname}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 모달 */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Review Images Modal"
        className="absolute top-1/2 left-1/2 max-w-4xl max-h-[90vh] w-[100vw] bg-white rounded-lg p-6 transform -translate-x-1/2 -translate-y-1/2 outline-none"
        overlayClassName="fixed inset-0 bg-black/70 z-50 flex justify-center items-center"
      >
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-charcoal font-bold text-lg z-200"
          aria-label="Close modal"
        >
          <XMarkIcon className="w-7 h-7" />
        </button>

        {selectedReview && (
          <div className="grid grid-cols-2 h-[70vh]">
            {selectedReview.imgUrls.length > 1 ? (
              <Slider {...sliderSettings} className="">
              {selectedReview.imgUrls.map((url, idx) => (
                <div
                  key={idx}
                  className="pt-10 h-full flex items-center justify-center"
                >
                  <img
                    src={url}
                    alt={`review-img-${idx}`}
                    className="w-8/9 h-auto mx-auto object-contain max-h-[60vh] my-auto"
                  />
                </div>
              ))}
            </Slider>
            ) : (
              <div className="pt-10 h-full flex items-center justify-center">
                <img src={selectedReview.imgUrls[0]} className="w-8/9 h-auto mx-auto object-contain max-h-[60vh] my-auto"/>
              </div>
            ) }
            
            <div className="mt-10 h-[60vh]">
              <div className="flex">
                <img
                  src={selectedReview.author.imgUrl}
                  className="w-5 h-5 mr-2 rounded-2xl ml-5"
                />
                <p className="text-charcoal text-sm">
                  {selectedReview.author.nickname}
                </p>
              </div>
              <div className="h-[50vh] border-2 mt-2 overflow-y-auto px-5">
                <p className="text-charcoal pt-5">{selectedReview.content}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Photodump;
