import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, Alert, ScrollView } from "react-native";
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
  const [submittedData, setSubmittedData] = useState(null);

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
      setSubmittedData({ title, message });
      Alert.alert("Form Submitted", `Title: ${title}\nMessage: ${message}`);
    } else {
      Alert.alert("Validation Error", "Please fill out all required fields.");
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-gray-100 p-6">
      <View className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md mx-auto">
        <Text className="text-2xl font-semibold mb-6 text-center text-gray-800">Submit Your Information</Text>
        <Text className="text-gray-600 mb-2">Title</Text>
        <TextInput
          className={`h-12 border p-3 rounded ${errors.title ? 'border-red-600' : 'border-gray-300'} mb-4`}
          placeholder="Enter the title"
          value={title}
          onChangeText={setTitle}
        />
        {errors.title && <Text className="text-red-600 mb-2">Title is required.</Text>}
        <Text className="text-gray-600 mb-2">Message</Text>
        <TextInput
          className={`h-24 border p-3 rounded ${errors.message ? 'border-red-600' : 'border-gray-300'} mb-6`}
          placeholder="Enter your message"
          value={message}
          onChangeText={setMessage}
          multiline
        />
        {errors.message && <Text className="text-red-600 mb-4">Message is required.</Text>}
        
        <Text className="text-gray-700 mb-4">
          The title and message you enter will be used to create a notification that will be sent to your desktop. 
          Ensure that you provide relevant information to get the desired notification.
        </Text>
        
        <TouchableOpacity
          className="bg-blue-600 p-4 rounded mb-6"
          onPress={handleSubmit}
        >
          <Text className="text-white text-center text-lg font-semibold">Submit</Text>
        </TouchableOpacity>

        {submittedData && (
          <View className="bg-gray-50 border border-gray-300 p-4 rounded-lg">
            <Text className="text-xl font-semibold mb-2 text-gray-800">Submitted Data</Text>
            <Text className="text-gray-700 mb-1"><Text className="font-bold">Title:</Text> {submittedData.title}</Text>
            <Text className="text-gray-700"><Text className="font-bold">Message:</Text> {submittedData.message}</Text>
          </View>
        )}
      </View>
      <View className="absolute bottom-5 right-5">
        <TouchableOpacity
          className="bg-red-600 p-4 rounded"
          onPress={clearSession}
        >
          <Text className="text-white text-center text-lg font-semibold">Clear Session</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
