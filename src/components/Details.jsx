import React, { useMemo, useState, useEffect, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useRecoilState, useRecoilValue } from 'recoil';
import tripDatesAtom from '../recoil/tripDates';
import selectedDestinationsAtom from '../recoil/selectedDestinations';
import selectedSpotsAtom from '../recoil/selectedSpots';
import scrapListAtom from '../recoil/scrapList';

const AccordionItem = ({ title, content, isOpen, onToggle }) => {
  return (
    <div className="border-b border-none font-mixed">
      <div className="flex items-center p-4 cursor-pointer" onClick={onToggle}>
        <span className="mr-4">{isOpen ? '▼' : '▶'}</span>
        <h2 className="font-bold">{title}</h2>
      </div>
      {isOpen && <div className="p-4">{content}</div>}
    </div>
  );
};

const ExpensesSection = () => {
  const [expenses, setExpenses] = useState({
    transportation: [
      { type: '가는편', amount: '' },
      { type: '오는편', amount: '' },
    ],
    accommodation: [
      { type: '1박 가격', amount: '' },
      { type: '인당 추가 요금', amount: '' },
    ],
    food: [{ name: '', amount: '' }],
  });
  const [newRow, setNewRow] = useState({
    transportation: null,
    accommodation: null,
    food: null,
  });
  const [total, setTotal] = useState(0);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [selectedRow, setSelectedRow] = useState({
    category: null,
    index: null,
  });

  const handleRowClick = (category, index) => {
    if (selectedRow.category === category && selectedRow.index === index) {
      setSelectedRow({ category: null, index: null });
    } else {
      setSelectedRow({ category, index });
    }
  };

  useEffect(() => {
    calculateTotal();
  }, [expenses, newRow]);

  const calculateTotal = () => {
    const newTotal = Object.entries(expenses).reduce(
      (sum, [category, items]) => {
        const categorySum = items.reduce(
          (catSum, item) => catSum + (parseFloat(item.amount) || 0),
          0,
        );
        const newRowAmount = newRow[category]
          ? parseFloat(newRow[category].amount) || 0
          : 0;
        return sum + categorySum + newRowAmount;
      },
      0,
    );
    setTotal(newTotal);
  };

  const handleInputChange = (category, index, field, value) => {
    setExpenses(prev => ({
      ...prev,
      [category]: prev[category].map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const handleNewRowInputChange = (category, field, value) => {
    setNewRow(prev => ({
      ...prev,
      [category]: { ...prev[category], [field]: value },
    }));
  };

  const addRow = category => {
    setNewRow(prev => ({
      ...prev,
      [category]:
        category === 'food'
          ? { name: '', amount: '' }
          : { type: '', amount: '' },
    }));
  };

  const confirmNewRow = category => {
    if (newRow[category]) {
      const newItem = {
        ...newRow[category],
        amount: newRow[category].amount
          ? parseFloat(newRow[category].amount)
          : 0,
      };
      setExpenses(prev => ({
        ...prev,
        [category]: [...prev[category], newItem],
      }));
      setNewRow(prev => ({ ...prev, [category]: null }));
    }
  };

  const deleteRow = (category, index) => {
    setExpenses(prev => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index),
    }));
    setSelectedRow({ category: null, index: null });
  };

  const renderRow = (category, item, index, isNewRow = false) => (
    <tr
      key={`${category}-${index}`}
      className="border-b border-black"
      onClick={() => !isNewRow && handleRowClick(category, index)}
    >
      {index === 0 && !isNewRow && (
        <td
          rowSpan={expenses[category].length + (newRow[category] ? 2 : 1)}
          className="p-4  border-r border-black"
        >
          {category === 'transportation'
            ? '교통편'
            : category === 'accommodation'
              ? '숙박비'
              : '식비'}
        </td>
      )}
      <td className="px-10">
        {category === 'food' ? (
          <input
            type="text"
            value={isNewRow ? newRow[category].name : item.name}
            onChange={e =>
              isNewRow
                ? handleNewRowInputChange(category, 'name', e.target.value)
                : handleInputChange(category, index, 'name', e.target.value)
            }
            className="w-full bg-transparent"
            placeholder={index === 0 ? '음식점명' : ''}
          />
        ) : index < 2 && !isNewRow ? (
          item.type
        ) : (
          <input
            type="text"
            value={isNewRow ? newRow[category].type : item.type}
            onChange={e =>
              isNewRow
                ? handleNewRowInputChange(category, 'type', e.target.value)
                : handleInputChange(category, index, 'type', e.target.value)
            }
            className="w-full bg-transparent"
            placeholder="항목 입력"
          />
        )}
      </td>
      <td className="p-2">
        <input
          type="text"
          value={isNewRow ? newRow[category].amount : item.amount}
          onChange={e =>
            isNewRow
              ? handleNewRowInputChange(category, 'amount', e.target.value)
              : handleInputChange(category, index, 'amount', e.target.value)
          }
          className="w-full bg-transparent"
          placeholder="금액 입력"
        />
      </td>
      <td className="p-4 ">
        {selectedRow.category === category &&
          selectedRow.index === index &&
          !isNewRow &&
          !(
            index === 0 ||
            (category === 'transportation' && index < 2) ||
            (category === 'accommodation' && index < 2)
          ) && (
            <button
              onClick={e => {
                e.stopPropagation();
                deleteRow(category, index);
              }}
              className="text-red-500"
            >
              ⛔️
            </button>
          )}
      </td>
    </tr>
  );

  const formatNumber = num => {
    return num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const formatDecimal = num => {
    return num.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <div className="bg-[#D6D6CB] font-mixed text-black p-6 rounded-lg shadow-lg ">
      <table className="w-full border-separate border-spacing-0">
        <thead>
          <tr className="border-b-2 border-black">
            <th className="w-1/4 p-2">
              <span className="inline-block px-2.5 py-1 border border-black rounded-full font-bold text-lg">
                항목
              </span>
            </th>
            <th className="w-1/2 p-2">
              <span className="inline-block px-2.5 py-1 border border-black rounded-full font-bold text-lg">
                세부사항
              </span>
            </th>
            <th className="w-1/4 p-2">
              <span className="inline-block px-2.5 py-1 border border-black rounded-full font-bold text-lg">
                금액
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(expenses).map(([category, items]) => (
            <React.Fragment key={category}>
              {items.map((item, index) => renderRow(category, item, index))}
              {newRow[category] &&
                renderRow(category, newRow[category], items.length, true)}
              <tr className="border-b border-black">
                <td colSpan="3" className="p-3 text-center">
                  {newRow[category] ? (
                    <button
                      onClick={() => confirmNewRow(category)}
                      className="w-full text-center py-2 px-4 bg-gray-300 text-black rounded-full hover:bg-gray-800 transition duration-300"
                    >
                      {' '}
                      확인{' '}
                    </button>
                  ) : (
                    <button
                      onClick={() => addRow(category)}
                      className="w-full text-center py-1 px-2 border border-black rounded-full hover:bg-black hover:text-white transition duration-300"
                    >
                      {' '}
                      +{' '}
                    </button>
                  )}
                </td>
              </tr>
            </React.Fragment>
          ))}
          <tr className="border-t- border-black">
            <td colSpan="2" className="p-3 font-bold text-lg">
              합계
            </td>
            <td className="p-3 text-right font-bold text-lg">
              {formatNumber(total)} 원
            </td>
          </tr>
          <tr>
            <td colSpan="2" className="p-3">
              <span className="font-bold mr-2">정산하기</span>
              <input
                type="text"
                value={numberOfPeople}
                onChange={e => setNumberOfPeople(e.target.value)}
                className="w-20 bg-transparent border-b border-black p-1 text-center focus:outline-none focus:border-gray-600"
                placeholder="인원 수"
              />
            </td>
            <td className="p-3 text-right font-bold">
              {formatDecimal(total / parseFloat(numberOfPeople || 1))} 원
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const AccommodationSection = () => {
  const [accommodations, setAccommodations] = useState([
    {
      name: '',
      pricePerNight: '',
      additionalFee: '',
      distanceFromStation: '',
      etc: '',
    },
  ]);
  const [newRow, setNewRow] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleInputChange = (index, field, value) => {
    const newAccommodations = [...accommodations];
    newAccommodations[index][field] = value;
    setAccommodations(newAccommodations);
  };

  const handleNewRowInputChange = (field, value) => {
    setNewRow(prev => ({ ...prev, [field]: value }));
  };

  const addRow = () => {
    setNewRow({
      name: '',
      pricePerNight: '',
      additionalFee: '',
      distanceFromStation: '',
      etc: '',
    });
  };

  const confirmNewRow = () => {
    if (newRow) {
      setAccommodations([...accommodations, newRow]);
      setNewRow(null);
    }
  };

  const deleteRow = index => {
    setAccommodations(accommodations.filter((_, i) => i !== index));
    setSelectedRow(null);
  };

  const handleRowClick = index => {
    setSelectedRow(selectedRow === index ? null : index);
  };

  const renderRow = (acc, index, isNewRow = false) => (
    <tr
      key={index}
      className="border-b border-black"
      onClick={() => !isNewRow && handleRowClick(index)}
    >
      <td className="p-2">
        <input
          type="text"
          value={isNewRow ? newRow.name : acc.name}
          onChange={e =>
            isNewRow
              ? handleNewRowInputChange('name', e.target.value)
              : handleInputChange(index, 'name', e.target.value)
          }
          className="w-full bg-transparent"
          placeholder="숙소 이름"
        />
      </td>
      <td className="p-2">
        <input
          type="text"
          value={isNewRow ? newRow.pricePerNight : acc.pricePerNight}
          onChange={e =>
            isNewRow
              ? handleNewRowInputChange('pricePerNight', e.target.value)
              : handleInputChange(index, 'pricePerNight', e.target.value)
          }
          className="w-full bg-transparent"
          placeholder="1박 가격"
        />
      </td>
      <td className="p-2">
        <input
          type="text"
          value={isNewRow ? newRow.additionalFee : acc.additionalFee}
          onChange={e =>
            isNewRow
              ? handleNewRowInputChange('additionalFee', e.target.value)
              : handleInputChange(index, 'additionalFee', e.target.value)
          }
          className="w-full bg-transparent"
          placeholder="인당 추가 요금"
        />
      </td>
      <td className="p-2">
        <input
          type="text"
          value={
            isNewRow ? newRow.distanceFromStation : acc.distanceFromStation
          }
          onChange={e =>
            isNewRow
              ? handleNewRowInputChange('distanceFromStation', e.target.value)
              : handleInputChange(index, 'distanceFromStation', e.target.value)
          }
          className="w-full bg-transparent"
          placeholder="역으로부터 거리"
        />
      </td>
      <td className="p-2">
        <input
          type="text"
          value={isNewRow ? newRow.etc : acc.etc}
          onChange={e =>
            isNewRow
              ? handleNewRowInputChange('etc', e.target.value)
              : handleInputChange(index, 'etc', e.target.value)
          }
          className="w-full bg-transparent"
          placeholder="기타"
        />
      </td>
      <td className="p-2">
        {!isNewRow && selectedRow === index && (
          <button
            onClick={e => {
              e.stopPropagation();
              deleteRow(index);
            }}
            className="text-red-500"
          >
            ⛔️
          </button>
        )}
      </td>
    </tr>
  );

  return (
    <div className="bg-[#D6D6CB] p-6 rounded-lg shadow-lg">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-black">
            <th className="text-left p-3 font-bold text-sm">숙소 이름</th>
            <th className="text-left p-3 font-bold text-sm">1박 가격</th>
            <th className="text-left p-3 font-bold text-sm">인당 추가 요금</th>
            <th className="text-left p-3 font-bold text-sm">역으로부터 거리</th>
            <th className="text-left p-3 font-bold text-sm">기타</th>
            <th className="text-left p-3 font-bold text-sm"></th>
          </tr>
        </thead>
        <tbody>
          {accommodations.map((acc, index) => renderRow(acc, index))}
          {newRow && renderRow(newRow, accommodations.length, true)}
          <tr className="border-b border-black">
            <td colSpan="6" className="p-2 text-center">
              {newRow ? (
                <button
                  onClick={confirmNewRow}
                  className="w-full text-center py-2 px-4 bg-black text-white rounded-full hover:bg-gray-800 transition duration-300"
                >
                  확인
                </button>
              ) : (
                <button
                  onClick={addRow}
                  className="w-full text-center py-1 px-2 border border-black rounded-full hover:bg-black hover:text-white transition duration-300"
                >
                  +
                </button>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const CommentIcon = ({ onClick }) => (
  <svg
    onClick={onClick}
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 cursor-pointer text-gray-500 hover:text-[#EB5E28]"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
      clipRule="evenodd"
    />
  </svg>
);

const SpotSection = () => {
  const [selectedSpots] = useRecoilState(selectedSpotsAtom);
  const [dummySpots, setDummySpots] = useState([]);
  const [localSelectedSpots, setLocalSelectedSpots] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [editingComment, setEditingComment] = useState(null);
  const [showInput, setShowInput] = useState({});
  const [insertIndex, setInsertIndex] = useState(null);

  useEffect(() => {
    const initialDummySpots = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      name: `My List ${i + 1}`,
      places: Array.from({ length: 5 }, (_, j) => ({
        id: `${i + 1}-${j + 1}`,
        name: `Place ${j + 1} in List ${i + 1}`,
        url: `https://loremflickr.com/100/100?random=${5 * i + j}`,
      })),
    }));
    setDummySpots(initialDummySpots);
  }, []);

  const openPopup = (index = null) => {
    setInsertIndex(index);
    setShowPopup(true);
  };

  const closePopup = () => setShowPopup(false);

  const handleCommentSubmit = spotIndex => {
    const comment = newComment[spotIndex];
    if (comment && comment.trim()) {
      setComments(prev => ({
        ...prev,
        [spotIndex]: [...(prev[spotIndex] || []), comment],
      }));
      setNewComment(prev => ({ ...prev, [spotIndex]: '' }));
      setShowInput(prev => ({ ...prev, [spotIndex]: false }));
    }
  };

  const handleCommentEdit = (spotIndex, commentIndex, newComment) => {
    if (newComment.trim()) {
      setComments(prev => ({
        ...prev,
        [spotIndex]: prev[spotIndex].map((comment, index) =>
          index === commentIndex ? newComment : comment,
        ),
      }));
      setEditingComment(null);
    }
  };

  const handleCommentDelete = (spotIndex, commentIndex) => {
    setComments(prev => ({
      ...prev,
      [spotIndex]: prev[spotIndex].filter((_, index) => index !== commentIndex),
    }));
  };

  return (
    <div className="bg-[#D6D6CB] p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">📌</h2>
      {localSelectedSpots.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-6">
          <p className="text-base text-gray-800 mb-4">
            스팟 후보를 작성해보세요!
          </p>
          <button
            onClick={() => openPopup()}
            className="bg-transparent text-black font-semibold py-2 px-6 rounded-full border border-black hover:bg-orange-600 transition duration-300 shadow-lg"
          >
            Spot 추가하기
          </button>
        </div>
      ) : (
        <>
          <ul className="space-y-2">
            {localSelectedSpots.map((spot, spotIndex) => (
              <React.Fragment key={spot.id}>
                <li>
                  <div className="flex justify-between items-center">
                    <div className="relative">
                      <span className="text-lg font-semibold cursor-pointer inline-block group">
                        {spot.name}
                        <div className="absolute left-0 top-full mt-2 bg-white p-2 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 pointer-events-none">
                          <div className="flex space-x-2">
                            {spot.places.map(place => (
                              <img
                                key={place.id}
                                src={place.url}
                                alt={place.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                            ))}
                          </div>
                        </div>
                      </span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        onClick={() =>
                          setShowInput(prev => ({
                            ...prev,
                            [spotIndex]: !prev[spotIndex],
                          }))
                        }
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="h-6 w-6 cursor-pointer text-[#252422] hover:text-[#CCC5B9]"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                        />
                      </svg>
                    </div>
                  </div>
                  {showInput[spotIndex] && (
                    <div className="mt-4 flex items-center">
                      <input
                        type="text"
                        value={newComment[spotIndex] || ''}
                        onChange={e =>
                          setNewComment(prev => ({
                            ...prev,
                            [spotIndex]: e.target.value,
                          }))
                        }
                        placeholder="댓글을 입력하세요..."
                        className="border bg-transparent rounded-full  p-2 w-full border-[#252422] hover:text-black"
                      />
                      <button
                        onClick={() => handleCommentSubmit(spotIndex)}
                        className="w-1/5 ml-5 bg-transparent border border-black text-black px-2 py-2 rounded-full hover:bg-gray-500 hover:text-black transition-colors"
                      >
                        추가
                      </button>
                    </div>
                  )}
                  <ul className="mt-2 space-y-2">
                    {comments[spotIndex]?.map((comment, commentIndex) => (
                      <li
                        key={commentIndex}
                        className="flex justify-between items-center"
                      >
                        {editingComment?.spot === spotIndex &&
                        editingComment?.comment === commentIndex ? (
                          <input
                            type="text"
                            defaultValue={comment}
                            onBlur={e =>
                              handleCommentEdit(
                                spotIndex,
                                commentIndex,
                                e.target.value,
                              )
                            }
                            autoFocus
                          />
                        ) : (
                          <>
                            <span>{comment}</span>
                            <div className="flex items-center">
                              <svg
                                onClick={() =>
                                  setEditingComment({
                                    spot: spotIndex,
                                    comment: commentIndex,
                                  })
                                }
                                width="24px"
                                height="24px"
                                viewBox="0 0 24 24"
                                fill="#000000"
                                xmlns="http://www.w3.org/2000/svg"
                                className="cursor-pointer text-green-500 hover:text-green-700 mr-2"
                              >
                                <path d="m3.99 16.854-1.314 3.504a.75.75 0 0 0 .966.965l3.503-1.314a3 3 0 0 0 1.068-.687L18.36 9.175s-.354-1.061-1.414-2.122c-1.06-1.06-2.122-1.414-2.122-1.414L4.677 15.786a3 3 0 0 0-.687 1.068zm12.249-12.63l1.383-1.383c.248-.248.579-.406.925-.348.487.08 1.232.322 1.934 1.025.703.703.945 1.447 1.025 1.934.058.346-.1.677-.348.925L19.7747s-.353-1.06-1.414-2.12c-1.06-1.062-2.121-1.415-2.121-1.415z" />
                              </svg>
                              <svg
                                onClick={() =>
                                  handleCommentDelete(spotIndex, commentIndex)
                                }
                                fill="#000000"
                                version="1.1"
                                id="Layer_1"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 330 330"
                                xmlSpace="preserve"
                                className="cursor-pointer text-red-500 hover:text-red-700 w-5 h-5"
                              >
                                <path d="M315,285H201.214l124.393-124.394c5.858-5.857,5.858-15.355,0-21.213l-120-120c-5.857-5.858-15.355-5.858-21.213,0l-180,179.999C1.58,202.205,0,206.02,0,209.999s1.58,7.794,4.394,10.607l90,90c2.813,2.813,6.628,4.393,10.606,4.393L165,315c0.006,0,0.011-0.001,0.017-0.001L315,315c8.283,0,15-6.716,15-15C330,291.716,323.284,285,315,285z" />
                              </svg>
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </li>
                {spotIndex < localSelectedSpots.length - 1 && (
                  <hr className="border-t border-black my-[16px]" />
                )}
              </React.Fragment>
            ))}
            <li className="flex justify-center mt-4">
              <button
                onClick={() => openPopup(localSelectedSpots.length)}
                className="bg-[#EB5E28] rounded-full p-2 hover:bg-gray-300 transition duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </button>
            </li>
          </ul>
        </>
      )}
      {showPopup && (
        <AddSpotSection
          onClose={closePopup}
          onSelect={newSpots => {
            setLocalSelectedSpots(prevSpots => {
              const updatedSpots = [...prevSpots];
              if (insertIndex !== null) {
                updatedSpots.splice(insertIndex, 0, ...newSpots);
              } else {
                updatedSpots.push(...newSpots);
              }
              return updatedSpots;
            });
            closePopup();
          }}
          dummySpots={dummySpots}
          localSelectedSpots={localSelectedSpots}
        />
      )}
    </div>
  );
};

const AddSpotSection = ({
  onClose,
  onSelect,
  dummySpots,
  localSelectedSpots,
}) => {
  const [tempSelectedSpots, setTempSelectedSpots] = useState([]);

  const handleSpotToggle = spot => {
    setTempSelectedSpots(prev =>
      prev.some(s => s.id === spot.id)
        ? prev.filter(s => s.id !== spot.id)
        : [...prev, spot],
    );
  };

  const handleConfirm = () => {
    onSelect(tempSelectedSpots);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-[#FFFCF2] opacity-70 backdrop-filter backdrop-blur-xl"></div>
        </div>
        <div className="bg-[#D6D6CB] rounded-lg shadow-xl w-full max-w-[90%] h-[90vh] relative z-[10] overflow-hidden">
          <div className="h-full overflow-y-auto p-[24px]">
            <div className="flex items-center justify-between mb-[24px]">
              <h2 className="text-[24px] font-semibold text-[#252422]">
                My Scarp List
              </h2>
              <button
                onClick={onClose}
                className="text-[#252422] hover:text-[#EB5E28] transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-[24px] w-[24px]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <ul className="space-y-[16px]">
              {dummySpots.map(spot => (
                <li key={spot.id} className="hr">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">{spot.name}</span>
                    <button
                      onClick={() => handleSpotToggle(spot)}
                      className={`px-4 py-2 rounded-full transition-colors ${
                        tempSelectedSpots.some(s => s.id === spot.id)
                          ? 'bg-[#EB5E28] text-black border border-black'
                          : 'bg-transparent text-gray-800 hover:bg-gray-500 border border-black'
                      }`}
                    >
                      {tempSelectedSpots.some(s => s.id === spot.id)
                        ? '선택'
                        : '선택'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-[24px] flex justify-end">
              <button
                onClick={handleConfirm}
                className="bg-[#EB5E28] text-black border border-black px-4 py-2 rounded-full hover:bg-[#cc4f22] transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks(prevTasks => [
        ...prevTasks,
        { id: Date.now(), text: newTask, completed: false },
      ]);
      setNewTask('');
    }
  };

  const toggleTaskCompletion = index => {
    setTasks(prevTasks =>
      prevTasks.map((task, i) =>
        i === index ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  return (
    <div className="bg-[#D6D6CB] space-y-4 p-5 rounded-lg shadow-lg">
      <div className="flex flex-col  sm:flex-row w-full  sm:space-y-0 sm:space-x-2">
        <input
          type="text"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder="해야할 일을 입력하세요"
          className="w-full sm:w-4/5 px-5 py-1 sm:py-1 md:py-2 lg:py-2 border bg-transparent border-black rounded-full font-bold text-base"
        />
        <button
          onClick={handleAddTask}
          className="px-3 py-1 sm:py-1 md:py-2 lg:py-2 border border-black rounded-full font-bold text-lg"
        >
          추가
        </button>
      </div>
      <ul className="space-y-2">
        {tasks.map((task, index) => (
          <li key={task.id} className="flex items-center space-y-2">
            <span
              onClick={() => toggleTaskCompletion(index)}
              className={`cursor-pointer w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${
                task.completed
                  ? 'bg-[#EB5E28] border-[#EB5E28]'
                  : 'border-gray-400'
              }`}
            >
              {task.completed && (
                <span className="w-3 h-3 bg-white rounded-full"></span>
              )}
            </span>
            <span
              className={`ml-4 text-lg ${
                task.completed ? 'line-through text-gray-500' : 'text-gray-800'
              }`}
            >
              {task.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Details = () => {
  const [openSections, setOpenSections] = useState({
    expenses: false,
    accommodation: false,
    spot: false,
  });

  const toggleSection = section => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <InfiniteScroll
      dataLength={3}
      next={() => {}}
      hasMore={true}
      // loader={<h4>Loading...</h4>}
    >
      <div className="bg-[FFCF#F2] ">
        <AccordionItem
          title="경비"
          content={<ExpensesSection />}
          isOpen={openSections.expenses}
          onToggle={() => toggleSection('expenses')}
        />
        <AccordionItem
          title="숙소"
          content={<AccommodationSection />}
          isOpen={openSections.accommodation}
          onToggle={() => toggleSection('accommodation')}
        />
        <AccordionItem
          title="Spot 추가"
          content={<SpotSection />}
          isOpen={openSections.spot}
          onToggle={() => toggleSection('spot')}
        />
        <AccordionItem
          title="To Do List"
          content={<TodoList />}
          isOpen={openSections.tasks}
          onToggle={() => toggleSection('tasks')}
        />
      </div>
    </InfiniteScroll>
  );
};

export default Details;
