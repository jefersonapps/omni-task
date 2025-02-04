import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

export type Direction =
  | "topLeft"
  | "topRight"
  | "bottomRight"
  | "bottomLeft"
  | "leftCenter"
  | "rightCenter"
  | "topCenter"
  | "bottomCenter";

interface HandlerConfigProps {
  size: number;
  strokeWidth: number;
  radius: number;
}

interface HandlerIconProps {
  direction: Direction;
  handlerConfig: HandlerConfigProps;
}
export function HandlerIcon({ direction, handlerConfig }: HandlerIconProps) {
  const getPath = () => {
    const sw = handlerConfig.strokeWidth;
    const hs = sw / 2; // half stroke

    // Linhas centrais
    if (direction === "leftCenter") {
      return `M ${hs} ${hs} V ${handlerConfig.size - hs}`;
    }
    if (direction === "rightCenter") {
      return `M ${handlerConfig.size - hs} ${hs} V ${handlerConfig.size - hs}`;
    }
    if (direction === "topCenter") {
      return `M ${hs} ${hs} H ${handlerConfig.size - hs}`;
    }
    if (direction === "bottomCenter") {
      return `M ${hs} ${handlerConfig.size - hs} H ${handlerConfig.size - hs}`;
    }

    // Cantos em L
    return `M ${hs},${hs} 
            H ${handlerConfig.size - handlerConfig.radius} 
            A ${handlerConfig.radius} ${handlerConfig.radius} 0 0 1 ${
      handlerConfig.size - hs
    },${handlerConfig.radius + hs}
            V ${handlerConfig.size - hs}`;
  };

  // Rotação para os cantos
  const rotate =
    {
      topLeft: -90,
      topRight: 0,
      bottomRight: 90,
      bottomLeft: -180,
      leftCenter: 0,
      rightCenter: 0,
      topCenter: 0,
      bottomCenter: 0,
    }[direction] || 0;

  return (
    <View style={{ width: handlerConfig.size, height: handlerConfig.size }}>
      <Svg
        height="100%"
        width="100%"
        viewBox={`0 0 ${handlerConfig.size} ${handlerConfig.size}`}
      >
        <Path
          d={getPath()}
          stroke="white"
          strokeWidth={handlerConfig.strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          transform={
            direction.endsWith("t")
              ? `rotate(${rotate} ${handlerConfig.size / 2} ${
                  handlerConfig.size / 2
                })`
              : undefined
          }
        />
      </Svg>
    </View>
  );
}
