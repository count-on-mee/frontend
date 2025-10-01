import { XMarkIcon, TrashIcon } from "@heroicons/react/24/outline"
import { useState, useEffect } from "react"
import api from "../../utils/axiosInstance";
import UploadImages from "../ui/UploadImages";
import { getRecoil } from "recoil-nexus";
import authAtom from "../../recoil/auth";

export default function SpotUploader({isOpen, onClose}) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState(null);
  const [tel, setTel] = useState("");
  const [newPhotos, setNewPhotos] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [error, setError] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  
  const categories = ['숙소', '카페', '복합문화공간', '박물관', '미술관', '도서관', '역사', '종교', '관광지', '자연', '식당'];

  const handleCategoryClick = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleUpload = (files) => {
  const updatePhotos = Array.from(files).map((file, index) => ({
      id: index,
      file,
      preview: URL.createObjectURL(file),
    }));
    setNewPhotos(updatePhotos);
  };

  useEffect(() => {
      return () => {
        newPhotos.forEach((photo) => {
          URL.revokeObjectURL(photo.preview);
        });
      };
    }, []);

  const handleRemovePhoto = (index) => {
    const updatedPhotos = [...newPhotos];
    const removed = updatedPhotos.splice(index, 1)[0];
    if (removed?.preview) {
      URL.revokeObjectURL(removed.preview);
    }
    setNewPhotos(updatedPhotos);
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('newPhotosIndex', index);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = e.dataTransfer.getData('newPhotosIndex');
    const updatedPhotos = [...newPhotos];
    const draggedPhoto = updatedPhotos.splice(dragIndex, 1)[0];
    updatedPhotos.splice(dropIndex, 0, draggedPhoto);
    setNewPhotos(updatedPhotos);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleConvert = async () => {
    try {
      const response = await api.get(`/maps/geocode?address=${encodeURIComponent(address)}`);
      setCoords(response.data);
    } catch (error) {
      console.error("변환 실패:", error);
      const message = error.response?.data?.message
      setError(message || "요청에 실패하였습니다.");
    }
  }

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('address', address);
    formData.append("tel", tel);
    formData.append("latitude", coords.latitude);
    formData.append("longitude", coords.longitude);
    formData.append("categories", JSON.stringify(selectedCategories));
    newPhotos.forEach((photo) => {
      formData.append('spotImgs', photo.file);
    })
    try {
      const token = getRecoil(authAtom).accessToken;
      const response = await api.post(`/spots`, formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    setName("");
    setAddress("");
    setTel("");
    setCoords("");
    setSelectedCategories([]);
    setNewPhotos([]);
    onClose();
    } catch (error) {
      console.error("spot 등록 중 오류 발생", error);
    } finally {
      setIsConfirmOpen(false);
    }
  }

  useEffect(() => {
  if (!isOpen) {
    setIsConfirmOpen(false);
  }
}, [isOpen]);

  return !isOpen ? null : (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center">
    <div className="absolute inset-0 bg-black/50" onClick={onClose}>
    <div className="w-full max-w-[100vh] max-h-[90vh] p-6 bg-background-light rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
      <div className="flex justify-between">
        <p className="text-2xl font-bold">Spot 등록</p>
        <XMarkIcon className="w-6 h-6 cursor-pointer" onClick={onClose} />
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div className="my-5">
          <div className="text-xl font-mixed">Spot 이름</div>
          <textarea className="w-full border-b-2 h-6 resize-none overflow-hidden" value={name} onChange={(e) => setName(e.target.value)}></textarea>
          <div className="mt-5">
            <div className="text-xl mr-5">Category</div>
            <div className="">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className={`box-shadow mr-5 px-2 py-1 my-2  rounded-2xl ${selectedCategories.includes(category) ? 'bg-primary' : ''}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
          </div>
          <div className="text-xl mt-5">전화번호</div>
          <input className="w-full border-b-2 h-6 resize-none overflow-hidden" value={tel} onChange={(e)=> setTel(e.target.value)}></input>

               <div className="my-5">
              <div className="text-xl font-mixed">주소</div>
              <textarea 
                className="w-full border-b-2 h-6 mr-10 resize-none overflow-hidden"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  setError("");
                  setCoords("");
                  }}></textarea>
              <button 
                className="w-16 bg-[#EB5E28] font-mixed text-white py-2 rounded-2xl hover:bg-red-500"
                onClick={handleConvert}>검증</button>
              {coords && (
                <div className="">
                  <div>검증 완료</div>
                </div>
              )}
              {error && (
                <div>{error}</div>
              )}
          </div>
        </div>
        <div>
          <div className="text-xl">spot 사진</div>
          <div className="border-2 border-dashed h-90 mt-5">
            {newPhotos.length === 0 ? (
              <UploadImages
                onUpload={handleUpload}
                mode="multiple"
                className="py-10 mx-auto "
              />
              ) : (
              <div className="grid grid-cols-3 content-start h-full overflow-y-auto">
                {newPhotos.map((photo, index) => (
                  <div
                    key={index}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragOver={handleDragOver}
                    className="relative mx-2 my-4 w-22 h-22"
                  >
                    <div className="absolute  m-2 w-full h-full bg-gray-500/0 transition-all hover:bg-gray-500/50">
                      <img
                        src={photo.preview}
                        alt={`Preview-${index}`}
                        className=" object-cover border w-full h-full"
                      />
                      <button
                        className="absolute top-6 left-6 transition-opacity opacity-0 hover:opacity-80"
                        onClick={() => handleRemovePhoto(index)}
                      >
                        <TrashIcon className="w-10 h-10 text-white" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <button
          className="w-20 bg-[#EB5E28] font-mixed text-white py-2 rounded-2xl hover:bg-red-500 mt-5"
          onClick={() => setIsConfirmOpen(true)}
        >
          등록
        </button>
      </div>
    </div>
    {/* 확인모달 */}
    {isConfirmOpen && (
      <div className="fixed inset-0 flex bg-black/40 backdrop-blur-sm items-center justify-center z-100">
        <div className="bg-background-light p-6 rounded-xl max-w-[280px] text-center justify-center items-center">
          <div className="mb-4">spot 중복 검색 하셨습니까?</div>
          <div className="flex gap-3 justify-center">
            <button className="px-4 py-2 rounded-lg bg-background-gray hover:bg-primary hover:text-background-gray"
            onClick={() => setIsConfirmOpen(false)}>아니요</button>
            <button 
            className="px-4 py-2 rounded-lg bg-background-gray hover:bg-primary hover:text-background-gray"
            onClick={handleSubmit}>네</button>
          </div>
          
        </div>
      </div>
    )}
  </div>
  </div>
  
  )
}