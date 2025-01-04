import "../../global.css";

import { Slot } from "expo-router";

import { ThemeProvider, useTheme } from "@/contexts/ThemeProvider";
import { UserProvider } from "@/contexts/UserProvider";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ShareIntentProvider } from "expo-share-intent";

export default function Layout() {
  const { colorScheme } = useColorScheme();
  const { colors } = useTheme();

  return (
    <ShareIntentProvider
      options={{
        debug: true,
        resetOnBackground: true,
      }}
    >
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
          <StatusBar
            style={colorScheme === "dark" ? "light" : "dark"}
            translucent
            backgroundColor={colors[colorScheme || "light"].background + 95}
          />
        </ThemeProvider>
      </GestureHandlerRootView>
    </ShareIntentProvider>
  );
}
