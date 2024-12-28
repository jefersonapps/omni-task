import "../../global.css";

import { Slot } from "expo-router";

import { ThemeProvider, useTheme } from "@/contexts/ThemeProvider";
import { UserProvider } from "@/contexts/UserProvider";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Layout() {
  const { colorScheme } = useColorScheme();
  const { colors } = useTheme();
  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
        backgroundColor: colors[colorScheme || "light"].background,
      }}
    >
      <ThemeProvider>
        <UserProvider>
          <Slot />
        </UserProvider>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
