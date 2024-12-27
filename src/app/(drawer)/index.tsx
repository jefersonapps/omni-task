import { Header } from "@/components/ui/Header";
import { ThemedView } from "@/components/ui/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  return (
    <ThemedView className="flex-1 px-4">
      <SafeAreaView>
        <Header title="" />
      </SafeAreaView>
    </ThemedView>
  );
}
