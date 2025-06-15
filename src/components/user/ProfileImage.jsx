import { UserIcon } from '@heroicons/react/24/outline';

const ProfileImage = ({ user }) => {
  return (
    <div>
      { user && user.imgUrl ? (
        <img
          className="h-36 w-36 rounded-full my-5 object-cover mx-auto"
          src={user.imgUrl}
          alt="Profile"
        />
      ) : (
        <UserIcon
          className="bg-[#CCC5B9] justify-center rounded-full items-center p-10 my-10"
        />
      )}
    </div>
  );
}
export default ProfileImage;