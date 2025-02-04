import { useNavigation } from "expo-router";
import { useEffect } from "react";

export function usePreventNavigation(isPending: boolean) {
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (isPending) {
        e.preventDefault();
      }
    });
    return unsubscribe;
  }, [isPending, navigation]);
}
