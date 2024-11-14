import React, { useMemo, useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

const AccordionItem = ({ title, content, isOpen, onToggle }) => {
  return (
    <div className="border-b border-black font-mixed">
      <div className="flex items-center p-4">
        <button className="mr-4 focus:outline-none" onClick={onToggle}>
          {isOpen ? '▼' : '▶'}
        </button>
        <h2 className="font-bold ">{title}</h2>
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
const AddSpotSection = ({ onClose, onSelect }) => {
  const userLists = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: `My List ${i + 1}`,
        places: Array.from({ length: 5 }, (_, j) => ({
          id: `${i + 1}-${j + 1}`,
          name: `Place ${j + 1} in List ${i + 1}`,
        })),
      })),
    [],
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-[#FFFCF2] opacity-70 backdrop-filter backdrop-blur-xl"></div>
        </div>
        <div className="bg-[#D6D6CB] rounded-lg shadow-xl w-full max-w-4xl h-[90vh] relative z-10 overflow-hidden">
          <div className="h-full overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-semibold text-[#252422]">
                My Scrap List
              </h2>
              <button
                onClick={onClose}
                className="text-[#252422] hover:text-[#EB5E28] transition-colors"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="space-y-6">
              {userLists.map(list => (
                <div key={list.id} className="bg-[#D6D6CB] rounded-lg p-4">
                  <h3 className="text-xl font-semibold text-[#252422] mb-3">
                    {list.name}
                  </h3>
                  <ul className="space-y-2">
                    {list.places.map(place => (
                      <li
                        key={place.id}
                        className="flex items-center justify-between"
                      >
                        <span className="text-[#252422]">{place.name}</span>
                        <button
                          onClick={() => onSelect(place.name)}
                          className="bg-[#EB5E28] text-white px-3 py-1 rounded-full text-sm font-semibold hover:bg-[#D64E1E] transition-colors"
                        >
                          선택하기
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
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
  const [spots, setSpots] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [comments, setComments] = useState({});
  const [activeCommentIndex, setActiveCommentIndex] = useState(null);
  const [editingCommentIndex, setEditingCommentIndex] = useState(null);

  const selectSpot = spot => {
    setSpots(prev => [...prev, spot]);
    setShowPopup(false);
  };

  const openPopup = () => setShowPopup(true);
  const closePopup = () => setShowPopup(false);

  const handleCommentClick = index => {
    setActiveCommentIndex(activeCommentIndex === index ? null : index);
    setEditingCommentIndex(null);
  };

  const handleCommentSubmit = (index, comment) => {
    if (comment.trim()) {
      setComments(prev => ({
        ...prev,
        [index]: [...(prev[index] || []), comment],
      }));
      setActiveCommentIndex(null);
    }
  };

  const handleCommentEdit = (spotIndex, commentIndex) => {
    setEditingCommentIndex({ spot: spotIndex, comment: commentIndex });
  };

  const handleCommentUpdate = (spotIndex, commentIndex, newComment) => {
    if (newComment.trim()) {
      setComments(prev => ({
        ...prev,
        [spotIndex]: prev[spotIndex].map((comment, index) =>
          index === commentIndex ? newComment : comment,
        ),
      }));
      setEditingCommentIndex(null);
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
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">여행 스팟</h2>
      {spots.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-6">
          <p className="text-lg text-gray-800 mb-4">
            스팟 후보를 작성해보세요!
          </p>
          <button
            onClick={openPopup}
            className="bg-orange-500 text-white font-semibold py-2 px-6 rounded-full hover:bg-orange-600 transition duration-300 shadow-lg"
          >
            Spot 추가하기
          </button>
        </div>
      ) : (
        <ul className="space-y-2">
          {spots.map((spot, index) => (
            <li
              key={index}
              className="group flex flex-col text-gray-800 relative"
            >
              <div className="flex items-center">
                <span className="mr-2">•</span>
                {spot}
                <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <CommentIcon onClick={() => handleCommentClick(index)} />
                </div>
              </div>
              {activeCommentIndex === index && (
                <div className="mt-2 p-2 rounded shadow-md bg-white">
                  <textarea
                    className="w-full p-2 border rounded"
                    placeholder="댓글을 입력하세요..."
                    onKeyPress={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleCommentSubmit(index, e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                </div>
              )}
              {comments[index] && comments[index].length > 0 && (
                <div className="mt-2 ml-4">
                  <h3 className="font-semibold">댓글:</h3>
                  <ul className="list-disc pl-5">
                    {comments[index].map((comment, commentIndex) => (
                      <li
                        key={commentIndex}
                        className="mt-1 flex justify-between items-center"
                      >
                        {editingCommentIndex &&
                        editingCommentIndex.spot === index &&
                        editingCommentIndex.comment === commentIndex ? (
                          <input
                            type="text"
                            defaultValue={comment}
                            className="border rounded p-1 flex-grow"
                            onKeyPress={e => {
                              if (e.key === 'Enter') {
                                handleCommentUpdate(
                                  index,
                                  commentIndex,
                                  e.target.value,
                                );
                              }
                            }}
                            onBlur={e =>
                              handleCommentUpdate(
                                index,
                                commentIndex,
                                e.target.value,
                              )
                            }
                          />
                        ) : (
                          <>
                            {comment}
                            <div className="flex space-x-2 ml-2">
                              <button
                                onClick={() =>
                                  handleCommentEdit(index, commentIndex)
                                }
                                className="text-sm text-blue-500 hover:text-blue-700"
                              >
                                수정
                              </button>
                              <button
                                onClick={() =>
                                  handleCommentDelete(index, commentIndex)
                                }
                                className="text-sm text-red-500 hover:text-red-700"
                              >
                                삭제
                              </button>
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
          <li>
            <button
              onClick={openPopup}
              className="mt-4 bg-orange-500 text-white font-semibold py-2 px-6 rounded-full hover:bg-orange-600 transition duration-300 shadow-lg"
            >
              Spot 추가하기
            </button>
          </li>
        </ul>
      )}
      {showPopup && (
        <AddSpotSection onClose={closePopup} onSelect={selectSpot} />
      )}
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
        { text: newTask, completed: false },
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
    <div className="bg-[#D6D6CB] p-7 rounded-lg shadow-lg">
      <div className="flex flex-col sm:flex-row w-full space-y-2 sm:space-y-0 sm:space-x-2">
        <input
          type="text"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder="새 할 일을 입력하세요..."
          className="w-full sm:w-4/5 px-5 py-1 sm:py-1 md:py-2 lg:py-3 border bg-transparent border-black rounded-full font-bold text-base"
        />
        <button
          onClick={handleAddTask}
          className="w-full sm:w-1/5 px-2 py-1 sm:py-1 md:py-2 lg:py-3 border border-black rounded-full font-bold text-lg"
        >
          추가
        </button>
      </div>
      <ul className="space-y-3">
        {tasks.map((task, index) => (
          <li key={index} className="flex items-center">
            <span
              onClick={() => toggleTaskCompletion(index)}
              className={`cursor-pointer w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${
                task.completed
                  ? 'bg-[#EB5E28] border-[#EB5E28]'
                  : 'border-gray-400'
              }`}
            ></span>
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
      loader={<h4>Loading...</h4>}
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
