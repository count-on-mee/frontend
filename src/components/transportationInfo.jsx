import React from 'react';
import carIcon from '../assets/car.png';
import { layoutStyles } from '../utils/style';

const TransportationInfo = ({ duration, distance }) => {
  if (duration == null && distance == null) return null;
  return (
    <div
      className={`${layoutStyles.flex.center} ml-4 md:ml-16 my-2 gap-4 h-full`}
    >
      <div className={`${layoutStyles.flex.gap} h-full items-center`}>
        <img src={carIcon} alt="car" className="w-8 h-8 md:w-12 md:h-12" />
        {duration != null && (
          <span className="text-sm md:text-base font-semibold text-gray-700">
            {duration}분
          </span>
        )}
      </div>
      <div
        className={`${layoutStyles.flex.center} mx-2 md:mx-4 flex-col h-full justify-center`}
      >
        <span className="text-sm md:text-base font-bold text-gray-400">·</span>
        <span className="text-sm md:text-base font-bold text-gray-400">·</span>
        <span className="text-sm md:text-base font-bold text-gray-400">·</span>
      </div>
      {distance != null && (
        <div className={`${layoutStyles.flex.gap} h-full items-center`}>
          <span className="text-sm md:text-base font-semibold text-gray-700">
            {distance}km
          </span>
        </div>
      )}
    </div>
  );
};

export default TransportationInfo;
