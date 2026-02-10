import React, { useState, useMemo } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import useTripDetails from '../../hooks/useTripDetails';
import AccountBook from '../../components/trip/expense/accountBook';
import Accommodation from '../../components/trip/accommodation';
import TodoList from '../../components/trip/todolist';
import AllInOneView from '../../components/trip/allInOneView';
import { neumorphStyles } from '../../utils/style';
import expenseIcon from '../../assets/expense.png';
import hotelIcon from '../../assets/hotel.png';
import todolistIcon from '../../assets/todolist.png';
import documentIcon from '../../assets/document.png';

const TripDetails = () => {
  const { tripId } = useParams();
  const { socket, tripData } = useOutletContext();
  const [selectedTab, setSelectedTab] = useState('expenses');

  const {
    expenses,
    statistics,
    accommodations,
    tasks,
    loading,
    error,
    setExpenses,
    setAccommodations,
    setTasks,
    participantCount,
    setParticipantCount,
    refetch,
  } = useTripDetails(tripId);

  const tabs = useMemo(
    () => [
      { id: 'expenses', title: '비용', icon: expenseIcon },
      { id: 'accommodation', title: '숙소', icon: hotelIcon },
      { id: 'todo', title: '할 일', icon: todolistIcon },
      { id: 'all', title: '한눈에 보기', icon: documentIcon },
    ],
    [],
  );

  const renderContent = useMemo(() => {
    switch (selectedTab) {
      case 'expenses':
        return (
          <AccountBook
            socket={socket}
            tripId={tripId}
            expenses={expenses}
            statistics={statistics}
            participants={tripData?.participants || []}
            onExpenseUpdate={refetch}
          />
        );
      case 'accommodation':
        return (
          <Accommodation
            socket={socket}
            tripId={tripId}
            initialAccommodations={accommodations}
            setAccommodations={setAccommodations}
          />
        );
      case 'todo':
        return (
          <TodoList
            socket={socket}
            tripId={tripId}
            tasks={tasks}
            setTasks={setTasks}
          />
        );
      case 'all':
        return (
          <AllInOneView
            socket={socket}
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
  }, [
    selectedTab,
    socket,
    tripId,
    expenses,
    statistics,
    accommodations,
    tasks,
    tripData?.participants,
    participantCount,
    refetch,
    setAccommodations,
    setTasks,
    setExpenses,
    setParticipantCount,
  ]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400 text-lg">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500 text-lg">
          에러가 발생했습니다: {error.message || '알 수 없는 오류'}
        </div>
      </div>
    );
  }

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
          {renderContent}
        </div>
      </div>
    </div>
  );
};

export default TripDetails;
