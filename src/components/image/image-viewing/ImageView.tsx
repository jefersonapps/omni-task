import {
  Modal,
  View,
  Dimensions,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useImageDimensions } from "../image-cropper/hooks/useImageDimensions";
import { getAspectRatio } from "@/utils/functions";
import { Button } from "@/components/ui/Button";
import { useColorScheme } from "nativewind";
import { AntDesign } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

interface ImageViewerProps {
  image: { uri: string };
  imageIndex: number;
  visible: boolean;
  onRequestClose: () => void;
}

const MAX_SCALE = 10;
const MIN_SCALE = 1;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const rubberBand = (value: number, limit: number): number => {
  "worklet";
  if (Math.abs(value) <= limit) {
    return value;
  } else {
    const overshoot = Math.abs(value) - limit;
    const resistance = 0.35;
    return value < 0
      ? -(limit + overshoot * resistance)
      : limit + overshoot * resistance;
  }
};

export function ImageView({
  image,
  imageIndex,
  visible,
  onRequestClose,
}: ImageViewerProps) {
  const { colorScheme } = useColorScheme();
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);

  const imageDimensions = useImageDimensions(image.uri);

  const isImageDimensionsReady = Boolean(
    imageDimensions.width && imageDimensions.height
  );

  const ASPECT_RATIO = isImageDimensionsReady
    ? getAspectRatio(imageDimensions.width, imageDimensions.height)
    : 1;

  const imageHeight = isImageDimensionsReady
    ? SCREEN_WIDTH / ASPECT_RATIO
    : SCREEN_HEIGHT;

  const resetAnimation = () => {
    "worklet";
    scale.value = withSpring(1, {
      damping: 15,
    });
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    savedScale.value = 1;
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
  };

  const pinchGesture = Gesture.Pinch()
    .onStart((e) => {
      focalX.value = e.focalX;
      focalY.value = e.focalY;
    })
    .onUpdate((e) => {
      scale.value = Math.max(
        MIN_SCALE,
        Math.min(savedScale.value * e.scale, MAX_SCALE)
      );
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const panGesture = Gesture.Pan()
    .onStart(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    })
    .onUpdate((e) => {
      if (scale.value > 1) {
        const maxTranslateX = (SCREEN_WIDTH * (scale.value - 1)) / 2;
        const maxTranslateY = (imageHeight * (scale.value - 1)) / 2;

        const rawTranslateX = savedTranslateX.value + e.translationX;
        const rawTranslateY = savedTranslateY.value + e.translationY;

        translateX.value = rubberBand(rawTranslateX, maxTranslateX);
        translateY.value = rubberBand(rawTranslateY, maxTranslateY);
      }
    })
    .onEnd(() => {
      if (scale.value > 1) {
        const maxTranslateX = (SCREEN_WIDTH * (scale.value - 1)) / 2;
        const maxTranslateY = (imageHeight * (scale.value - 1)) / 2;

        if (translateX.value > maxTranslateX) {
          translateX.value = withSpring(maxTranslateX);
        } else if (translateX.value < -maxTranslateX) {
          translateX.value = withSpring(-maxTranslateX);
        }
        if (translateY.value > maxTranslateY) {
          translateY.value = withSpring(maxTranslateY);
        } else if (translateY.value < -maxTranslateY) {
          translateY.value = withSpring(-maxTranslateY);
        }
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onStart((e) => {
      if (scale.value !== 1) {
        resetAnimation();
      } else {
        scale.value = withSpring(2);

        const offsetX = (e.x - SCREEN_WIDTH / 2) * 1.5;
        const offsetY = (e.y - SCREEN_HEIGHT / 2) * 1.5;

        translateX.value = withSpring(-offsetX);
        translateY.value = withSpring(-offsetY);

        savedScale.value = 2;
        savedTranslateX.value = translateX.value;
        savedTranslateY.value = translateY.value;
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: savedScale.value > 1 ? withTiming(-100) : withTiming(0) },
    ],
  }));

  const gestures = Gesture.Simultaneous(
    pinchGesture,
    Gesture.Race(doubleTapGesture, panGesture)
  );

  const handleClose = () => {
    resetAnimation();
    onRequestClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      onRequestClose={handleClose}
      statusBarTranslucent
      animationType="slide"
    >
      <GestureHandlerRootView
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.9)" }}
      >
        <BlurView
          className="absolute top-0 left-0 right-0 bottom-0"
          intensity={50}
          experimentalBlurMethod="dimezisBlurView"
        />
        <View
          className="flex-1 justify-center items-center"
          style={{
            marginTop: StatusBar.currentHeight,
          }}
        >
          {isImageDimensionsReady ? (
            <GestureDetector gesture={gestures}>
              <Animated.View className="size-full justify-center items-center">
                <Animated.Image
                  className="size-full"
                  style={animatedStyle}
                  source={image}
                  resizeMode="contain"
                />
              </Animated.View>
            </GestureDetector>
          ) : (
            <ActivityIndicator color="#fff" size="large" />
          )}

          <Animated.View
            className="absolute right-2 top-2"
            style={animatedButtonStyle}
          >
            <Button
              type="primary"
              variant="mediumCircle"
              filled
              onPress={handleClose}
            >
              <Button.Icon
                customIcon={
                  <AntDesign
                    name="close"
                    size={24}
                    color={colorScheme === "dark" ? "white" : "black"}
                  />
                }
              />
            </Button>
          </Animated.View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}
