import { useEffect, useState, useRef } from "react";
import { View, LayoutChangeEvent } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedProps,
} from "react-native-reanimated";
import { ThemedText } from "./ThemedText";
import { useTheme } from "@/contexts/ThemeProvider";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function CircularProgress({
  percentage,
  ringRadius = 10,
}: {
  percentage: number;
  ringRadius?: number;
}) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const containerRef = useRef<View>(null);
  const { currentTintColor } = useTheme();

  const radius = Math.min(containerWidth, containerHeight) / 2 - ringRadius / 2;

  const strokeWidth = (ringRadius / 100) * containerWidth;
  const circumference = 2 * Math.PI * radius;

  const progress = useSharedValue(0);

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: withSpring((1 - percentage / 100) * circumference),
    };
  });

  useEffect(() => {
    progress.value = withSpring((1 - percentage / 100) * circumference, {
      damping: 5,
      stiffness: 100,
    });
  }, [percentage]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerWidth(width);
    setContainerHeight(height);
  };

  return (
    <View
      ref={containerRef}
      onLayout={handleLayout}
      className="justify-center items-center w-full h-full"
    >
      {/* Círculo de progresso */}
      <Svg
        width={containerWidth}
        height={containerHeight}
        viewBox={`0 0 ${containerWidth} ${containerHeight}`}
      >
        {/* Círculo de fundo */}
        <Circle
          cx={containerWidth / 2}
          cy={containerHeight / 2}
          r={radius}
          stroke="rgba(230, 230, 230, 0.4)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Círculo de progresso com animação */}
        <AnimatedCircle
          cx={containerWidth / 2}
          cy={containerHeight / 2}
          r={radius}
          stroke={currentTintColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          transform={`rotate(-90 ${containerWidth / 2} ${containerHeight / 2})`}
        />
      </Svg>

      {/* Texto do progresso */}
      <ThemedText type="defaultSemiBold" className="absolute">
        {percentage}%
      </ThemedText>
    </View>
  );
}
