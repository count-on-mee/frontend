import React, { useRef, useState } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import useTripDetails from '../../hooks/useTripDetails';
import Expenses from '../../components/trip/details/expenses';
import Accommodation from '../../components/trip/details/accommodation';
import TodoList from '../../components/trip/details/todolist';
import AllInOneView from '../../components/trip/details/allInOneView';
import { neumorphStyles } from '../../utils/style';
import expenseIcon from '../../assets/expense.png';
import hotelIcon from '../../assets/hotel.png';
import todolistIcon from '../../assets/todolist.png';
import documentIcon from '../../assets/document.png';

const TripDetails = () => {
  const { tripId } = useParams();
  const { socket, isConnected } = useOutletContext();
  const socketRef = useRef(null);
  const [selectedTab, setSelectedTab] = useState('expenses');

  const {
    expenses,
    accommodations,
    tasks,
    numberOfPeople,
    loading,
    error,
    setExpenses,
    setAccommodations,
    setTasks,
    setNumberOfPeople,
    participantCount,
    setParticipantCount,
  } = useTripDetails(tripId);

  // 소켓 인스턴스를 ref에 저장
  if (socket && !socketRef.current) {
    socketRef.current = socket;
  }

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>에러가 발생했습니다: {error.message}</div>;
  }

  const tabs = [
    { id: 'expenses', title: '비용', icon: expenseIcon },
    { id: 'accommodation', title: '숙소', icon: hotelIcon },
    { id: 'todo', title: '할 일', icon: todolistIcon },
    { id: 'all', title: '한눈에 보기', icon: documentIcon },
  ];

  const renderContent = () => {
    switch (selectedTab) {
      case 'expenses':
        return (
          <Expenses
            socket={socketRef.current}
            tripId={tripId}
            initialExpenses={expenses}
            setExpenses={setExpenses}
            participantCount={participantCount}
            setParticipantCount={setParticipantCount}
          />
        );
      case 'accommodation':
        return (
          <Accommodation
            socket={socketRef.current}
            tripId={tripId}
            initialAccommodations={accommodations}
            setAccommodations={setAccommodations}
          />
        );
      case 'todo':
        return (
          <TodoList
            socket={socketRef.current}
            tripId={tripId}
            tasks={tasks}
            setTasks={setTasks}
          />
        );
      case 'all':
        return (
          <AllInOneView
            socket={socketRef.current}
            tripId={tripId}
            expenses={expenses}
            accommodations={accommodations}
            tasks={tasks}
            setExpenses={setExpenses}
            setAccommodations={setAccommodations}
            setTasks={setTasks}
            participantCount={participantCount}
            setParticipantCount={setParticipantCount}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full bg-[#f0f0f3]">
      <div className="w-1/4 bg-[#f0f0f3] p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#252422] mb-2">
            여행 세부사항
          </h2>
          <div className="h-1 w-16 bg-[#FF8C4B] rounded"></div>
        </div>

        <div className="space-y-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                selectedTab === tab.id
                  ? 'shadow-[inset_4px_4px_8px_#d1d1d1,inset_-4px_-4px_8px_#ffffff]'
                  : 'hover:shadow-[4px_4px_8px_#d1d1d1,-4px_-4px_8px_#ffffff]'
              }`}
              style={{
                borderLeft: `4px solid ${
                  tab.id === 'all' ? '#4CAF50' : '#FF8C4B'
                }`,
                backgroundColor:
                  selectedTab === tab.id ? '#f0f0f3' : 'transparent',
              }}
            >
              <div className="flex items-center">
                <img src={tab.icon} alt={tab.title} className="w-8 h-8 mr-3" />
                <span className="text-lg font-medium text-gray-700">
                  {tab.title}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-6">
        <div
          className={`h-full ${neumorphStyles.base} rounded-2xl p-6 overflow-y-auto`}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default TripDetails;
