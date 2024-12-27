import { Greeting } from "@/components/home/Greeting";
import { CircularProgress } from "@/components/ui/CircularProgress";
import { Header } from "@/components/ui/Header";
import { Input } from "@/components/ui/Input";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { useTheme } from "@/contexts/ThemeProvider";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const { currentTintColor } = useTheme();

  return (
    <ThemedView className="flex-1 px-4">
      <SafeAreaView className="gap-4">
        <Header title="Atividades" />

        <Greeting />

        <Input
          placeholder="Busque uma atividade"
          onSubmitEditing={() => {}}
          returnKeyType="search"
          numberOfLines={1}
        >
          <Input.Icon name="magnifying-glass" onPress={() => {}} />
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
      </SafeAreaView>
    </ThemedView>
  );
}
