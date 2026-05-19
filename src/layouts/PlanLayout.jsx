import { Outlet } from 'react-router-dom';
import TripJoinCode from '../components/common/tripJoinCode';

function PlanLayout() {
  return (
    <div
      className="fixed inset-0 z-40 overflow-hidden bg-[#f0f0f3] top-14 bottom-16 desktop:top-[80px] desktop:bottom-0"
      role="dialog"
      aria-modal="true"
      aria-labelledby="plan-layout-title"
    >
      <div className="flex items-center justify-center h-full p-2 sm:p-4 md:p-8">
        <div className="fixed inset-0 top-14 desktop:top-[80px] transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-background opacity-70 backdrop-filter backdrop-blur-xl"></div>
        </div>

        <div className="w-full max-w-[900px] h-full desktop:h-auto desktop:aspect-square relative z-10">
          <Outlet />
        </div>
      </div>

      <TripJoinCode />
    </div>
  );
}

export default PlanLayout;
