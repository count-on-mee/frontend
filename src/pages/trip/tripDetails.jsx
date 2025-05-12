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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await fetch(`http://localhost:8888/trips/${tripId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('여행 데이터를 가져오는데 실패했습니다.');
        }

        const tripData = await response.json();

        // 여행 데이터 설정
        if (tripData.tripItineraries) {
          const spotData = tripData.tripItineraries.flatMap((day) =>
            day.itineraries.map((spot) => ({
              id: spot.spotId,
              name: spot.title,
              address: spot.address,
              location: spot.location,
              day: day.day,
              order: spot.order,
            })),
          );
          setSpots(spotData);
        }
      } catch (error) {
        console.error('여행 데이터 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTripData();
  }, [tripId]);

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

    newSocket.on('todoUpdated', (todo) => {
      console.log('Todo updated:', todo);
      setTodos((prevTodos) =>
        prevTodos.map((t) => (t.id === todo.id ? todo : t)),
      );
    });

    newSocket.on('todoAdded', (todo) => {
      console.log('Todo added:', todo);
      setTodos((prevTodos) => [...prevTodos, todo]);
    });

    newSocket.on('todoDeleted', (todoId) => {
      console.log('Todo deleted:', todoId);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId));
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [tripId]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">비용</h2>
          <Expenses expenses={expenses} socket={socket} tripId={tripId} />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">숙소</h2>
          <Accommodation
            accommodations={accommodations}
            socket={socket}
            tripId={tripId}
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">장소</h2>
          <Spot spots={spots} socket={socket} tripId={tripId} />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">할 일</h2>
          <TodoList todos={todos} socket={socket} tripId={tripId} />
        </div>
      </div>
    </div>
  );
};

export default TripDetails;
