import { useTheme } from "@/contexts/ThemeProvider";
import { Stack } from "expo-router";
import { useColorScheme } from "nativewind";

export default function StackLayout() {
  const { colorScheme } = useColorScheme();
  const { colors } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors[colorScheme || "light"].background,
        },
        headerTintColor: colors[colorScheme || "light"].text,
        navigationBarColor: colors[colorScheme || "light"].background,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="config" options={{ title: "Ajustes" }} />
      <Stack.Screen
        name="new-password"
        options={{
          title: "Nova Senha",
        }}
      />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
