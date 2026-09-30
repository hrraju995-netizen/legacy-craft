import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: {
    primary_color: "#9f582c",
    secondary_color: "#1e293b",
    accent_color: "#d97706",
    cart_button_color: "#1e293b",
    cart_button_text_color: "#ffffff",
    cart_button_hover_color: "#000000",
    buy_now_button_color: "#9f582c",
    buy_now_button_text_color: "#ffffff",
    cart_button_text: "Add to cart",
    buy_now_button_text: "Buy it now",
    body_font: "Plus Jakarta Sans",
    heading_font: "Plus Jakarta Sans",
    button_radius: "full",
  },
  setTheme: (theme) =>
    set((state) => ({
      theme: { ...state.theme, ...(theme || {}) },
    })),
}));
