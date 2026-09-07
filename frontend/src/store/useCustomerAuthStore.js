import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCustomerAuthStore = create(
  persist(
    (set, get) => ({
      customer: null,
      token: null,

      setAuth: (customer, token) => {
        set({ customer, token });
      },

      clearAuth: () => {
        set({ customer: null, token: null });
      },

      isAuthenticated: () => {
        return !!get().token && !!get().customer;
      },
    }),
    {
      name: "lcs_customer_auth",
    }
  )
);
