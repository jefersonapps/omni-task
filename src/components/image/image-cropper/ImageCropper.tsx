import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Modal,
  useWindowDimensions,
  StyleProp,
  ViewStyle,
} from "react-native";
import {
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import { Direction, HandlerIcon } from "./components/HandlerIcon";
import * as ImageManipulator from "expo-image-manipulator";
import { useCropGestures } from "./hooks/useCropGestures";
import { useImageDimensions } from "./hooks/useImageDimensions";
import { ImageCropperProps } from "./types/ImageCropper.types";
import { Canvas, Group, Mask, Rect } from "@shopify/react-native-skia";
import { useRerenderOnAppStateChange } from "./hooks/useRerenderOnAppStateChange";
import { useTheme } from "@/contexts/ThemeProvider";
import { getAspectRatio } from "@/utils/functions";
import { Button } from "@/components/ui/Button";

const HANDLER_CONFIG = {
  size: 28,
  strokeWidth: 4,
  radius: 8,
};

const OUTER_TOUCH_AREA_SIZE = HANDLER_CONFIG.size - HANDLER_CONFIG.strokeWidth;

export const ImageCropper: React.FC<ImageCropperProps> = ({
  imageUri,
  isOpen,
  setIsOpen,
  onCropComplete,
}) => {
  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [rotation, setRotation] = useState(0);
  const [wrapperContainerDimensions, setWrapperContainerDimensions] = useState({
    width: 0,
    height: 0,
  });

  const { currentTintColor } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const imageDimensions = useImageDimensions(imageUri);
  const isInitializedRef = useRef(false);
  const lastCropPositionRef = useRef({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    rotation: 0,
  });

  const ASPECT_RATIO = getAspectRatio(
    imageDimensions.width,
    imageDimensions.height
  );
  const imageHeight = containerDimensions.width / ASPECT_RATIO;

  const MIN_SIZE = HANDLER_CONFIG.size * 3 + 8;
  const MAX_WIDTH = containerDimensions.width;
  const MAX_HEIGHT = imageHeight;

  const originX = useSharedValue(0);
  const originY = useSharedValue(0);
  const width = useSharedValue(0);
  const height = useSharedValue(0);
  const savedX = useSharedValue(0);
  const savedY = useSharedValue(0);
  const savedWidth = useSharedValue(0);
  const savedHeight = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const imageContainerOpacity = useSharedValue(0);
  const overlayScale = useSharedValue({ scaleX: 1, scaleY: 1 });
  const overlayTranslate = useSharedValue({ translateX: 0, translateY: 0 });

  const animatedImageContainerStyle = useAnimatedStyle(() => ({
    opacity: imageContainerOpacity.value,
  }));

  const animatedCropAreaStyle = useAnimatedStyle(() => ({
    left: originX.value,
    top: originY.value,
    width: width.value,
    height: height.value,
  }));

  const gestures = useCropGestures(
    {
      originX,
      originY,
      width,
      height,
      savedX,
      savedY,
      savedWidth,
      savedHeight,
      startX,
      startY,
    },
    {
      containerDimensions,
      imageHeight,
      MIN_SIZE,
      MAX_WIDTH,
      MAX_HEIGHT,
    }
  );

  const rotateImage = () => setRotation((prev) => (prev + 90) % 360);

  const saveCropPosition = () => {
    lastCropPositionRef.current = {
      ...lastCropPositionRef.current,
      x: originX.value,
      y: originY.value,
      width: width.value,
      height: height.value,
      rotation,
    };
  };

  const cropImage = async () => {
    try {
      saveCropPosition();
      const imageScaleX = containerDimensions.width / imageDimensions.width;
      const imageScaleY = imageHeight / imageDimensions.height;
      const cropData = {
        originX: originX.value / imageScaleX,
        originY: originY.value / imageScaleY,
        width: width.value / imageScaleX,
        height: height.value / imageScaleY,
      };
      const manipulatedResult = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ crop: cropData }, { rotate: rotation }],
        { compress: 1, format: ImageManipulator.SaveFormat.PNG }
      );
      onCropComplete(manipulatedResult);
      setIsOpen(false);
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  };

  const calculateDimensions = () => {
    if (!wrapperContainerDimensions.width || !wrapperContainerDimensions.height)
      return;
    const containerWidth = wrapperContainerDimensions.width;
    const containerHeight = wrapperContainerDimensions.height;
    let calculatedWidth = containerWidth;
    let calculatedHeight = containerWidth / ASPECT_RATIO;
    if (calculatedHeight > containerHeight) {
      calculatedHeight = containerHeight;
      calculatedWidth = containerHeight * ASPECT_RATIO;
    }
    setContainerDimensions({
      width: calculatedWidth,
      height: calculatedHeight,
    });
  };

  const initializeCropArea = () => {
    if (!containerDimensions.width || !imageHeight || isInitializedRef.current)
      return;
    const initialWidth = containerDimensions.width;
    const initialHeight = imageHeight;
    if (
      lastCropPositionRef.current.width &&
      lastCropPositionRef.current.height
    ) {
      originX.value = withTiming(lastCropPositionRef.current.x);
      originY.value = withTiming(lastCropPositionRef.current.y);
      width.value = withTiming(lastCropPositionRef.current.width);
      height.value = withTiming(lastCropPositionRef.current.height);
    } else {
      originX.value = withTiming(
        containerDimensions.width / 2 - initialWidth / 2
      );
      originY.value = withTiming(imageHeight / 2 - initialHeight / 2);
      width.value = withTiming(initialWidth);
      height.value = withTiming(initialHeight);
    }
    imageContainerOpacity.value = withDelay(
      300,
      withTiming(1, { duration: 300 })
    );
    isInitializedRef.current = true;
  };

  const resetState = () => {
    isInitializedRef.current = false;
    imageContainerOpacity.value = 0;
  };

  useRerenderOnAppStateChange();

  const canvasStyle: StyleProp<ViewStyle> = useMemo(
    () => ({
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }),
    [containerDimensions.width, containerDimensions.height]
  );

  useEffect(() => {
    if (!isOpen) {
      resetState();
      return;
    }
    calculateDimensions();
  }, [isOpen, ASPECT_RATIO, wrapperContainerDimensions]);

  useEffect(() => {
    if (isOpen && containerDimensions.width && containerDimensions.height) {
      requestAnimationFrame(() => {
        initializeCropArea();
      });
    }
  }, [containerDimensions, isOpen]);

  useEffect(() => {
    if (containerDimensions.width && imageHeight) {
      overlayScale.value = {
        scaleX: width.value / containerDimensions.width,
        scaleY: height.value / imageHeight,
      };
      overlayTranslate.value = {
        translateX: originX.value,
        translateY: originY.value,
      };
    }
  }, [containerDimensions.width, imageHeight]);

  return (
    <Modal
      animationType="slide"
      visible={isOpen}
      onRequestClose={() => {
        saveCropPosition();
        setIsOpen(false);
      }}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View className="bg-black flex-1">
          <View
            className="flex-1 justify-center"
            onLayout={(e) =>
              setWrapperContainerDimensions({
                width: e.nativeEvent.layout.width - 48,
                height: e.nativeEvent.layout.height,
              })
            }
          >
            <View style={{ height: imageHeight, width: screenWidth }}>
              <View style={styles.container}>
                <Animated.View
                  style={[styles.imageContainer, animatedImageContainerStyle]}
                >
                  <Image
                    source={{ uri: imageUri }}
                    style={{
                      width: containerDimensions.width,
                      height: imageHeight,
                    }}
                    resizeMode="contain"
                  />
                  <Canvas style={canvasStyle}>
                    <Mask
                      mode="luminance"
                      mask={
                        <Group>
                          <Rect
                            x={0}
                            y={0}
                            width={containerDimensions.width}
                            height={containerDimensions.height}
                            color="white"
                          />
                          <Rect
                            x={originX}
                            y={originY}
                            width={width}
                            height={height}
                            color="black"
                          />
                        </Group>
                      }
                    >
                      <Rect
                        x={0}
                        y={0}
                        width={containerDimensions.width}
                        height={containerDimensions.height}
                        color="rgba(0,0,0,0.8)"
                      />
                    </Mask>
                  </Canvas>
                  <Animated.View
                    style={[
                      styles.cropArea,
                      animatedCropAreaStyle,
                      animatedImageContainerStyle,
                      {
                        position: "absolute",
                        zIndex: 3,
                        borderColor: currentTintColor,
                      },
                    ]}
                  >
                    {(
                      [
                        "topLeft",
                        "topRight",
                        "bottomLeft",
                        "bottomRight",
                        "leftCenter",
                        "rightCenter",
                        "topCenter",
                        "bottomCenter",
                      ] as Direction[]
                    ).map((position) => (
                      <GestureDetector
                        key={position}
                        gesture={gestures.createResizeGesture(position)}
                      >
                        <View style={[styles.handler, styles[position]]}>
                          <HandlerIcon
                            direction={position}
                            handlerConfig={HANDLER_CONFIG}
                          />
                        </View>
                      </GestureDetector>
                    ))}
                    <GestureDetector gesture={gestures.dragGesture}>
                      <View style={styles.innerDragArea} />
                    </GestureDetector>
                    <View style={styles.gridLines}>
                      <View style={styles.gridLineHorizontal} />
                      <View
                        style={[styles.gridLineHorizontal, { top: "66.66%" }]}
                      />
                      <View style={styles.gridLineVertical} />
                      <View
                        style={[styles.gridLineVertical, { left: "66.66%" }]}
                      />
                    </View>
                  </Animated.View>
                </Animated.View>
              </View>
            </View>
          </View>
          <View style={styles.controls}>
            {/* <Button title="Rotate" onPress={rotateImage} /> */}
            <Button type="primary" onPress={cropImage}>
              <Button.Icon name="crop" />
            </Button>
          </View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    marginHorizontal: "auto",
    backgroundColor: "black",
  },
  imageContainer: { flex: 1, position: "relative", opacity: 0 },
  innerDragArea: {
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
    position: "absolute",
  },
  cropArea: {
    position: "absolute",
    borderColor: "white",
    borderWidth: 2,
    opacity: 0,
  },
  handler: { position: "absolute" },
  leftCenter: {
    top: "50%",
    transform: [{ translateY: "-50%" }],
    left: -HANDLER_CONFIG.strokeWidth - OUTER_TOUCH_AREA_SIZE,
    paddingLeft: OUTER_TOUCH_AREA_SIZE,
  },
  rightCenter: {
    top: "50%",
    transform: [{ translateY: "-50%" }],
    right: -HANDLER_CONFIG.strokeWidth - OUTER_TOUCH_AREA_SIZE,
    paddingRight: OUTER_TOUCH_AREA_SIZE,
  },
  topCenter: {
    left: "50%",
    transform: [{ translateX: "-50%" }],
    top: -HANDLER_CONFIG.strokeWidth - OUTER_TOUCH_AREA_SIZE,
    paddingTop: OUTER_TOUCH_AREA_SIZE,
  },
  bottomCenter: {
    left: "50%",
    transform: [{ translateX: "-50%" }],
    bottom: -HANDLER_CONFIG.strokeWidth - OUTER_TOUCH_AREA_SIZE,
    paddingBottom: OUTER_TOUCH_AREA_SIZE,
  },
  topLeft: {
    top: -HANDLER_CONFIG.strokeWidth - OUTER_TOUCH_AREA_SIZE,
    paddingTop: OUTER_TOUCH_AREA_SIZE,
    left: -HANDLER_CONFIG.strokeWidth - OUTER_TOUCH_AREA_SIZE,
    paddingLeft: OUTER_TOUCH_AREA_SIZE,
  },
  topRight: {
    top: -HANDLER_CONFIG.strokeWidth - OUTER_TOUCH_AREA_SIZE,
    paddingTop: OUTER_TOUCH_AREA_SIZE,
    right: -HANDLER_CONFIG.strokeWidth - OUTER_TOUCH_AREA_SIZE,
    paddingRight: OUTER_TOUCH_AREA_SIZE,
  },
  bottomLeft: {
    bottom: -HANDLER_CONFIG.strokeWidth - OUTER_TOUCH_AREA_SIZE,
    paddingBottom: OUTER_TOUCH_AREA_SIZE,
    left: -HANDLER_CONFIG.strokeWidth - OUTER_TOUCH_AREA_SIZE,
    paddingLeft: OUTER_TOUCH_AREA_SIZE,
  },
  bottomRight: {
    bottom: -HANDLER_CONFIG.strokeWidth - OUTER_TOUCH_AREA_SIZE,
    paddingBottom: OUTER_TOUCH_AREA_SIZE,
    right: -HANDLER_CONFIG.strokeWidth - OUTER_TOUCH_AREA_SIZE,
    paddingRight: OUTER_TOUCH_AREA_SIZE,
  },
  gridLines: { ...StyleSheet.absoluteFillObject },
  gridLineHorizontal: {
    position: "absolute",
    width: "100%",
    height: 1,
    backgroundColor: "rgba(255,255,255,0.5)",
    top: "33.33%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  gridLineVertical: {
    position: "absolute",
    width: 1,
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.5)",
    left: "33.33%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
  },
});
