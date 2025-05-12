import React, { useState } from 'react';

const Spot = ({ spots, socket, tripId }) => {
  const [newSpot, setNewSpot] = useState(null);
  const [selectedSpot, setSelectedSpot] = useState(null);

  const handleInputChange = (index, field, value) => {
    const updatedSpot = { ...spots[index], [field]: value };
    socket.emit('updateSpot', { tripId, spot: updatedSpot });
  };

  const handleNewSpotInputChange = (field, value) => {
    setNewSpot((prev) => ({ ...prev, [field]: value }));
  };

  const addSpot = () => {
    setNewSpot({
      name: '',
      address: '',
      note: '',
    });
  };

  const confirmNewSpot = () => {
    if (newSpot) {
      socket.emit('addSpot', { tripId, spot: newSpot });
      setNewSpot(null);
    }
  };

  const deleteSpot = (index) => {
    socket.emit('deleteSpot', { tripId, spotId: spots[index].id });
    setSelectedSpot(null);
  };

  const handleSpotClick = (index) => {
    setSelectedSpot(selectedSpot === index ? null : index);
  };

  const renderSpot = (spot, index, isNewSpot = false) => (
    <tr
      key={index}
      className="border-b border-black"
      onClick={() => !isNewSpot && handleSpotClick(index)}
    >
      <td className="p-2">
        <input
          type="text"
          value={isNewSpot ? newSpot.name : spot.name}
          onChange={(e) =>
            isNewSpot
              ? handleNewSpotInputChange('name', e.target.value)
              : handleInputChange(index, 'name', e.target.value)
          }
          className="w-full bg-transparent"
          placeholder="장소명"
        />
      </td>
      <td className="p-2">
        <input
          type="text"
          value={isNewSpot ? newSpot.address : spot.address}
          onChange={(e) =>
            isNewSpot
              ? handleNewSpotInputChange('address', e.target.value)
              : handleInputChange(index, 'address', e.target.value)
          }
          className="w-full bg-transparent"
          placeholder="주소"
        />
      </td>
      <td className="p-2">
        <input
          type="text"
          value={isNewSpot ? newSpot.note : spot.note}
          onChange={(e) =>
            isNewSpot
              ? handleNewSpotInputChange('note', e.target.value)
              : handleInputChange(index, 'note', e.target.value)
          }
          className="w-full bg-transparent"
          placeholder="메모"
        />
      </td>
      <td className="p-2">
        {!isNewSpot && selectedSpot === index && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteSpot(index);
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
            <th className="text-left p-3 font-bold text-sm">장소명</th>
            <th className="text-left p-3 font-bold text-sm">주소</th>
            <th className="text-left p-3 font-bold text-sm">메모</th>
            <th className="text-left p-3 font-bold text-sm"></th>
          </tr>
        </thead>
        <tbody>
          {spots.map((spot, index) => renderSpot(spot, index))}
          {newSpot && renderSpot(newSpot, spots.length, true)}
          <tr className="border-b border-black">
            <td colSpan="4" className="p-2 text-center">
              {newSpot ? (
                <button
                  onClick={confirmNewSpot}
                  className="w-full text-center py-2 px-4 bg-black text-white rounded-full hover:bg-gray-800 transition duration-300"
                >
                  확인
                </button>
              ) : (
                <button
                  onClick={addSpot}
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

export default Spot;
