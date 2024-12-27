import { DEFAULT_USER_NAME, useUser } from "@/contexts/UserProvider";
import { Image, View } from "react-native";
import { ThemedText } from "../ui/ThemedText";
import { HelloWave } from "../ui/HelloWave";
import { useTheme } from "@/contexts/ThemeProvider";

export function Greeting() {
  const { userName } = useUser();
  const { currentTintColor } = useTheme();

  const greeting =
    new Date().getHours() < 12
      ? "manhã"
      : new Date().getHours() < 18
      ? "tarde"
      : "noite";
  return (
    <View>
      <View className="flex-row gap-4 items-center">
        <Image
          source={{ uri: "https://github.com/jefersonapps.png" }}
          width={45}
          height={45}
          className="rounded-full border-[3px] flex-shrink-0"
          style={{ borderColor: currentTintColor }}
        />

        <View>
          {userName !== DEFAULT_USER_NAME ? (
            <View className="flex-row items-center">
              <ThemedText numberOfLines={1}>Olá, </ThemedText>
              <ThemedText numberOfLines={1} type="defaultSemiBold">
                {userName.split(" ")[0]} {"  "}
              </ThemedText>
              <HelloWave />
            </View>
          ) : (
            <View className="flex-row items-center">
              <ThemedText numberOfLines={1}>Olá! {"  "}</ThemedText>
              <HelloWave />
            </View>
          )}
          <ThemedText type="subtitle">Tenha uma boa {greeting}!</ThemedText>
        </View>
      </View>
    </View>
  );
}
