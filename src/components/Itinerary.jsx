import React, { useState, forwardRef, useMemo, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { format, addDays, eachDayOfInterval } from 'date-fns';
import { ko } from 'date-fns/locale';
import { DragDropContext, Draggable } from '@hello-pangea/dnd';
import StrictModeDroppable from '../components/StrictModeDroppable';
import 'react-datepicker/dist/react-datepicker.css';
import { CalendarIcon } from '@heroicons/react/24/solid';
import { useRecoilState } from 'recoil';
import { useParams } from 'react-router-dom';
import tripDatesAtom from '../recoil/tripDates';
import selectedSpotsAtom from '../recoil/selectedSpots';
import ItineraryModal from '../components/ItineraryModal';
import scrapListAtom from '../recoil/scrapList';

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

const calculateDistances = async spots => {
  const service = new google.maps.DistanceMatrixService();
  const results = [];

  for (let i = 0; i < spots.length - 1; i++) {
    const origin = spots[i].name;
    const destination = spots[i + 1].name;

    try {
      const response = await service.getDistanceMatrix({
        origins: [origin],
        destinations: [destination],
        travelMode: 'DRIVING',
      });

      if (response.rows[0].elements[0].status === 'OK') {
        results.push({
          distance: response.rows[0].elements[0].distance.text,
          duration: response.rows[0].elements[0].duration.text,
        });
      } else {
        results.push({ distance: 'N/A', duration: 'N/A' });
      }
    } catch (error) {
      console.error('Error calculating distance:', error);
      results.push({ distance: 'Error', duration: 'Error' });
    }
  }

  return results;
};

const Itinerary = () => {
  const { tripId } = useParams();
  const [tripDates, setTripDates] = useRecoilState(tripDatesAtom);
  const [scrapList, setScrapList] = useRecoilState(scrapListAtom);
  const [selectedSpots, setSelectedSpots] = useRecoilState(selectedSpotsAtom);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDay, setSelectedDay] = useState(1);
  const [distances, setDistances] = useState([]);
  const [tripPeriod, setTripPeriod] = useState(0);
  const [spotsByDay, setSpotsByDay] = useState([]);
  const [filteredSpots, setFilteredSpots] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`http://localhost:8888/trips/${tripId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const tripData = await response.json();

        setTripDates({
          startDate: new Date(tripData.startDate),
          endDate: new Date(tripData.endDate),
        });

        const spots = tripData.tripItineraries.flatMap(day =>
          day.itineraries.map(itinerary => ({
            id: itinerary.spotId,
            name: itinerary.title,
            address: itinerary.address,
            location: itinerary.location,
          })),
        );

        setSelectedSpots(spots);
      } catch (error) {
        console.error('Error fetching trip data:', error);
      }
    };

    fetchTripData();
  }, [tripId, setTripDates, setSelectedSpots]);

  useEffect(() => {
    const getDistances = async () => {
      if (selectedSpots.length > 1) {
        const distanceResults = await calculateDistances(selectedSpots);
        setDistances(distanceResults);
      } else {
        setDistances([]);
      }
    };

    getDistances();
  }, [selectedSpots]);

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

  useEffect(() => {
    if (
      !tripDates.startDate ||
      isNaN(new Date(tripDates.startDate).getTime())
    ) {
      setTripDates(prev => ({ ...prev, startDate: new Date() }));
    }
    if (!tripDates.endDate || isNaN(new Date(tripDates.endDate).getTime())) {
      setTripDates(prev => ({ ...prev, endDate: addDays(new Date(), 7) }));
    }
  }, [tripDates, setTripDates]);

  const onDragEnd = result => {
    if (!result.destination) return;

    const dayIndex = selectedDay - 1;
    const items = Array.from(spotsByDay[dayIndex]);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedSpotsByDay = [...spotsByDay];
    updatedSpotsByDay[dayIndex] = items;
    setSpotsByDay(updatedSpotsByDay);
  };

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

  const handleAddSpot = newSpot => {
    setSelectedSpots(prev => [...prev, newSpot]);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const unselectedSpots = scrapList.filter(
      spot => !selectedSpots.some(selected => selected.spotId === spot.spotId),
    );
    setFilteredSpots(unselectedSpots);
  }, [scrapList, selectedSpots]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const totalDays = useMemo(() => {
    if (!tripDates.startDate || !tripDates.endDate) return 0;
    return (
      Math.ceil(
        (tripDates.endDate - tripDates.startDate) / (1000 * 60 * 60 * 24),
      ) + 1
    );
  }, [tripDates]);

  useEffect(() => {
    if (selectedDay > 0 && selectedDay <= tripPeriod) {
      setFilteredSpots(spotsByDay[selectedDay - 1] || []);
    }
  }, [selectedDay, spotsByDay, tripPeriod]);

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
      filteredSpots.map((spot, index) => (
        <React.Fragment key={spot.id}>
          <Draggable draggableId={String(spot.id)} index={index}>
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
                <span className="text-sm text-gray-500">
                  {format(
                    addDays(
                      new Date(tripDates.startDate),
                      selectedSpots.indexOf(spot) % tripPeriod,
                    ),
                    'yyyy-MM-dd',
                  )}
                </span>
              </li>
            )}
          </Draggable>
        </React.Fragment>
      )),
    [filteredSpots, tripDates.startDate, selectedSpots, tripPeriod],
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
          className={`w-full sm:w-auto bg-transparent border border-black text-black px-3 py-3 rounded-full transition duration-300 ${
            isEditing ? 'hover:bg-[#D54E23]' : 'hover:bg-[#D54E23]'
          } focus:outline-none focus:ring-2 focus:ring-[#EB5E28] focus:ring-opacity-50`}
        >
          {isEditing ? '저장' : '수정'}
        </button>
      </div>
      <div className="flex  my-4">
        <button className="bg-[#CCC5B9] text-[#2E2F35] border border-black px-4 py-2 rounded-full hover:bg-[#EB5E28] hover:text-white transition duration-300">
          친구 초대하기
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
        <button
          onClick={handleOpenModal}
          className="w-full bg-[#D54E23] text-white px-3 py-2 mt-6 rounded-lg hover:bg-[#EB5E28] transition duration-300"
        >
          Spot 추가하기
        </button>
        {isModalOpen && (
          <ItineraryModal
            filteredSpots={filteredSpots}
            onClose={handleCloseModal}
            onAddSpot={handleAddSpot}
          />
        )}
      </DragDropContext>
    </div>
  );
};

export default Itinerary;
