"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/useThemeStore";

export default function ThemeInitializer({ theme }) {
  const setTheme = useThemeStore((s) => s.setTheme);

  useEffect(() => {
    if (theme && Object.keys(theme).length > 0) {
      setTheme(theme);
    }
  }, [theme, setTheme]);

  return null;
}
