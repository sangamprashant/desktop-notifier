import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { NativeWindStyleSheet } from "nativewind";
import React, { useContext } from "react";
import { AppContext, SessionProvider } from "../context/ctx";

NativeWindStyleSheet.setOutput({
  default: "native",
});

const RootLayout = () => {
  const { appName } = useContext(AppContext);

  return (
    <SessionProvider>
      <Stack
        screenOptions={{
          headerShown: true,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="home"
          options={{
            title: appName || "Home Screen",
          }}
        />
      </Stack>
    </SessionProvider>
  );
};

export default RootLayout;
