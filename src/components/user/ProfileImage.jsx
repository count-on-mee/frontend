import { UserIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

const ProfileImage = ({ user, onImageChange }) => {
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImageChange([file]);
    }
  };

  return (
    <div className="relative inline-block">
      {user && user.imgUrl ? (
        <img
          className="h-36 w-36 rounded-full my-5 object-cover mx-auto"
          src={user.imgUrl}
          alt="Profile"
        />
      ) : (
        <UserIcon className="h-36 w-36 bg-[#CCC5B9] justify-center rounded-full items-center p-10 my-5 mx-auto" />
      )}

      <div className="absolute bottom-2 right-2">
        <label className="cursor-pointer">
          <PlusCircleIcon className="w-8 h-8 text-white bg-[#FF8C4B] rounded-full shadow-lg hover:bg-[#FF7A3A] transition-colors duration-200" />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};
export default ProfileImage;
