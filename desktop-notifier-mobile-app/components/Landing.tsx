import React, { useContext, useState } from "react";
import {
  Alert,
  Button,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";
import { AppContext } from "../context/ctx";

// Function to generate a random project ID
const generateProjectId = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let projectId = "";
  for (let i = 0; i < 6; i++) {
    projectId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return projectId;
};

const Landing = () => {
  const { saveProject } = useContext(AppContext);
  const [appName, setAppName] = useState(""); // State to store the application name
  const [projectId, setProjectId] = useState(""); // State to store the generated project ID

  // Function to handle project ID generation
  const handleGenerate = () => {
    setProjectId(generateProjectId());
  };

  // Function to handle form submission
  const handleSubmit = () => {
    if (appName && projectId) {
      saveProject({ appName, projectId });
    } else {
      Alert.alert(
        "Error",
        "Please enter both application name and project ID."
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100 p-6">
      <View className="flex-1 justify-center items-center">
        <View className="bg-white shadow rounded-lg p-6 w-full max-w-md">
          <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">
            PROJECT FORM
          </Text>
          <Text className="text-gray-600 mb-2">Application Name:</Text>
          <Text className="text-red-500 mb-2 text-center">
            This will be displayed in this mobile app:
          </Text>
          <TextInput
            className="border border-gray-300 p-3 mb-4 rounded-lg bg-gray-50"
            placeholder="Application Name"
            value={appName}
            onChangeText={setAppName}
          />
          <Text className="text-gray-700 mb-2">Generated/Project ID:</Text>
          <TextInput
            className="border border-gray-300 p-3 mb-4 rounded-lg bg-gray-50"
            placeholder="Enter Project ID"
            value={projectId}
            onChangeText={setProjectId}
          />
          <Text className="text-gray-800 mb-4 text-sm text-center">OR</Text>
          <Button
            title="Generate Project ID"
            onPress={handleGenerate}
            color="#4CAF50" // Green color for the button
          />
          <View className="my-4" />
          <Button
            title="Submit"
            onPress={handleSubmit}
            color="#007BFF" // Blue color for the submit button
          />
          <View className="my-4 border-t border-gray-300" />
          {/* Horizontal line */}
          <Text className="text-gray-800 mt-4 text-center">
            Enter the generated ID into your Python project to link your
            application. This will enable it to receive real-time notifications
            and alerts directly on your desktop.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Landing;
