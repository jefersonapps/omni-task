import { Greeting } from "@/components/home/Greeting";
import { Button } from "@/components/ui/Button";
import { CircularProgress } from "@/components/ui/CircularProgress";
import { Input } from "@/components/ui/Input";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { useTheme } from "@/contexts/ThemeProvider";
import { Octicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const { currentTintColor } = useTheme();

  return (
    <ThemedView className="flex-1 px-4">
      <SafeAreaView>
        <View className="gap-4 py-4">
          <View className="flex-row py-4 items-center justify-between">
            <Greeting />

            <Link href="/config" asChild>
              <Button type="primary" className="px-2.5">
                <Button.Icon
                  customIcon={
                    <Octicons name="gear" size={24} color={currentTintColor} />
                  }
                />
              </Button>
            </Link>
          </View>

          <Input
            placeholder="Busque uma atividade"
            onSubmitEditing={() => {}}
            returnKeyType="search"
            numberOfLines={1}
          >
            <TouchableOpacity activeOpacity={0.8} onPress={() => {}}>
              <Input.Icon name="magnifying-glass" />
            </TouchableOpacity>
          </Input>

          <View className="flex-row p-4 bg-zinc-100 border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 rounded-xl items-center">
            <View className="flex-1 gap-2">
              <View className="gap-1">
                <ThemedText type="subtitle" numberOfLines={1}>
                  Progresso
                </ThemedText>
                <ThemedText
                  type="smallText"
                  numberOfLines={1}
                  className="text-zinc-600 dark:text-zinc-300"
                >
                  30 concluídas
                </ThemedText>
              </View>

              <View
                className="rounded-full px-3 self-start"
                style={{ backgroundColor: currentTintColor + 60 }}
              >
                <ThemedText type="smallText">Total: 40</ThemedText>
              </View>
            </View>
            <View className="size-24">
              <CircularProgress percentage={60} ringRadius={12} />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
