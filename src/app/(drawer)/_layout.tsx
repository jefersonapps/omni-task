import React from "react";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme } from "nativewind";
import { CustomDrawerContent } from "../../components/drawer/CustomDrawerContent";
import { useTheme } from "@/contexts/ThemeProvider";

export default function Layout() {
  const { colorScheme } = useColorScheme();
  const { colors } = useTheme();
  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer
          drawerContent={(props) => <CustomDrawerContent {...props} />}
          screenOptions={{
            headerShown: false,
            drawerStyle: {
              width: "70%",
              backgroundColor: colors[colorScheme || "dark"].background,
            },
          }}
        ></Drawer>
      </GestureHandlerRootView>
    </>
  );
}
