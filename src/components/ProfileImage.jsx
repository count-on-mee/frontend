import React from 'react';
import { UserIcon } from '@heroicons/react/24/outline';

const ProfileImage = ({ user }) => {
  return (
    <div>
      { user && user.profileImgUrl ? (
        <img
          className="h-36 w-36 rounded-full my-10 object-cover mx-auto"
          src={user.profileImgUrl}
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