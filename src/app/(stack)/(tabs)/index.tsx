import { View, TouchableOpacity } from "react-native";
import { Greeting } from "@/components/home/Greeting";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ThemedView } from "@/components/ui/ThemedView";
import { useTheme } from "@/contexts/ThemeProvider";
import { Octicons } from "@expo/vector-icons";
import { Link, router, useFocusEffect } from "expo-router";
import { useShareIntent } from "expo-share-intent";
import Animated from "react-native-reanimated";
import { useColorScheme } from "nativewind";
import { useAnimatedHeader } from "@/components/ui/header/hooks/useAnimatedHeader";
import { AnimatedHeaderWrapper } from "@/components/ui/header/AnimatedHeaderWrapper";
import { useCallback, useEffect } from "react";
import { useSearchItems } from "@/hooks/useSeachItems";
import { ListItem } from "@/components/home/ListItem";
import { useMediaManager } from "@/hooks/editor/useMediaManager";

const data = Array.from({ length: 500 }, (_, i) => ({
  id: String(i),
  title: `Item ${i + 1}`,
}));

export default function Home() {
  const { currentTintColor, colors } = useTheme();
  const { colorScheme } = useColorScheme();
  const { hasShareIntent, shareIntent, resetShareIntent } = useShareIntent();
  const { deleteAllMedia } = useMediaManager();

  useEffect(() => {
    if (hasShareIntent && (shareIntent.files || shareIntent.webUrl)) {
      router.replace("/editor");
      resetShareIntent();
    }
  }, [hasShareIntent]);

  useFocusEffect(
    useCallback(() => {
      deleteAllMedia();
    }, [])
  );

  const { headerHeight, setHeaderHeight, scrollHandler, animatedStyle } =
    useAnimatedHeader();

  const { searchTerm, filteredItems, handleSearch, handleSearchSubmit } =
    useSearchItems(data, ["title"]);

  return (
    <ThemedView className="flex-1 px-4">
      <AnimatedHeaderWrapper
        backgroundColor={colors[colorScheme || "light"].background}
        onLayout={setHeaderHeight}
        animatedStyle={animatedStyle}
        className="px-4"
      >
        <View className="py-4 gap-4">
          <View className="flex-row items-center justify-between">
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
            value={searchTerm}
            onChangeText={handleSearch}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
            numberOfLines={1}
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
        renderItem={({ item }) => <ListItem item={item} />}
      />

      <Link href="/editor" asChild>
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
