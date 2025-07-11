import { useMemo } from 'react';
import { motion } from 'framer-motion';
import beverageWhisky from '../assets/beverage_whisky.png';
import beverageMargrita from '../assets/beverage_margrita.png';
import cafeCoffeemug from '../assets/cafe_coffeemug.png';
import cafeCoffeecookeis from '../assets/cafe_coffeecookeis.png';
import foodBibimbap from '../assets/food_bibimbap.png';
import foodCheeseboard from '../assets/food_cheeseboard.png';
import foodPaella from '../assets/food_paella.png';
import natureLake from '../assets/nature_lake.png';
import natureMarsh from '../assets/nature_marsh.png';
import placesExhibition from '../assets/places_exhibition.png';
import placesReligion from '../assets/places_religion.png';

const categoryImages = {
  beverage: [
    { src: beverageWhisky, alt: '위스키' },
    { src: beverageMargrita, alt: '마가리타' },
  ],
  cafe: [
    { src: cafeCoffeemug, alt: '커피잔' },
    { src: cafeCoffeecookeis, alt: '커피&쿠키' },
  ],
  food: [
    { src: foodBibimbap, alt: '비빔밥' },
    { src: foodCheeseboard, alt: '치즈보드' },
    { src: foodPaella, alt: '파에야' },
  ],
  nature: [
    { src: natureLake, alt: '호수' },
    { src: natureMarsh, alt: '습지' },
  ],
  places: [
    { src: placesExhibition, alt: '전시관' },
    { src: placesReligion, alt: '종교시설' },
  ],
};

function getRandomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const LoadingSpinner = ({ message = '로딩 중...' }) => {
  // 마운트 시 카테고리별로 랜덤 이미지 1개씩 선택
  const icons = useMemo(
    () => [
      getRandomFromArray(categoryImages.beverage),
      getRandomFromArray(categoryImages.cafe),
      getRandomFromArray(categoryImages.food),
      getRandomFromArray(categoryImages.nature),
      getRandomFromArray(categoryImages.places),
    ],
    [],
  );

  const radius = 110;
  const iconSize = 80;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-12 flex flex-col items-center min-w-[400px]">
        <div className="relative w-80 h-80 mb-12 flex items-center justify-center">
          {icons.map((icon, index) => {
            const angle = index * 72 * (Math.PI / 180);
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            return (
              <motion.div
                key={index}
                className="absolute"
                style={{
                  left: '50%',
                  top: '50%',
                  width: `${iconSize}px`,
                  height: `${iconSize}px`,
                  transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transformStyle: 'preserve-3d',
                }}
              >
                <motion.div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transformStyle: 'preserve-3d',
                  }}
                  animate={{ rotateY: [0, 360] }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: index * 0.2,
                  }}
                >
                  <img
                    src={icon.src}
                    alt={icon.alt}
                    className="w-full h-full object-contain"
                    style={{ willChange: 'transform' }}
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {message}
          </h3>
          <p className="text-sm text-gray-600">잠시만 기다려주세요...</p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
