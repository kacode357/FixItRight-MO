import React, { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = (props: any) => {
  const { navigation } = props;
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const value = await AsyncStorage.getItem("token");
        setData(value);
      } catch (error) {
        console.log("Error reading AsyncStorage:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>HomeScreen</Text>
      <Text style={{ marginBottom: 20 }}>
        Stored Data: {data ? data : "No data found"}
      </Text>
      <Button
        title="View Details"
        onPress={() => navigation.navigate("Detail")}
      />
    </View>
  );
};

export default HomeScreen;
