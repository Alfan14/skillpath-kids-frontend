export const storage = {
  getToken: () => {
    if (typeof window === "undefined")
      return null;

    return localStorage.getItem("token");
  },

  setToken: (token: string) => {
    localStorage.setItem("token", token);
  },

  removeToken: () => {
    localStorage.removeItem("token");
  },
};