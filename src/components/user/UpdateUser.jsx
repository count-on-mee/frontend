import authAtom from "../../recoil/auth";
import { getRecoil } from "recoil-nexus";
import api from "../../utils/axiosInstance";

export default async function updateUser({ nickname, uploadImage }) {
  try {
    const token = getRecoil(authAtom).accessToken; 
    const formData = new FormData();
    if (nickname) formData.append('nickname', nickname);
    if (uploadImage) formData.append('profileImg', uploadImage);
    const response = await api.patch('/users/me', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  } catch (error) {
    console.error('Failed to update profile.:', error);
  }  
}