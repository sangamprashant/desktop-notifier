import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSession } from "../context/ctx";

const HomeScreen = () => {
  const { projectId, clearSession } = useSession();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({ title: false, message: false });
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(20);

  // Handle response display timeout
  useEffect(() => {
    let timer;
    if (responseData) {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setResponseData(null); // Clear response data after timeout
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000); // Update every second
    }

    return () => clearInterval(timer); // Cleanup interval on unmount
  }, [responseData]);

  const validateFields = () => {
    const newErrors = {
      title: title.trim() === "",
      message: message.trim() === "",
    };
    setErrors(newErrors);
    return !newErrors.title && !newErrors.message;
  };

  const handleSubmit = async () => {
    if (validateFields()) {
      try {
        setLoading(true);
        const response = await fetch(
          "https://desktop-notifier.onrender.com/api/notify",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, message, projectId }),
          }
        );

        if (response) {
          setResponseData(await response.text());
        } else {
          Alert.alert(
            "Submission Error",
            "There was an error submitting the form."
          );
        }
      } catch (error) {
        Alert.alert(
          "Submission Error",
          "There was an error submitting the form."
        );
        console.error(error);
      } finally {
        setLoading(false);
        setTitle("");
        setMessage("");
      }
    } else {
      Alert.alert("Validation Error", "Please fill out all required fields.");
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-gray-100 p-6 flex-1"
    >
      <View className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md mx-auto">
        <Text className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Submit Your Information
        </Text>
        <Text className="text-gray-600 mb-2">Title</Text>
        <TextInput
          className={`h-12 border p-3 rounded ${
            errors.title ? "border-red-600" : "border-gray-300"
          } mb-4`}
          placeholder="Enter the title"
          value={title}
          onChangeText={setTitle}
        />
        {errors.title && (
          <Text className="text-red-600 mb-2">Title is required.</Text>
        )}
        <Text className="text-gray-600 mb-2">Message</Text>
        <TextInput
          className={`h-24 border p-3 rounded ${
            errors.message ? "border-red-600" : "border-gray-300"
          } mb-6`}
          placeholder="Enter your message"
          value={message}
          onChangeText={setMessage}
          multiline
        />
        {errors.message && (
          <Text className="text-red-600 mb-4">Message is required.</Text>
        )}

        <Text className="text-gray-700 mb-4">
          The title and message you enter will be used to create a notification
          that will be sent to your desktop. Ensure that you provide relevant
          information to get the desired notification.
        </Text>

        <TouchableOpacity
          className="bg-blue-600 p-4 rounded mb-6"
          onPress={handleSubmit}
          disabled={loading}
        >
          <View className="flex flex-row items-center justify-center">
            {loading && (
              <ActivityIndicator
                size="large"
                color="#ffffff"
                className="mr-2"
              />
            )}
            <Text className="text-white text-center text-lg font-semibold">
              {loading ? "Sending" : "Submit"}
            </Text>
          </View>
        </TouchableOpacity>

        {responseData && (
          <View className="bg-gray-50 border border-gray-300 p-4 rounded-lg">
            <Text className="text-xl font-semibold mb-2 text-gray-800">
              Response
            </Text>
            <Text className="text-gray-700 mb-1">{responseData}</Text>
            <Text className="text-gray-500 mt-2">
              This message will disappear in {timeRemaining} seconds.
            </Text>
          </View>
        )}
      </View>
      <View className="absolute bottom-2 right-2">
        <TouchableOpacity
          className="bg-red-600 p-4 rounded"
          onPress={clearSession}
        >
          <Text className="text-white text-center text-lg font-semibold">
            Clear Session
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
