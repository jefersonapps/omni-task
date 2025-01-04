import { useEffect, useMemo, useState } from "react";
import { Keyboard, KeyboardEvent } from "react-native";

export const useKeyboard = () => {
  const [currentKeyboardHeight, setCurrentKeyboardHeight] = useState(0);

  useEffect(() => {
    function onKeyboardDidShow(e: KeyboardEvent) {
      setCurrentKeyboardHeight(e.endCoordinates.height);
    }

    function onKeyboardDidHide() {
      setCurrentKeyboardHeight(0);
    }

    const showSubscription = Keyboard.addListener(
      "keyboardDidShow",
      onKeyboardDidShow
    );
    const hideSubscription = Keyboard.addListener(
      "keyboardDidHide",
      onKeyboardDidHide
    );
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const keyboardHeight = useMemo(() => {
    return currentKeyboardHeight + 32;
  }, [currentKeyboardHeight]);

  return { keyboardHeight };
};
