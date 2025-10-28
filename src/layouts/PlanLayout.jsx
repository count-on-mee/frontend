import { Outlet } from 'react-router-dom';
import TripJoinCode from '../components/common/tripJoinCode';

function PlanLayout() {
  return (
    <div
      className="fixed inset-0 z-40 overflow-hidden bg-[#f0f0f3]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="plan-layout-title"
      style={{ top: '80px' }}
    >
      <div className="flex items-center justify-center h-full p-6 md:p-8">
        <div
          className="fixed inset-0 transition-opacity"
          aria-hidden="true"
          style={{ top: '80px' }}
        >
          <div className="absolute inset-0 bg-background opacity-70 backdrop-filter backdrop-blur-xl"></div>
        </div>

        <div className="w-full max-w-[900px] aspect-square relative z-10">
          <Outlet />
        </div>
      </div>

      <TripJoinCode />
    </div>
  );
}

export default PlanLayout;
