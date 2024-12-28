import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LatexScreen() {
  return (
    <ThemedView className="flex-1 px-4">
      <SafeAreaView>
        <View className="gap-4 py-4">
          <ThemedText type="title" numberOfLines={1} className="my-4">
            Equações
          </ThemedText>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
