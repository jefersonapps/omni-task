import { useColorScheme } from "nativewind";
import {
  Text,
  Pressable,
  ScrollView,
  View,
  useWindowDimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import clsx from "clsx";
import {
  defaultTintColor,
  ThemeType,
  useTheme,
} from "../../contexts/ThemeProvider";
import { Header } from "@/components/ui/Header";
import { useState } from "react";
import { ColorPicker } from "@/components/config/ColorPicker";
import { ThemePreview } from "@/components/config/ThemePreview";
import { SectionContainer } from "@/components/config/SectionContainer";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { DEFAULT_USER_NAME, useUser } from "@/contexts/UserProvider";
import { Input } from "@/components/ui/Input";
import { ExternalLink } from "@/components/ui/ExternalLink";

export default function ConfigScreen() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [userColorScheme, setUserColorScheme] = useState<ThemeType>(
    colorScheme || "dark"
  );
  const { setTintColor, currentTintColor } = useTheme();

  const { width } = useWindowDimensions();

  const { userName, setUserName } = useUser();

  const [newUserName, setNewUserName] = useState("");

  const [isChangingUserName, setIsChangingUserName] = useState(false);

  const themeOptions = [
    { label: "Claro", value: "light" },
    { label: "Escuro", value: "dark" },
    { label: "Automático", value: "system" },
  ];

  const colors = [
    { label: "Padrão", hexValue: defaultTintColor },
    { label: "Ardósia", hexValue: "#94a3b8" },
    { label: "Zinco", hexValue: "#a1a1aa" },
    { label: "Vermelho", hexValue: "#f87171" },
    { label: "Laranja", hexValue: "#fb923c" },
    { label: "Âmbar", hexValue: "#f59e0b" },
    { label: "Limão", hexValue: "#65a30d" },
    { label: "Esmeralda", hexValue: "#059669" },
    { label: "Ciano", hexValue: "#0891b2" },
    { label: "Índigo", hexValue: "#6366f1" },
    { label: "Violeta", hexValue: "#8b5cf6" },
    { label: "Fúcsia", hexValue: "#c026d3" },
    { label: "Rosado", hexValue: "#f43f5e" },
  ];

  const THEMES_CONTAINER_WIDTH = 281;

  const currentColorLabel = colors.find(
    (color) => color.hexValue === currentTintColor
  )?.label;

  const handleChangeUserName = () => {
    if (newUserName.length > 0) {
      setUserName(newUserName);
    } else {
      setUserName("Digite seu nome...");
    }
    setIsChangingUserName(false);
  };

  return (
    <ThemedView className="flex-1 px-4">
      <SafeAreaView>
        <Header title="Ajustes" />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="gap-4 pb-20"
        >
          <SectionContainer className="items-center justify-center mt-4">
            <Image
              source={{ uri: "https://github.com/jefersonapps.png" }}
              width={100}
              height={100}
              className="rounded-full border-[3px] flex-shrink-0"
              style={{ borderColor: currentTintColor }}
            />

            {!isChangingUserName ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setIsChangingUserName(true);
                }}
                className="py-[7.4px]"
              >
                <ThemedText type="subtitle" numberOfLines={1}>
                  {userName}
                </ThemedText>
              </TouchableOpacity>
            ) : (
              <Input
                value={newUserName}
                onChangeText={setNewUserName}
                placeholder={DEFAULT_USER_NAME}
                autoFocus
                onSubmitEditing={handleChangeUserName}
                returnKeyType="send"
              >
                <Input.Icon name="pencil" onPress={handleChangeUserName} />
              </Input>
            )}
          </SectionContainer>

          <ThemedText type="title" numberOfLines={1} className="my-4">
            Aparência
          </ThemedText>

          <SectionContainer className="pt-2">
            <View className="flex-row justify-between items-center">
              <ThemedText>Cor</ThemedText>
              <ThemedText>{currentColorLabel}</ThemedText>
            </View>
            <ColorPicker
              colors={colors}
              activeColor={currentTintColor}
              onSelect={(color) => {
                setTintColor(color);
              }}
            />
          </SectionContainer>

          <SectionContainer className="pt-2">
            <ThemedText>Tema</ThemedText>
            <View className="flex-row justify-center">
              <View
                className={clsx(
                  "w-full",
                  width > THEMES_CONTAINER_WIDTH + 50 &&
                    `w-[${THEMES_CONTAINER_WIDTH}px]`
                )}
              >
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerClassName="gap-4"
                >
                  {themeOptions.map((option) => (
                    <Pressable
                      key={option.value}
                      onPress={() => {
                        setUserColorScheme(option.value as ThemeType);
                        setColorScheme(option.value as ThemeType);
                      }}
                      className="items-center"
                    >
                      <ThemePreview
                        colorScheme={option.value as ThemeType}
                        isActive={userColorScheme === option.value}
                        currentTintColor={currentTintColor}
                      />
                      <Text
                        className="mt-2 text-center"
                        style={{
                          color:
                            userColorScheme === option.value
                              ? currentTintColor
                              : undefined,
                        }}
                      >
                        <Text
                          className={clsx({
                            "text-zinc-800 dark:text-white":
                              userColorScheme !== option.value,
                          })}
                        >
                          {option.label}
                        </Text>
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            </View>
          </SectionContainer>

          <View className="flex-row justify-center items-center">
            <View className="w-40">
              <ExternalLink
                href="https://github.com/jefersonapps"
                className="flex-1"
              >
                <ExternalLink.Text className="text-center">
                  {"\u00A9"} jefersonapps
                </ExternalLink.Text>
              </ExternalLink>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}
