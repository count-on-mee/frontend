import { Outlet } from 'react-router-dom';

function PlanLayout() {
  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="plan-layout-title"
    >
      <div className="flex items-center justify-center min-h-screen p-4 sm:p-6">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-background opacity-70 backdrop-filter backdrop-blur-xl"></div>
        </div>

        <div
          className="bg-[#EBEAE9] rounded-lg shadow-xl w-full max-w-3xl aspect-square relative z-10 flex flex-col"
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
