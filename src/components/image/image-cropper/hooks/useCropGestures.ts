import { MediaDimensions } from "@/contexts/MediaContext";
import { Gesture } from "react-native-gesture-handler";
import { SharedValue, useSharedValue } from "react-native-reanimated";

interface GestureValues {
  originX: SharedValue<number>;
  originY: SharedValue<number>;
  width: SharedValue<number>;
  height: SharedValue<number>;
  savedX: SharedValue<number>;
  savedY: SharedValue<number>;
  savedWidth: SharedValue<number>;
  savedHeight: SharedValue<number>;
  startX: SharedValue<number>;
  startY: SharedValue<number>;
}

export const useCropGestures = (
  values: GestureValues,
  constraints: {
    containerDimensions: MediaDimensions;
    imageHeight: number;
    MIN_SIZE: number;
    MAX_WIDTH: number;
    MAX_HEIGHT: number;
  }
) => {
  const { MIN_SIZE, MAX_WIDTH, MAX_HEIGHT, imageHeight } = constraints;

  const scale = useSharedValue(1);
  const {
    savedX,
    savedY,
    savedWidth,
    savedHeight,
    startX,
    startY,
    height,
    width,
    originX,
    originY,
  } = values;

  const clamp = (value: number, min: number, max: number) => {
    "worklet";
    return Math.min(Math.max(value, min), max);
  };

  const dragGesture = Gesture.Pan()
    .onStart(() => {
      // Atualiza os valores salvos com a posição atual antes de iniciar o arrasto
      savedX.value = originX.value;
      savedY.value = originY.value;
    })
    .onUpdate((event) => {
      // Obtem o fator de escala atual (valor compartilhado)
      const factor = scale.value; // se não houver escala, factor será 1

      // Divide os deltas pela escala para compensar
      const adjusted = {
        x: event.translationX / factor,
        y: event.translationY / factor,
      };

      const newX = clamp(
        savedX.value + adjusted.x, // Usa o valor salvo atualizado
        0,
        constraints.containerDimensions.width - width.value
      );

      const newY = clamp(
        savedY.value + adjusted.y, // Usa o valor salvo atualizado
        0,
        constraints.imageHeight - height.value
      );

      originX.value = newX;
      originY.value = newY;
    });

  // Gesto de resize ajustado com a escala
  const createResizeGesture = (corner: string) =>
    Gesture.Pan()
      .onStart((event) => {
        savedX.value = originX.value;
        savedY.value = originY.value;
        savedWidth.value = width.value;
        savedHeight.value = height.value;
        startX.value = event.absoluteX;
        startY.value = event.absoluteY;
      })
      .onUpdate((event) => {
        let newWidth = savedWidth.value;
        let newHeight = savedHeight.value;
        let newX = savedX.value;
        let newY = savedY.value;

        // Obtem o fator de escala e "desescala" o delta
        const factor = scale.value;
        const delta = {
          x: (event.absoluteX - startX.value) / factor,
          y: (event.absoluteY - startY.value) / factor,
        };

        switch (corner) {
          case "topLeft": {
            newWidth = savedWidth.value - delta.x;
            newHeight = savedHeight.value - delta.y;

            // Limites para newWidth e newX (esquerda e MIN_SIZE)
            if (savedX.value + delta.x < 0) {
              newWidth = savedWidth.value + savedX.value;
              newX = 0;
            } else if (newWidth < MIN_SIZE) {
              newWidth = MIN_SIZE;
              newX = savedX.value + (savedWidth.value - MIN_SIZE);
            } else {
              newX = savedX.value + delta.x;
            }

            // Limites para newHeight (topo e MIN_SIZE)
            if (savedY.value + delta.y < 0) {
              newHeight = savedHeight.value + savedY.value;
              newY = 0;
            } else if (newHeight < MIN_SIZE) {
              newHeight = MIN_SIZE;
              newY = savedY.value + (savedHeight.value - MIN_SIZE);
            } else {
              newY = savedY.value + delta.y;
            }

            break;
          }

          case "topRight": {
            newWidth = savedWidth.value + delta.x;
            newHeight = savedHeight.value - delta.y;

            // Limite para newWidth (direita e MIN_SIZE)
            if (
              savedX.value + newWidth >
              constraints.containerDimensions.width
            ) {
              newWidth = constraints.containerDimensions.width - savedX.value;
            } else if (newWidth < MIN_SIZE) {
              newWidth = MIN_SIZE;
            }

            // Limites para newHeight (topo e MIN_SIZE)
            if (savedY.value + delta.y < 0) {
              newHeight = savedHeight.value + savedY.value;
              newY = 0;
            } else if (newHeight < MIN_SIZE) {
              newHeight = MIN_SIZE;
              newY = savedY.value + (savedHeight.value - MIN_SIZE);
            } else {
              newY = savedY.value + delta.y;
            }

            break;
          }

          case "bottomLeft":
          case "bottomRight": {
            newWidth =
              corner === "bottomLeft"
                ? savedWidth.value - delta.x
                : savedWidth.value + delta.x;

            // Limites para newWidth (esquerda, direita e MIN_SIZE)
            if (corner === "bottomLeft" && savedX.value + delta.x < 0) {
              newWidth = savedWidth.value + savedX.value;
              newX = 0;
            } else if (
              corner === "bottomRight" &&
              savedX.value + newWidth > constraints.containerDimensions.width
            ) {
              newWidth = constraints.containerDimensions.width - savedX.value;
            } else if (newWidth < MIN_SIZE) {
              newWidth = MIN_SIZE;
              newX =
                corner === "bottomLeft"
                  ? savedX.value + (savedWidth.value - MIN_SIZE)
                  : savedX.value;
            } else {
              newX =
                corner === "bottomLeft" ? savedX.value + delta.x : savedX.value;
            }

            // Limites para newHeight (inferior e MIN_SIZE)
            if (savedY.value + savedHeight.value + delta.y > imageHeight) {
              newHeight = imageHeight - savedY.value;
            } else if (newHeight < MIN_SIZE) {
              newHeight = MIN_SIZE;
            } else {
              newHeight = savedHeight.value + delta.y;
            }

            newY = savedY.value;
            break;
          }
          case "leftCenter": {
            newX = savedX.value + delta.x;
            newWidth = savedWidth.value - delta.x;

            // Limites laterais
            if (newX < 0) {
              newWidth = savedWidth.value + savedX.value;
              newX = 0;
            }

            // Limite mínimo de largura
            if (newWidth < MIN_SIZE) {
              newWidth = MIN_SIZE;
              newX = savedX.value + savedWidth.value - MIN_SIZE;
            }

            // Limite máximo de largura
            if (newX + newWidth > constraints.containerDimensions.width) {
              newWidth = constraints.containerDimensions.width - newX;
            }

            break;
          }
          case "rightCenter": {
            newWidth = savedWidth.value + delta.x;

            // Limite direito
            if (
              savedX.value + newWidth >
              constraints.containerDimensions.width
            ) {
              newWidth = constraints.containerDimensions.width - savedX.value;
            }

            // Limite mínimo de largura
            if (newWidth < MIN_SIZE) {
              newWidth = MIN_SIZE;
            }

            break;
          }
          case "topCenter": {
            newY = savedY.value + delta.y;
            newHeight = savedHeight.value - delta.y;

            // Limite superior
            if (newY < 0) {
              newHeight = savedHeight.value + savedY.value;
              newY = 0;
            }

            // Limite mínimo de altura
            if (newHeight < MIN_SIZE) {
              newHeight = MIN_SIZE;
              newY = savedY.value + savedHeight.value - MIN_SIZE;
            }

            break;
          }
          case "bottomCenter": {
            newHeight = savedHeight.value + delta.y;

            // Limite inferior
            if (savedY.value + newHeight > imageHeight) {
              newHeight = imageHeight - savedY.value;
            }

            // Limite mínimo de altura
            if (newHeight < MIN_SIZE) {
              newHeight = MIN_SIZE;
            }

            break;
          }
        }

        newWidth = clamp(newWidth, MIN_SIZE, MAX_WIDTH);
        newHeight = clamp(newHeight, MIN_SIZE, MAX_HEIGHT);

        newX = clamp(newX, 0, constraints.containerDimensions.width - newWidth);
        newY = clamp(newY, 0, imageHeight - newHeight);

        width.value = newWidth;
        height.value = newHeight;
        originX.value = newX;
        originY.value = newY;
      });
  return {
    dragGesture,
    createResizeGesture: (corner: string) => createResizeGesture(corner),
  };
};
