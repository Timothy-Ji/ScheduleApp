import React, { PropsWithChildren, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = React.createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => {},
});

export const ThemeContextProvider: React.FC<PropsWithChildren> = (props) => {
  const [theme, setTheme] = useState<Theme>("light");
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
