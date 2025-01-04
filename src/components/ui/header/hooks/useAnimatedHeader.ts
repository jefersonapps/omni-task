import { useState } from "react";
import {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  withTiming,
} from "react-native-reanimated";

export const useAnimatedHeader = () => {
  const [headerHeight, setHeaderHeight] = useState(0);
  const scrollY = useSharedValue(0);
  const lastScrollY = useSharedValue(0);
  const isHeaderVisible = useSharedValue(true);

  const scrollHandler = useAnimatedScrollHandler(
    (event) => {
      scrollY.value = event.contentOffset.y;

      if (scrollY.value <= 0) {
        if (!isHeaderVisible.value) {
          isHeaderVisible.value = true;
        }
      } else if (scrollY.value >= headerHeight) {
        const direction = event.contentOffset.y - lastScrollY.value;
        if (direction > 0 && isHeaderVisible.value) {
          isHeaderVisible.value = false;
        } else if (direction < 0 && !isHeaderVisible.value) {
          isHeaderVisible.value = true;
        }
      }

      lastScrollY.value = event.contentOffset.y;
    },
    [headerHeight]
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(isHeaderVisible.value ? 0 : -headerHeight, {
            duration: 300,
          }),
        },
      ],
    };
  });

  return {
    headerHeight,
    setHeaderHeight,
    scrollHandler,
    animatedStyle,
  };
};
