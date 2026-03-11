import React from 'react';
import SettlementSummary from './settlementSummary';
import Accommodation from './accommodation';
import TodoList from './todolist';
import paymentIcon from '../../assets/payment.png';
import hotelIcon from '../../assets/hotel.png';
import todolistIcon from '../../assets/todolist.png';

const AllInOneView = ({
  socket,
  tripId,
  expenses,
  participants,
  currentUserId,
  accommodations,
  tasks,
  setAccommodations,
  setTasks,
  statistics,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-3 text-[#252422] flex items-center">
          <img src={paymentIcon} alt="정산 요약" className="w-8 h-8 mr-2" />
          정산 요약
        </h2>
        <SettlementSummary
          expenses={expenses}
          statistics={statistics}
          participants={participants}
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3 text-[#252422] flex items-center">
          <img src={hotelIcon} alt="숙소" className="w-8 h-8 mr-2" />
          숙소
        </h2>
        <Accommodation
          socket={socket}
          tripId={tripId}
          initialAccommodations={accommodations}
          setAccommodations={setAccommodations}
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3 text-[#252422] flex items-center">
          <img src={todolistIcon} alt="할 일" className="w-8 h-8 mr-2" />할 일
        </h2>
        <TodoList
          socket={socket}
          tripId={tripId}
          tasks={tasks}
          setTasks={setTasks}
        />
      </div>
    </div>
  );
};

export default AllInOneView;
