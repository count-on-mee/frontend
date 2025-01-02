import React, { useState } from "react";
import { XMarkIcon, TrashIcon } from "@heroicons/react/24/outline";
import UploadImages from "./UploadImages";

const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [newPhotos, setNewPhotos] = useState([]);
  const [newText, setNewText] = useState("");
  const [error, setError] = useState(false);

  const handleUpload = (files) => {
    const updatePhotos = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
  }));
    setNewPhotos(updatePhotos);
  }

  const handleSave = async () => {
    const formData = new FormData();
    newPhotos.forEach((photo) => formData.append("photos", photo.file));
    formData.append("text", newText);
    try {
      const response = await fetch("/", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("저장 실패");
      }
      console.log("저장 완료");
      onClose();
    } catch (error) {
      console.error("저장 중 오류 발생:",error);
    }
  };

  const handleRemovePhoto = (index) => {
    const updatedPhotos = [...newPhotos];
    URL.revokeObjectURL(updatedPhotos[index]);
    updatedPhotos.splice(index, 1);
    setNewPhotos(updatedPhotos);
    };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("newPhotosIndex", index);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = e.dataTransfer.getData("newPhotosIndex");
    const updatedPhotos = [...newPhotos];
    const draggedPhoto = updatedPhotos.splice(dragIndex, 1)[0];
    updatedPhotos.splice(dropIndex, 0, draggedPhoto);
    setNewPhotos(updatedPhotos);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length > 100) {
      setError(true);
    } else {
      setError(false);
      setNewText(value);
    }
  }

  // const handleDragEnter = (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  // };

  // const handleDragLeave = (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  // };
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
        <div className="flex justify-between">
          <div className="font-mixed text-xl flex mb-5">Photos upload</div>
          <XMarkIcon className="flex w-6 h-6 cursor-pointer" onClick={onClose}/>
        </div>
        <div className="font-mixed text-sm flex mb-5">사진은 최대 10장까지 업로드 가능합니다.</div>
        <div className="flex">
          <div className="w-full h-72 mx-2 border border-dashed border-2"
          >
            {newPhotos.length === 0 ? (
              <UploadImages onUpload={handleUpload}  
              mode="multiple"
              className="mx-auto py-10" />
            ) : (
              <div className="flex flex-wrap grid grid-cols-5 place-items-center">
              {newPhotos.map((photo, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragOver={handleDragOver}
                  className="mt-4 mb-1 w-28 h-28 border relative"
                >
                  <img src={photo.preview} alt={`Preview-${index}`}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-0 left-0 w-full h-full bg-gray-500 bg-opacity-0 hover:bg-opacity-50 transition-opacity">
                    <button className="absolute top-8 left-8 opacity-0 hover:opacity-80 transition-opacity"
                    onClick={handleRemovePhoto}>
                      <TrashIcon className="w-12 h-12 text-white"/>
                    </button>
                  </div>
                  
                </div>
              ))}
              </div>
            )}
          </div>
        </div>
        <div className="mt-5 font-mixed text-xl">
          text
        </div>
        <textarea
          value={newText}
          onChange={handleChange}
          className={`resize-none outline-none w-full h-20 mt-5 border-b-2 ${error ? "border-red-500" : "border-black"}`}
          placeholder="100자 이내로 입력해주세요."
        />
        {error && <div className="text-red-500 text-sm">100자 이내로 입력해주세요</div>}
        
        <button
          className="mt-5 w-full bg-[#EB5E28] font-mixed text-white py-2 rounded hover:bg-red-500"
          onClick={handleSave}
        >
          사진 올리기
        </button>
      </div>
    </div>
  );
};

export default Modal;
