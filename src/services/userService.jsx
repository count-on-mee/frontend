
export async function updateUser({ nickname, uploadImage }) {
  const token = localStorage.getItem('accessToken'); 
  
  const formData = new FormData();
  if (nickname) formData.append('nickname', nickname);
  if (uploadImage) formData.append('profileImgUrl', uploadImage);

  const response = await fetch('http://localhost:8888/users/me', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  console.log('FormData:', [...formData.entries()]);

  if (!response.ok) {
    // const errorResponse = await response.json();
    throw new Error('Failed to update profile');
  }
  
  return response.json(); 
}