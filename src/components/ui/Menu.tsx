import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useColorScheme } from "nativewind";
import { TouchableOpacity, View } from "react-native";

export function Menu() {
  const navigation = useNavigation();
  const { colorScheme } = useColorScheme();
  const onToggleDrawer = () => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  };
  return (
    <TouchableOpacity onPress={onToggleDrawer}>
      <View className="flex-row items-center justify-center">
        <Ionicons
          name="menu"
          size={30}
          color={colorScheme === "dark" ? "white" : "black"}
        />
      </View>
    </TouchableOpacity>
  );
}
