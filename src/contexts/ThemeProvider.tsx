import { createContext, useContext, useState } from "react";

export type ThemeType = "light" | "dark";

export interface ThemeColors {
  tint: string;
  text: string;
  background: string;
  intense_background: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
}

export interface ThemeContextProps {
  theme: ThemeType;
  colors: {
    light: ThemeColors;
    dark: ThemeColors;
  };
  setTintColor: (color: string) => void;
  currentTintColor: string;
}

export const defaultTintColor = "#4f85ff";

export const ThemeContext = createContext<ThemeContextProps>({
  theme: "light",
  colors: {
    light: {
      text: "#11181C",
      background: "#fff",
      intense_background: "#f4f4f5",
      tint: defaultTintColor,
      icon: "#687076",
      tabIconDefault: "#687076",
      tabIconSelected: defaultTintColor,
    },
    dark: {
      text: "#ECEDEE",
      background: "#171719",
      intense_background: "#00000",
      tint: defaultTintColor,
      icon: "#9BA1A6",
      tabIconDefault: "#9BA1A6",
      tabIconSelected: defaultTintColor,
    },
  },
  setTintColor: () => {},
  currentTintColor: defaultTintColor,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tintColor, setTintColor] = useState(defaultTintColor);

  const colors = {
    light: {
      text: "#11181C",
      background: "#f4f4f5",
      intense_background: "#f4f4f5",
      tint: tintColor,
      icon: "#687076",
      tabIconDefault: "#687076",
      tabIconSelected: tintColor,
    },
    dark: {
      text: "#ECEDEE",
      background: "#171719",
      intense_background: "#00000",
      tint: tintColor,
      icon: "#9BA1A6",
      tabIconDefault: "#9BA1A6",
      tabIconSelected: tintColor,
    },
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: "light",
        colors,
        setTintColor,
        currentTintColor: tintColor,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
