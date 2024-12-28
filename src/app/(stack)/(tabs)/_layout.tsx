import { useTheme } from "@/contexts/ThemeProvider";
import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useColorScheme } from "nativewind";

export default function RootLayout() {
  const { colors, currentTintColor } = useTheme();
  const { colorScheme } = useColorScheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: "none",
        tabBarStyle: {
          backgroundColor: colors[colorScheme || "light"].background,
        },
        tabBarShowLabel: false,
        tabBarLabelPosition: "beside-icon",
        tabBarActiveTintColor: currentTintColor,
      }}
      initialRouteName="index"
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Tarefas",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="book" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="latex"
        options={{
          tabBarLabel: "Latex",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="code" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="passwords"
        options={{
          tabBarLabel: "Senhas",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="lock" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
