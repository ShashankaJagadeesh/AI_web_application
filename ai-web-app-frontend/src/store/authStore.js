import { create } from "zustand";

const useAuthStore = create((set) => ({
    user: null,
    token: null,
    login: (token, user) => {
        console.log("Storing user in auth store:", user); // Debugging log
        set({ token, user });
    },
    logout: () => set({ token: null, user: null }), // Clear user & token on logout
}));

export default useAuthStore;
