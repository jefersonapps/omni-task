import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import "../../global.css";

import { StatusBar } from "expo-status-bar";
import { ThemeProvider, useTheme } from "@/contexts/ThemeProvider";
import { UserProvider } from "@/contexts/UserProvider";
import { useColorScheme } from "nativewind";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const { colorScheme } = useColorScheme();
  const { colors } = useTheme();

  return (
    <ThemeProvider>
      <UserProvider>
        <Stack>
          <Stack.Screen
            name="(drawer)"
            options={{
              headerShown: false,
              navigationBarColor: colors[colorScheme || "dark"].background,
              navigationBarTranslucent: true,
            }}
          />
        </Stack>
      </UserProvider>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </ThemeProvider>
  );
}
