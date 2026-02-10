import React from 'react';
import Expenses from './expense/expenses';
import Accommodation from './accommodation';
import TodoList from './todolist';
import expenseIcon from '../../assets/expense.png';
import hotelIcon from '../../assets/hotel.png';
import todolistIcon from '../../assets/todolist.png';

const AllInOneView = ({
  socket,
  tripId,
  expenses,
  accommodations,
  tasks,
  setExpenses,
  setAccommodations,
  setTasks,
  participantCount,
  setParticipantCount,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-3 text-[#252422] flex items-center">
          <img src={expenseIcon} alt="비용" className="w-8 h-8 mr-2" />
          비용
        </h2>
        <Expenses
          socket={socket}
          tripId={tripId}
          initialExpenses={expenses}
          setExpenses={setExpenses}
          participantCount={participantCount}
          setParticipantCount={setParticipantCount}
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
