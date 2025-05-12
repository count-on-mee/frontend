// 임시 데이터
const mockTrips = {
  'temp-123': {
    id: 'temp-123',
    title: '제주도 여행',
    startDate: '2024-03-15',
    endDate: '2024-03-18',
    description: '봄 제주도 여행',
  },
};

const mockExpenses = {
  'temp-123': [
    { id: 1, item: '비행기', amount: '150000', note: '가는편' },
    { id: 2, item: '숙박', amount: '200000', note: '2박' },
  ],
};

const mockAccommodations = {
  'temp-123': [],
};

const mockSpots = {
  'temp-123': [
    { id: 1, name: '성산일출봉', address: '제주시 성산읍', note: '일출 명소' },
    { id: 2, name: '우도', address: '제주시 우도면', note: '자전거 여행' },
  ],
};

// API 함수들
export const getTrip = async (tripId) => {
  // 임의의 지연 시간 추가
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockTrips[tripId] || null;
};

export const getExpenses = async (tripId) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockExpenses[tripId] || [];
};

export const getAccommodations = async (tripId) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockAccommodations[tripId] || [];
};

export const getSpots = async (tripId) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockSpots[tripId] || [];
};

export const getTodoList = async (tripId) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockTodos[tripId] || [];
};

// Socket.IO 이벤트를 위한 임시 함수들
export const updateExpense = async (tripId, expense) => {
  if (!mockExpenses[tripId]) {
    mockExpenses[tripId] = [];
  }
  const index = mockExpenses[tripId].findIndex((e) => e.id === expense.id);
  if (index !== -1) {
    mockExpenses[tripId][index] = expense;
  }
  return expense;
};

export const updateAccommodation = async (tripId, accommodation) => {
  if (!mockAccommodations[tripId]) {
    mockAccommodations[tripId] = [];
  }
  const index = mockAccommodations[tripId].findIndex(
    (a) => a.id === accommodation.id,
  );
  if (index !== -1) {
    mockAccommodations[tripId][index] = accommodation;
  }
  return accommodation;
};

export const updateSpot = async (tripId, spot) => {
  if (!mockSpots[tripId]) {
    mockSpots[tripId] = [];
  }
  const index = mockSpots[tripId].findIndex((s) => s.id === spot.id);
  if (index !== -1) {
    mockSpots[tripId][index] = spot;
  }
  return spot;
};

export const updateTodo = async (tripId, todo) => {
  if (!mockTodos[tripId]) {
    mockTodos[tripId] = [];
  }
  const index = mockTodos[tripId].findIndex((t) => t.id === todo.id);
  if (index !== -1) {
    mockTodos[tripId][index] = todo;
  }
  return todo;
};
