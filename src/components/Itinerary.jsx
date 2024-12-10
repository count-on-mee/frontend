import React, {
  useState,
  forwardRef,
  useMemo,
  useEffect,
  useContext,
} from 'react';
import DatePicker from 'react-datepicker';
import { format, addDays, eachDayOfInterval } from 'date-fns';
import { ko } from 'date-fns/locale';
import { DragDropContext, Draggable } from '@hello-pangea/dnd';
import StrictModeDroppable from '../components/StrictModeDroppable';
import 'react-datepicker/dist/react-datepicker.css';
import { CalendarIcon } from '@heroicons/react/24/solid';
import { useRecoilState } from 'recoil';
import tripDatesAtom from '../recoil/tripDates';
import selectedSpotsAtom from '../recoil/selectedSpots';
import { SocketContext } from '../layouts/ComLayout';

const CustomInput = forwardRef(({ value, onClick, placeholder }, ref) => (
  <button
    className="flex items-center space-x-2 p-3 border border-black rounded-full text-gray-900 bg-transparent hover:bg-gray-50 transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#D54E23] focus:border-transparent w-full sm:w-auto"
    onClick={onClick}
    ref={ref}
  >
    <CalendarIcon className="h-5 w-5 text-gray-400" />
    <span>{value || placeholder}</span>
  </button>
));

CustomInput.displayName = 'CustomInput';

const Itinerary = ({ tripId }) => {
  const [tripDates, setTripDates] = useRecoilState(tripDatesAtom);
  const [selectedSpots, setSelectedSpots] = useRecoilState(selectedSpotsAtom);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDay, setSelectedDay] = useState(1);
  const [tripPeriod, setTripPeriod] = useState(0);
  const [spotsByDay, setSpotsByDay] = useState([]);
  const socket = useContext(SocketContext);

  // 소켓 이벤트 설정
  useEffect(() => {
    if (socket && tripId) {
      socket.emit('join_trip', tripId);

      socket.on('selected_spots_updated', updatedSpots => {
        setSelectedSpots(updatedSpots);
      });

      socket.on('trip_dates_updated', updatedDates => {
        setTripDates(updatedDates);
      });

      return () => {
        socket.off('selected_spots_updated');
        socket.off('trip_dates_updated');
      };
    }
  }, [socket, tripId]);

  // 여행 날짜 변경 시 서버에 전송
  useEffect(() => {
    if (socket && tripDates) {
      socket.emit('update_trip_dates', { tripId, dates: tripDates });
    }
  }, [socket, tripDates, tripId]);

  // Spot 추가
  const addSpot = spot => {
    const updatedSpots = [...selectedSpots, spot];
    setSelectedSpots(updatedSpots);
    socket.emit('update_selected_spots', { tripId, spots: updatedSpots });
  };

  // Drag and Drop 핸들링
  const onDragEnd = result => {
    if (!result.destination) return;

    const dayIndex = selectedDay - 1;
    const items = Array.from(spotsByDay[dayIndex]);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedSpotsByDay = [...spotsByDay];
    updatedSpotsByDay[dayIndex] = items;
    setSpotsByDay(updatedSpotsByDay);

    // 서버로 업데이트된 데이터를 전송
    socket.emit('update_selected_spots', { tripId, spots: updatedSpotsByDay });
  };

  // 여행 날짜 계산 및 Spots 분배
  useEffect(() => {
    if (tripDates.startDate && tripDates.endDate) {
      const period = eachDayOfInterval({
        start: tripDates.startDate,
        end: tripDates.endDate,
      });
      setTripPeriod(period.length);

      const updatedSpotsByDay = Array.from({ length: period.length }, () => []);
      selectedSpots.forEach((spot, index) => {
        const dayIndex = index % period.length;
        updatedSpotsByDay[dayIndex].push(spot);
      });

      setSpotsByDay(updatedSpotsByDay);
    }
  }, [tripDates, selectedSpots]);

  // 날짜 변경 처리
  const handleDateChange = (date, isStart) => {
    setTripDates(prev => {
      const newDates = { ...prev };
      if (isStart) {
        newDates.startDate = date;
        if (date > prev.endDate) {
          newDates.endDate = date;
        }
      } else {
        newDates.endDate = date;
        if (date < prev.startDate) {
          newDates.startDate = date;
        }
      }
      return newDates;
    });
  };

  // 총 일수 계산
  const totalDays = useMemo(() => {
    if (!tripDates.startDate || !tripDates.endDate) return 0;
    return (
      Math.ceil(
        (tripDates.endDate - tripDates.startDate) / (1000 * 60 * 60 * 24),
      ) + 1
    );
  }, [tripDates]);

  const dayButtons = useMemo(() => {
    return Array.from({ length: totalDays }, (_, i) => (
      <button
        key={i}
        onClick={() => setSelectedDay(i + 1)}
        className={`px-3 py-2 rounded-full ${
          selectedDay === i + 1
            ? 'bg-[#D54E23] text-[#2E2F35]'
            : 'bg-[#2E2F35] text-[#FAF998]'
        } hover:bg-[#EB5E28] hover:text-[#FAF998] transition duration-300`}
      >
        Day {i + 1}
      </button>
    ));
  }, [totalDays, selectedDay]);

  const draggableItems = useMemo(
    () =>
      spotsByDay[selectedDay - 1]?.map((spot, index) => (
        <Draggable key={spot.id} draggableId={String(spot.id)} index={index}>
          {(provided, snapshot) => (
            <li
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={`bg-transparent p-4 rounded-lg shadow-lg flex justify-between items-center transition duration-300 ${
                snapshot.isDragging
                  ? 'bg-[#EB5E28] text-black'
                  : 'text-gray-900'
              }`}
            >
              <span className="font-semibold">{spot.name}</span>
            </li>
          )}
        </Draggable>
      )),
    [spotsByDay, selectedDay],
  );

  return (
    <div className="bg-transparent p-3 sm:p-3 rounded-lg font-mixed">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <DatePicker
            selected={tripDates.startDate}
            onChange={date => handleDateChange(date, true)}
            selectsStart
            startDate={tripDates.startDate}
            endDate={tripDates.endDate}
            minDate={new Date()}
            maxDate={addDays(new Date(), 365)}
            dateFormat="yyyy년 MM월 dd일"
            locale={ko}
            disabled={!isEditing}
            customInput={<CustomInput placeholder="시작 날짜" />}
          />
          <DatePicker
            selected={tripDates.endDate}
            onChange={date => handleDateChange(date, false)}
            selectsEnd
            startDate={tripDates.startDate}
            endDate={tripDates.endDate}
            minDate={tripDates.startDate}
            maxDate={addDays(tripDates.startDate, 30)}
            dateFormat="yyyy년 MM월 dd일"
            locale={ko}
            disabled={!isEditing}
            customInput={<CustomInput placeholder="종료 날짜" />}
          />
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`w-full sm:w-auto bg-transparent border-b border-black text-black px-3 py-3 rounded-full transition duration-300 ${
            isEditing ? 'hover:bg-[#D54E23]' : 'hover:bg-[#D54E23]'
          }`}
        >
          {isEditing ? '저장' : '수정'}
        </button>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">{dayButtons}</div>
      <DragDropContext onDragEnd={onDragEnd}>
        <StrictModeDroppable droppableId="spots">
          {provided => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {draggableItems}
              {provided.placeholder}
            </ul>
          )}
        </StrictModeDroppable>
      </DragDropContext>
    </div>
  );
};

export default Itinerary;
