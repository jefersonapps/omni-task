import { useRef, useState } from "react";
import {
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";

import { images } from "@/components/passwords/utils/logos";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { router } from "expo-router";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/contexts/ThemeProvider";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { capitalizeFirstLetter } from "@/utils/functions";
import { AddMediaButton } from "@/components/ui/AddMediaButton";

export default function NewPassword() {
  const { currentTintColor } = useTheme();
  const [selectedLogo, setSelectedLogo] = useState<string>("");
  const [serviceName, setServiceName] = useState<string>("");
  const [userIdentifier, setUserIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const userIdentifierRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const handleSavePassword = () => {
    console.log({ selectedLogo, serviceName, password });
    router.back();
  };

  const handleSelectLogo = (key: string) => {
    setSelectedLogo(key);
    setServiceName(capitalizeFirstLetter(key));
  };

  const similarLogos = Object.keys(images).filter((key) =>
    key.toLowerCase().includes(serviceName.toLowerCase())
  );

  return (
    <ThemedView className="flex-1 px-4">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="py-4"
        contentContainerClassName="gap-4"
      >
        <SectionContainer>
          <ThemedText type="subtitle" numberOfLines={1}>
            Selecione um Logo
          </ThemedText>

          <ScrollView
            horizontal
            className="flex-row h-20 w-full"
            contentContainerClassName="items-center gap-4"
            showsHorizontalScrollIndicator={false}
          >
            {[...similarLogos].map((key) => {
              const LogoComponent = images[key as keyof typeof images];
              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => handleSelectLogo(key)}
                  style={{
                    borderColor:
                      selectedLogo === key ? currentTintColor : "transparent",
                  }}
                  className="border-2 items-center justify-center border-transparent p-1 rounded-lg bg-zinc-200 dark:bg-white"
                >
                  <LogoComponent width={50} height={50} />
                </TouchableOpacity>
              );
            })}

            <AddMediaButton
              iconName="add-circle"
              onPress={() => {}}
              className="w-[63px]"
            />
          </ScrollView>
        </SectionContainer>

        <KeyboardAvoidingView className="gap-4 pb-16">
          <Input
            placeholder="Nome do Serviço"
            value={serviceName}
            onChangeText={setServiceName}
            autoComplete="off"
            importantForAutofill="no"
            returnKeyType="next"
            onSubmitEditing={() =>
              setTimeout(() => userIdentifierRef.current?.focus(), 100)
            }
          />
          <Input
            placeholder="E-mail ou usuário"
            ref={userIdentifierRef}
            value={userIdentifier}
            onChangeText={setUserIdentifier}
            returnKeyType="next"
            onSubmitEditing={() =>
              setTimeout(() => passwordRef.current?.focus(), 100)
            }
          />
          <Input
            placeholder="Senha"
            value={password}
            ref={passwordRef}
            onChangeText={setPassword}
            secureTextEntry
            onSubmitEditing={handleSavePassword}
          />
          <Button type="primary" onPress={handleSavePassword}>
            <Button.Text type="primarySemiBold">Salvar Senha</Button.Text>
          </Button>
        </KeyboardAvoidingView>
      </ScrollView>
    </ThemedView>
  );
}
