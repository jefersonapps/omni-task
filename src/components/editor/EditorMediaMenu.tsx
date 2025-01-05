import { useState, useCallback } from "react";
import { TouchableOpacity, Text, TouchableOpacityProps } from "react-native";
import { Ionicons, Octicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  withDelay,
  runOnJS,
} from "react-native-reanimated";
import { useTheme } from "@/contexts/ThemeProvider";
import { Button } from "../ui/Button";

interface EditorMediaMenuProps {
  addMedia: () => Promise<void>;
  pickAudio: () => Promise<void>;
}

export function EditorMediaMenu({ addMedia, pickAudio }: EditorMediaMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const rotation = useSharedValue(0);

  const { currentTintColor } = useTheme();

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${rotation.value}deg`,
      },
    ],
  }));

  const animatedMenuStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scaleX: withTiming(menuOpen ? 1 : 0, {
          duration: 300,
          easing: Easing.out(Easing.quad),
        }),
      },
      {
        scaleY: withTiming(menuOpen ? 1 : 0, {
          duration: 300,
          easing: Easing.out(Easing.quad),
        }),
      },
    ],
    opacity: withTiming(menuOpen ? 1 : 0, {
      duration: 300,
      easing: Easing.out(Easing.quad),
    }),
  }));

  const handleRotateIcon = useCallback(
    (newMenuState: boolean, delay: number = 0) => {
      rotation.value = withDelay(
        delay,
        withTiming(newMenuState ? 45 : 0, {
          duration: 300,
          easing: Easing.elastic(1),
        })
      );
    },
    [rotation]
  );

  const toggleMenu = () => {
    setMenuOpen((prev) => {
      const newState = !prev;
      runOnJS(handleRotateIcon)(newState);
      return newState;
    });
  };

  const handlePickMedia = async () => {
    await addMedia();
    await new Promise((resolve) => setTimeout(resolve, 300));
    setMenuOpen(false);
    handleRotateIcon(false, 300);
  };

  const handlePickAudio = async () => {
    await pickAudio();
    await new Promise((resolve) => setTimeout(resolve, 300));
    setMenuOpen(false);
    handleRotateIcon(false, 300);
  };

  const menuTopPosition = 65;

  return (
    <>
      <Button type="primary" variant="rounded" filled onPress={toggleMenu}>
        <Button.Icon
          customIcon={
            <Animated.View style={animatedIconStyle}>
              <Octicons name="plus" size={24} color={currentTintColor} />
            </Animated.View>
          }
        />
      </Button>

      <Animated.View
        pointerEvents={menuOpen ? "auto" : "none"}
        style={[
          animatedMenuStyle,
          { top: menuTopPosition, transformOrigin: "top right" },
        ]}
        className="absolute right-0 bg-white rounded-lg overflow-hidden z-50"
      >
        <MenuItem
          iconName="image"
          label="Foto | Vídeo"
          onPressIn={handlePickMedia}
          disabled={!menuOpen}
        />

        <MenuItem
          iconName="musical-notes"
          label="Áudio"
          onPressIn={handlePickAudio}
          disabled={!menuOpen}
        />
      </Animated.View>
    </>
  );
}

interface EditorToolbarProps extends TouchableOpacityProps {
  iconName: keyof typeof Ionicons.glyphMap;
  label: string;
}

function MenuItem({ iconName, label, ...rest }: EditorToolbarProps) {
  return (
    <TouchableOpacity
      {...rest}
      activeOpacity={0.6}
      className="flex-row items-center p-2.5 gap-2"
    >
      <Ionicons name={iconName} size={24} color="black" />
      <Text className="font-medium text-black">{label}</Text>
    </TouchableOpacity>
  );
}
