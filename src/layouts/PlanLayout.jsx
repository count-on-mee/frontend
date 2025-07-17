import { Outlet } from 'react-router-dom';

function PlanLayout() {
  return (
    <div
      className="fixed inset-0 z-40 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="plan-layout-title"
      style={{ top: '80px' }} // 헤더 높이만큼 아래에서 시작
    >
      <div className="flex items-center justify-center h-full p-4 sm:p-6">
        <div
          className="fixed inset-0 transition-opacity"
          aria-hidden="true"
          style={{ top: '80px' }}
        >
          <div className="absolute inset-0 bg-background opacity-70 backdrop-filter backdrop-blur-xl"></div>
        </div>

        <div
          className="bg-background-gray rounded-lg shadow-xl w-full max-w-3xl aspect-square relative z-10 flex flex-col"
          id="plan-layout-title"
        >
          <div className="flex-grow overflow-hidden p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlanLayout;
