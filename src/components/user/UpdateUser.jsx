import api from "../../utils/axiosInstance";

export default async function updateUser({ nickname, uploadImage }) {
  try {
    const formData = new FormData();
    if (nickname) formData.append('nickname', nickname);
    if (uploadImage) formData.append('profileImg', uploadImage);
    const response = await api.patch('/users/me', formData);
  } catch (error) {
    console.error('Failed to update profile.:', error);
  }  
}