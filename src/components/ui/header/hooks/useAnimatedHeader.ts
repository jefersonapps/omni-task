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
  const scrollDelta = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(
    (event) => {
      scrollY.value = event.contentOffset.y;
      const delta = event.contentOffset.y - lastScrollY.value;

      if (scrollY.value <= headerHeight) {
        isHeaderVisible.value = true;
        scrollDelta.value = 0;
      } else {
        scrollDelta.value += delta;

        if (Math.abs(scrollDelta.value) >= headerHeight) {
          if (scrollDelta.value > 0 && isHeaderVisible.value) {
            isHeaderVisible.value = false;
          } else if (scrollDelta.value < 0 && !isHeaderVisible.value) {
            isHeaderVisible.value = true;
          }
          scrollDelta.value = 0;
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
    scrollY,
  };
};
