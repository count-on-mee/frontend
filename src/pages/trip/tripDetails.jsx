import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import Expenses from '../../components/trip/details/expenses';
import Accommodation from '../../components/trip/details/accommodation';
import Spot from '../../components/trip/details/spot';
import TodoList from '../../components/trip/details/todolist';

const TripDetails = () => {
  const { tripId } = useParams();
  const [socket, setSocket] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [accommodations, setAccommodations] = useState([]);
  const [spots, setSpots] = useState([]);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    // Socket.IO 연결 설정
    const newSocket = io('http://localhost:8888', {
      query: { tripId },
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    // 이벤트 리스너 설정
    newSocket.on('expenseUpdated', (data) => {
      console.log('Expense updated:', data);
      setExpenses((prev) =>
        prev.map((exp) => (exp.id === data.id ? data : exp)),
      );
    });

    newSocket.on('accommodationUpdated', (data) => {
      console.log('Accommodation updated:', data);
      setAccommodations((prev) =>
        prev.map((acc) => (acc.id === data.id ? data : acc)),
      );
    });

    newSocket.on('spotUpdated', (data) => {
      console.log('Spot updated:', data);
      setSpots((prev) => prev.map((s) => (s.id === data.id ? data : s)));
    });

    newSocket.on('todoUpdated', (data) => {
      console.log('Todo updated:', data);
      setTodos((prev) => prev.map((t) => (t.id === data.id ? data : t)));
    });

    setSocket(newSocket);

    // 임시 데이터 설정 (실제 API 호출 전)
    setExpenses([
      { id: 1, item: '비행기', amount: '150000', note: '가는편' },
      { id: 2, item: '숙박', amount: '200000', note: '2박' },
    ]);
    setAccommodations([
      {
        id: 1,
        name: '제주 호텔',
        checkIn: '2024-03-15',
        checkOut: '2024-03-17',
        note: '시티뷰',
      },
    ]);
    setSpots([
      {
        id: 1,
        name: '성산일출봉',
        address: '제주시 성산읍',
        note: '일출 명소',
      },
      { id: 2, name: '우도', address: '제주시 우도면', note: '자전거 여행' },
    ]);
    setTodos([
      { id: 1, task: '비행기 예약', completed: true },
      { id: 2, task: '숙소 예약', completed: false },
    ]);

    return () => {
      newSocket.disconnect();
    };
  }, [tripId]);

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">비용</h2>
          <Expenses expenses={expenses} socket={socket} tripId={tripId} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">숙소</h2>
          <Accommodation
            accommodations={accommodations}
            socket={socket}
            tripId={tripId}
          />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">장소</h2>
          <Spot spots={spots} socket={socket} tripId={tripId} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">할 일</h2>
          <TodoList todos={todos} socket={socket} tripId={tripId} />
        </div>
      </div>
    </div>
  );
};

export default TripDetails;
