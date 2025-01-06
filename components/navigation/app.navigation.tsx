import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../review/Home/home";
import DetailScreen from "../review/detail";
import LoginScreen from "../review/Login";
import RegisterScreen from "../review/Register";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import AllServices from "../review/Home/AllServices";

// Stack Navigator cho phần Home
const HomeLayout = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Detail" component={DetailScreen} />
      <Stack.Screen name="AllServices" component={AllServices} />
    </Stack.Navigator>
  );
};

// Tab Navigation
const TabNavigation = () => {
    const navigation: NavigationProp<RootStackParamList> = useNavigation(); // Sử dụng useNavigation hook
    const Tab = createBottomTabNavigator();
  
    const handleLogout = async () => {
      await AsyncStorage.clear();
      navigation.navigate("Login"); // Chuyển về màn hình Login
    };
  
    return (
      <Tab.Navigator screenOptions={{ headerShown: false }} initialRouteName="HomeTab">
        <Tab.Screen
          name="Home1"
          component={HomeLayout}
          options={{ title: "Home" }}
        />
        <Tab.Screen
          name="DetailTab1"
          component={DetailScreen}
          options={{ title: "Detail" }}
        />
        <Tab.Screen
          name="Logout"
          options={{ title: "Logout" }}
        >
          {() => {
         
            React.useEffect(() => {
              handleLogout();
            }, []);
  
            return null; 
          }}
        </Tab.Screen>
      </Tab.Navigator>
    );
  };
  

// Root Stack để quản lý Login, Register và Tab Navigation
const AppNavigation = () => {
  const RootStack = createNativeStackNavigator();

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {/* Các màn hình Login và Register */}
      <RootStack.Screen name="Login" component={LoginScreen} />
      <RootStack.Screen name="Register" component={RegisterScreen} />

      {/* Tab Navigation */}
      <RootStack.Screen name="MainApp" component={TabNavigation} />
    </RootStack.Navigator>
  );
};

export default AppNavigation;
