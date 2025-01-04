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
      <Stack.Screen name="config" options={{ title: "Ajustes" }} />
      <Stack.Screen
        name="new-password"
        options={{
          title: "Nova senha",
        }}
      />
      <Stack.Screen
        name="editor"
        options={{
          title: "Nova nota",
          animation: "slide_from_bottom",
          headerStyle: {
            backgroundColor: colors[colorScheme || "dark"].background,
          },
          headerTintColor: colors[colorScheme || "dark"].text,
        }}
      />
      <Stack.Screen
        name="video/[uri]"
        options={{
          title: "Vídeo",
        }}
      />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
