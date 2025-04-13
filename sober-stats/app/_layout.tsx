import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitle: "Sober Tracker",
        headerStyle: { backgroundColor: "#fff" },
        headerTitleStyle: { fontWeight: "bold", fontSize: 24 },
        // TODO: Add headerRight component for settings
      }}
    />
  );
}
