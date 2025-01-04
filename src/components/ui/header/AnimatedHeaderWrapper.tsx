import clsx from "clsx";
import React from "react";
import { StatusBar, ViewProps, ViewStyle } from "react-native";
import Animated, { AnimatedProps } from "react-native-reanimated";

interface AnimatedHeaderWrapperProps
  extends Omit<AnimatedProps<ViewProps>, "onLayout"> {
  children: React.ReactNode;
  style?: ViewStyle;
  backgroundColor: string;
  onLayout: (height: number) => void;
  animatedStyle: any;
}

export const AnimatedHeaderWrapper: React.FC<AnimatedHeaderWrapperProps> = ({
  children,
  style,
  backgroundColor,
  onLayout,
  animatedStyle,
  ...rest
}) => {
  return (
    <Animated.View
      onLayout={(e) => onLayout(e.nativeEvent.layout.height)}
      style={[
        {
          backgroundColor,
          paddingTop: StatusBar.currentHeight,
        },
        style,
        animatedStyle,
      ]}
      {...rest}
      className={clsx("absolute top-0 left-0 right-0 z-10", rest.className)}
    >
      {children}
    </Animated.View>
  );
};
