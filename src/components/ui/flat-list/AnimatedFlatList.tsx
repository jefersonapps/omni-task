import { FlatList, ListRenderItem } from "react-native";
import Animated, {
  ScrollHandlerProcessed,
  SharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Button } from "../Button";
import { useRef } from "react";

interface AnimatedFlatListProps<T> {
  data: T[];
  headerHeight: number;
  onScroll: ScrollHandlerProcessed<Record<string, unknown>>;
  renderItem: ListRenderItem<T>;
  keyExtractor: (item: T, index: number) => string;
  scrollY: SharedValue<number>;
}

export function AnimatedFlatList<T>({
  data,
  headerHeight,
  onScroll,
  renderItem,
  keyExtractor,
  scrollY,
}: AnimatedFlatListProps<T>) {
  const flatListRef = useRef<FlatList>(null);
  const handleScrollToStart = () => {
    flatListRef.current?.scrollToIndex({
      index: 0,
      animated: true,
      viewOffset: 500,
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    if (headerHeight <= 0) {
      return {
        opacity: 0,
        transform: [{ scale: 0 }],
      };
    }

    const shouldHide = scrollY.value < headerHeight;

    return {
      opacity: withTiming(shouldHide ? 0 : 1),
      transform: [
        {
          scale: withSpring(shouldHide ? 0 : 1, { damping: 10 }),
        },
      ],
    };
  });

  const animatedFlatLIstStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(headerHeight > 0 ? 1 : 0),
    };
  });

  return (
    <>
      <Animated.FlatList
        data={data}
        ref={flatListRef}
        initialNumToRender={100}
        removeClippedSubviews={true}
        maxToRenderPerBatch={50}
        windowSize={50}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: headerHeight }}
        renderItem={renderItem}
        onScroll={onScroll}
        contentContainerClassName="gap-4"
        style={animatedFlatLIstStyle}
      />

      <Animated.View
        style={animatedStyle}
        className="absolute bottom-4 left-0 right-0 justify-center items-center"
      >
        <Button type="primary" variant="circle" onPressIn={handleScrollToStart}>
          <Button.Icon name="chevron-up" size={24} />
        </Button>
      </Animated.View>
    </>
  );
}
