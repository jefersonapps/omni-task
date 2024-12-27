import { DrawerItem } from "@react-navigation/drawer";
import { Href, router, usePathname } from "expo-router";
import { useColorScheme } from "nativewind";
import { cloneElement, isValidElement } from "react";
import { useTheme } from "../../contexts/ThemeProvider";

export function CustomDrawerItem({
  href,
  icon,
  label,
}: {
  href: Href;
  icon: React.ReactElement<{ size?: number; color?: string }>;
  label: string;
}) {
  const { colorScheme } = useColorScheme();
  const pathname = usePathname();
  const { currentTintColor, colors } = useTheme();

  const drawerItemColors = {
    backgroundColor: currentTintColor + "15",
    enableColor: currentTintColor,
    color: colors[colorScheme || "dark"].icon,
  };

  return (
    <DrawerItem
      icon={({ color, size }) =>
        isValidElement(icon)
          ? cloneElement(icon, {
              size,
              color:
                pathname == href
                  ? drawerItemColors.enableColor
                  : drawerItemColors.color,
            })
          : null
      }
      label={label}
      pressColor={
        colorScheme === "dark"
          ? colors.light.background + "50"
          : colors.light.background + "15"
      }
      labelStyle={[
        {
          color:
            pathname == href
              ? drawerItemColors.enableColor
              : drawerItemColors.color,
          fontSize: 16,
        },
      ]}
      style={{
        backgroundColor:
          pathname == href ? drawerItemColors.backgroundColor : "transparent",
        borderRadius: 16,
        marginBottom: 8,
      }}
      onPress={() => {
        router.push(href);
      }}
    />
  );
}
