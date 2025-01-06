import React, { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PopularServices from "./PopularServices";

const HomeScreen = (props: any) => {
  const { navigation } = props;
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const value = await AsyncStorage.getItem("token");
        console.log("Value:", value);
        setData(value);
      } catch (error) {
        console.log("Error reading AsyncStorage:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      
      <PopularServices />
    </View>
  );
};

export default HomeScreen;
