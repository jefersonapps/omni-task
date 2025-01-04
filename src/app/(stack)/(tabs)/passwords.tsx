import { View, TouchableOpacity } from "react-native";
import { Input } from "@/components/ui/Input";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { Button } from "@/components/ui/Button";
import { Octicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useTheme } from "@/contexts/ThemeProvider";
import Animated from "react-native-reanimated";
import { useColorScheme } from "nativewind";
import { useAnimatedHeader } from "@/components/ui/header/hooks/useAnimatedHeader";
import { AnimatedHeaderWrapper } from "@/components/ui/header/AnimatedHeaderWrapper";
import { useSearchItems } from "@/hooks/useSeachItems";
import { PasswordItem } from "@/components/passwords/PasswordItem";

interface Password {
  id: string;
  serviceName: string;
}

const data: Password[] = Array.from({ length: 50 }, (_, i) => ({
  id: String(i),
  serviceName: `Senha ${i + 1}`,
}));

export default function Passwords() {
  const { currentTintColor, colors } = useTheme();
  const { colorScheme } = useColorScheme();
  const { headerHeight, setHeaderHeight, scrollHandler, animatedStyle } =
    useAnimatedHeader();

  const { searchTerm, filteredItems, handleSearch, handleSearchSubmit } =
    useSearchItems(data, ["serviceName"]);

  return (
    <ThemedView className="flex-1 px-4">
      <AnimatedHeaderWrapper
        backgroundColor={colors[colorScheme || "light"].background}
        onLayout={setHeaderHeight}
        animatedStyle={animatedStyle}
        className="px-4"
      >
        <View className="py-4 gap-4">
          <ThemedText type="title">Senhas</ThemedText>
          <Input
            placeholder="Busque uma senha"
            value={searchTerm}
            onChangeText={handleSearch}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          >
            <TouchableOpacity activeOpacity={0.8} onPress={handleSearchSubmit}>
              <Input.Icon name="magnifying-glass" />
            </TouchableOpacity>
          </Input>
        </View>
      </AnimatedHeaderWrapper>

      <Animated.FlatList
        data={filteredItems}
        initialNumToRender={100}
        removeClippedSubviews={true}
        maxToRenderPerBatch={50}
        windowSize={50}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: headerHeight }}
        renderItem={({ item }) => <PasswordItem item={item} />}
      />

      <Link href="/new-password" asChild>
        <Button type="primary" variant="float">
          <Button.Icon
            customIcon={
              <Octicons name="plus" size={24} color={currentTintColor} />
            }
          />
        </Button>
      </Link>
    </ThemedView>
  );
}
