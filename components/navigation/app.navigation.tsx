import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationProp, useNavigation } from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";

import TabHome from "../review/TabNavigation/TabHome";
import TabProfile from "../review/TabNavigation/TabProfile";

import DetailScreen from "../review/detail";
import LoginScreen from "../review/Login";
import RegisterScreen from "../review/Register";
import AllServices from "../review/Home/AllServices";
import YourProfile from "../review/Profile/YourProfile";
import EditScreen from "../review/Profile/EditScreen";
import CategoryDetails from "../review/Home/CategoryDetails";
import ServiceDetails from "../review/Home/ServiceDetails";
import PaymentScreen from "../review/Home/PaymentScreen";
import PaymentWebView from "../review/Home/PaymentWebView";

// Home Layout Stack Navigator
const HomeLayout = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={TabHome} />
      <Stack.Screen name="Detail" component={DetailScreen} />
      <Stack.Screen name="AllServices" component={AllServices} options={{ title: "All Services" }} />
      <Stack.Screen name="CategoryDetails" component={CategoryDetails} />
      <Stack.Screen name="ServiceDetails" component={ServiceDetails} />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
      <Stack.Screen name="PaymentWebView" component={PaymentWebView} />
    </Stack.Navigator>
  );
};

// Profile Layout Stack Navigator
const ProfileLayout = () => {
   const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfileMain" component={TabProfile}  options={{ title: "Profile" }}/>
      <Stack.Screen name="YourProfile" component={YourProfile} options={{ title: "Your Profile" }} />
      <Stack.Screen name="EditScreen" component={EditScreen} />

    </Stack.Navigator>
  );
};

// Tab Navigation with Icons
const TabNavigation = () => {
  const navigation: NavigationProp<any> = useNavigation();
  const Tab = createBottomTabNavigator();


  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: "home-outline" | "person-outline" = "home-outline";

          if (route.name === "Home1") {
            iconName = "home-outline";
          } else if (route.name === "Profile") {
            iconName = "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#4A628A",
        tabBarInactiveTintColor: "gray",
      })}
      initialRouteName="Home1"
    >
      <Tab.Screen
        name="Home1"
        component={HomeLayout}
        options={{ title: "Home" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileLayout} 
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
};

// Root Stack Navigator
const AppNavigation = () => {
  const RootStack = createNativeStackNavigator();

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {/* Login and Register Screens */}
      <RootStack.Screen name="Login" component={LoginScreen} />
      <RootStack.Screen name="Register" component={RegisterScreen} />

      {/* Main App Tab Navigation */}
      <RootStack.Screen name="MainApp" component={TabNavigation} />
    </RootStack.Navigator>
  );
};

export default AppNavigation;
