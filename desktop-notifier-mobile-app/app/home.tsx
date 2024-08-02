import React, { useEffect } from "react";
import { useSession } from "../context/ctx";
import Home from "../components/Home";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const { appName } = useSession(); 
  const navigation = useNavigation();
  useEffect(() => {
    if (appName) {
      navigation.setOptions({ title: appName }); 
    }
  }, [appName, navigation]);

  return <Home />;
};

export default HomeScreen;
