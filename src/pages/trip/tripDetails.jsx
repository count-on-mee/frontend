import React, { useRef } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import useTripDetails from '../../hooks/useTripDetails';
import Expenses from '../../components/trip/details/expenses';
import Accommodation from '../../components/trip/details/accommodation';
import TodoList from '../../components/trip/details/todolist';

const TripDetails = () => {
  const { tripId } = useParams();
  const { socket, isConnected } = useOutletContext();
  const socketRef = useRef(null);

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

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">비용</h2>
          <Expenses
            socket={socketRef.current}
            tripId={tripId}
            initialExpenses={expenses}
            setExpenses={setExpenses}
            participantCount={participantCount}
            setParticipantCount={setParticipantCount}
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">숙소</h2>
          <Accommodation
            socket={socketRef.current}
            tripId={tripId}
            initialAccommodations={accommodations}
            setAccommodations={setAccommodations}
          />
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">할 일</h2>
            <TodoList
              socket={socketRef.current}
              tripId={tripId}
              tasks={tasks}
              setTasks={setTasks}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetails;
