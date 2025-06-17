let token = null;

export const tokenStorage = {
  getToken: () => token,
  setToken: (newToken) => {
    token = newToken;
  },
};
