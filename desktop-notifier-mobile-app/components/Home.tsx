import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { useSession } from "../context/ctx";
import { NativeWindStyleSheet } from "nativewind";

NativeWindStyleSheet.setOutput({
  default: "native",
});

const HomeScreen = () => {
  const { clearSession } = useSession();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({ title: false, message: false });

  const validateFields = () => {
    const newErrors = {
      title: title.trim() === "",
      message: message.trim() === "",
    };
    setErrors(newErrors);
    return !newErrors.title && !newErrors.message;
  };

  const handleSubmit = () => {
    if (validateFields()) {
      // Handle form submission logic here
      console.log("Title:", title);
      console.log("Message:", message);
      Alert.alert("Form Submitted", `Title: ${title}\nMessage: ${message}`);
    } else {
      Alert.alert("Validation Error", "All fields are required.");
    }
  };

  return (
    <View className="flex-1 bg-gray-200 justify-center items-center p-6">
      <View className="bg-white shadow rounded-lg p-6 w-full max-w-md h-100">
        <Text className="text-xl font-bold mb-4 text-center">Submit Your Info</Text>
        <TextInput
          className={`h-10 border p-2 rounded ${errors.title ? 'border-red-500' : 'border-gray-400'} mb-4`}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
        {errors.title && <Text className="text-red-500 mb-2">Title is required.</Text>}
        <TextInput
          className={`h-20 border p-2 rounded ${errors.message ? 'border-red-500' : 'border-gray-400'} mb-4`}
          placeholder="Message"
          value={message}
          onChangeText={setMessage}
          multiline
        />
        {errors.message && <Text className="text-red-500 mb-2">Message is required.</Text>}
        <TouchableOpacity
          className="bg-blue-500 p-3 rounded mb-4"
          onPress={handleSubmit}
        >
          <Text className="text-white text-center font-bold">Submit</Text>
        </TouchableOpacity>
      </View>
      <View className="absolute bottom-5  right-5">
        <TouchableOpacity
          className="bg-red-500 p-3 rounded"
          onPress={clearSession}
        >
          <Text className="text-white text-center font-bold">Clear Session</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;
