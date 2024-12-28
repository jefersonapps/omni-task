import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input } from "@/components/ui/Input";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { router } from "expo-router";
import { Button } from "@/components/ui/Button";

export default function Passwords() {
  return (
    <ThemedView className="flex-1 px-4">
      <SafeAreaView>
        <View className="gap-4 py-4">
          <ThemedText type="title" numberOfLines={1} className="my-4">
            Senhas
          </ThemedText>
          <Input
            placeholder="Busque uma senha"
            onSubmitEditing={() => {}}
            returnKeyType="search"
            numberOfLines={1}
          >
            <Input.Icon name="magnifying-glass" />
          </Input>

          <ThemedText type="title" numberOfLines={1}>
            Senhas Salvas
          </ThemedText>

          <FlatList
            data={[]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View className="flex-row items-center justify-center"></View>
            )}
            ListEmptyComponent={
              <ThemedText type="primary" className="text-center">
                Nenhuma senha cadastrada
              </ThemedText>
            }
          />
        </View>

        <Button type="primary" onPress={() => router.push("/new-password")}>
          <Button.Text type="primarySemiBold">Nova Senha</Button.Text>
        </Button>
      </SafeAreaView>
    </ThemedView>
  );
}
