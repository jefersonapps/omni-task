import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { View } from "react-native";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Octicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useTheme } from "@/contexts/ThemeProvider";
import { useAnimatedHeader } from "@/components/ui/header/hooks/useAnimatedHeader";
import { AnimatedHeaderWrapper } from "@/components/ui/header/AnimatedHeaderWrapper";
import { useColorScheme } from "nativewind";
import { EquationItem } from "@/components/latex/EquationItem";
import { useSearchItems } from "@/hooks/useSeachItems";
import { AnimatedFlatList } from "@/components/ui/flat-list/AnimatedFlatList";

const data = Array.from({ length: 20 }, (_, i) => ({
  id: String(i),
  equation: `x^2 + y^2 = ${(i + 1) * 10}`,
}));

export default function LatexScreen() {
  const { currentTintColor, colors } = useTheme();
  const { colorScheme } = useColorScheme();
  const {
    headerHeight,
    scrollY,
    setHeaderHeight,
    scrollHandler,
    animatedStyle,
  } = useAnimatedHeader();

  const { searchTerm, filteredItems, handleSearch, handleSearchSubmit } =
    useSearchItems(data, ["equation"]);

  return (
    <ThemedView className="flex-1 px-4">
      <AnimatedHeaderWrapper
        backgroundColor={colors[colorScheme || "light"].background}
        onLayout={setHeaderHeight}
        animatedStyle={animatedStyle}
        className="px-4"
      >
        <View className="py-4 gap-4">
          <ThemedText type="title" numberOfLines={1}>
            Equações
          </ThemedText>
          <Input
            placeholder="Busque uma equação"
            returnKeyType="search"
            value={searchTerm}
            onChangeText={handleSearch}
            onSubmitEditing={handleSearchSubmit}
            numberOfLines={1}
          >
            <Input.Icon name="magnifying-glass" />
          </Input>
        </View>
      </AnimatedHeaderWrapper>

      <AnimatedFlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        onScroll={scrollHandler}
        headerHeight={headerHeight}
        scrollY={scrollY}
        renderItem={({ item }) => <EquationItem item={item} />}
      />

      <Link href="/new-equation" asChild>
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
