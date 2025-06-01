import { useEffect, useState } from 'react';
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import UploadImages from '../ui/UploadImages';
import Hashtag from '../ui/Hashtag';
import { useRecoilValue } from 'recoil';
import userAtom from '../../recoil/user';
import authAtom from '../../recoil/auth';
import { getRecoil } from 'recoil-nexus';
import api from '../../utils/axiosInstance';

export default function ReviewUploader({
  isOpen,
  onClose,
  selectedSpot,
  fetchPhotoDump,
}) {
  // if (!isOpen) return null;

  const user = useRecoilValue(userAtom);
  // console.log(user);
  const [newPhotos, setNewPhotos] = useState([]);
  const [newText, setNewText] = useState('');
  const [error, setError] = useState(false);
  const spot = selectedSpot;

  const handleUpload = (files) => {
    const updatePhotos = Array.from(files).map((file, index) => ({
      id: index,
      file,
      preview: URL.createObjectURL(file),
    }));
    // console.log(updatePhotos);
    setNewPhotos(updatePhotos);
  };

  useEffect(() => {
    return () => {
      newPhotos.forEach((photo) => {
        URL.revokeObjectURL(photo.preview);
      });
    };
  }, []);

  // useEffect(() => {
  //   console.log('newPhotos 상태:', newPhotos);
  //   console.log('newText:', newText);
  // }, [newPhotos, newText]);

  const handleSave = async () => {
    // console.log('handleSave 시작');
    const formData = new FormData();
    formData.append('userId', user.userId);
    newPhotos.forEach((photo) => {
      // console.log('사진 추가 중:', photo);
      formData.append('reviewImgs', photo.file);
    });
    formData.append('content', newText);
    // console.log([...formData.entries()]);
    try {
      const token = getRecoil(authAtom).accessToken;
      const response = await api.post(`/spots/${spot.id}/reviews`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log('응답:', response);
      // console.log('저장 완료');
      fetchPhotoDump();
      onClose();
    } catch (error) {
      console.error('저장 중 오류 발생:', error);
    }
  };

  const handleRemovePhoto = (index) => {
    // console.log('삭제index:', index);
    const updatedPhotos = [...newPhotos];
    const removed = updatedPhotos.splice(index, 1)[0];
    // console.log(updatedPhotos);
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

  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length > 1000) {
      setError(true);
    } else {
      setError(false);
      setNewText(value);
    }
  };

  // const handleDragEnter = (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  // };

  // const handleDragLeave = (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  // };

  return !isOpen ? null : (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-[100vh] max-h-[90vh] p-6 bg-white rounded-lg shadow-lg">
        <div className="flex pl-5 justify-between">
          <p className="text-lg font-bold">{spot.name}</p>
          <XMarkIcon className="w-6 h-6 cursor-pointer" onClick={onClose} />
        </div>
        <p className="px-5">{spot.address}</p>
        <Hashtag category={spot.category} />

        <div className="grid grid-cols-2 px-5">
          <div className="">
            <div className="pt-5 mb-2 text-xl font-mixed">사진</div>
            <div className="flex mb-3 text-sm font-mixed">
              사진은 최대 15장까지 업로드 가능합니다.
            </div>
            <div className="">
              <div className="border-2 border-dashed h-90">
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
          <div className="p-5 w-full">
            <div className="mt-5 text-xl font-mixed">후기</div>
            <textarea
              onChange={handleChange}
              className={`resize-none outline-none w-full h-90 mt-5 border-2 p-5 ${error ? 'border-red-500' : 'border-black'}`}
              placeholder="-리뷰 작성 시 유의사항 한 번 확인하기! &#13;&#13;-리뷰를 보는 모든 사용자와 사업자에게 상처가 되는 욕설, 비방, 명예훼손성 표현은 사용하지 말아주세요."
            />
            <p className="text-right">{newText.length}/1000</p>
            {error && (
              <div className="text-sm text-red-500">
                1000자 이내로 입력해주세요
              </div>
            )}
          </div>
        </div>
        <button
          className="w-full bg-[#EB5E28] font-mixed text-white py-2 rounded hover:bg-red-500"
          onClick={() => {
            handleSave();
          }}
        >
          후기 올리기
        </button>
      </div>
    </div>
  );
}
