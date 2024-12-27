import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { useColorScheme } from "nativewind";
import { Image, View } from "react-native";
import { Entypo, Feather, Ionicons } from "@expo/vector-icons";
import { CustomDrawerItem } from "./CustomDrawerItem";
import { ThemedText } from "../ui/ThemedText";
import { Separator } from "../ui/Separator";
import { useTheme } from "@/contexts/ThemeProvider";
import { DEFAULT_USER_NAME, useUser } from "@/contexts/UserProvider";
import { Button } from "../ui/Button";
import { router } from "expo-router";

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { colorScheme } = useColorScheme();
  const { currentTintColor } = useTheme();
  const { userName } = useUser();

  const iconColor = colorScheme === "dark" ? "white" : "black";

  return (
    <DrawerContentScrollView {...props}>
      <View className="flex-row py-5 mb-3 gap-4 items-center">
        <Image
          source={{ uri: "https://github.com/jefersonapps.png" }}
          width={60}
          height={60}
          className="rounded-full border-[3px] flex-shrink-0"
          style={{ borderColor: currentTintColor }}
        />
        <View className="flex-1">
          <ThemedText type="subtitle" numberOfLines={1}>
            {userName !== DEFAULT_USER_NAME ? (
              userName
            ) : (
              <Button
                type="primary"
                onPress={() => {
                  router.push("/config");
                }}
              >
                <Button.Icon
                  customIcon={
                    <Ionicons
                      name="settings-outline"
                      color={currentTintColor}
                      size={20}
                    />
                  }
                />
                <Button.Text type="primarySemiBold" numberOfLines={1}>
                  Definir nome
                </Button.Text>
              </Button>
            )}
          </ThemedText>
        </View>
      </View>

      <Separator />

      <CustomDrawerItem
        label="Atividades"
        href={"/"}
        icon={<Feather name="home" color={iconColor} />}
      />
      <CustomDrawerItem
        label="LaTeX"
        href={"/latex"}
        icon={<Entypo name="code" color={iconColor} />}
      />
      <CustomDrawerItem
        label="Senhas"
        href={"/passwords"}
        icon={<Entypo name="lock" color={iconColor} />}
      />
      <CustomDrawerItem
        label="Ajustes"
        href={"/config"}
        icon={<Ionicons name="settings-outline" color={iconColor} />}
      />
    </DrawerContentScrollView>
  );
}
