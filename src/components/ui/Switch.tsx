import { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  interpolateColor,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface SwitchProps {
  value: boolean;
  onToggle: (newValue: boolean) => void;
  style?: any;
  duration?: number;
  trackColors?: { on: string; off: string };
}

export function Switch({
  value,
  onToggle,
  style,
  duration = 300,
  trackColors = { on: "#34C759", off: "#E5E5EA" },
}: SwitchProps) {
  const animatedValue = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    animatedValue.value = withSpring(value ? 1 : 0, { duration });
  }, [value]);

  const trackAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      animatedValue.value,
      [0, 1],
      [trackColors.off, trackColors.on]
    ),
    borderRadius: 20,
  }));

  const thumbAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withSpring(animatedValue.value * 20, {
          duration,
          dampingRatio: 0.7,
          stiffness: 105,
          overshootClamping: false,
          restDisplacementThreshold: 0.01,
          restSpeedThreshold: 2,
          reduceMotion: ReduceMotion.System,
        }),
      },
    ],
  }));

  const handlePress = () => {
    onToggle(!value);
  };

  return (
    <Pressable onPress={handlePress} style={[styles.container, style]}>
      <Animated.View style={[styles.track, trackAnimatedStyle]}>
        <Animated.View style={[styles.thumb, thumbAnimatedStyle]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  track: {
    width: 50,
    height: 30,
    padding: 2,
  },
  thumb: {
    width: 26,
    height: 26,
    backgroundColor: "#FFFFFF",
    borderRadius: 13,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
});
