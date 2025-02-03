import React from "react";
import { WebView } from "react-native-webview";
import { RouteProp } from "@react-navigation/native";
import { NavigationProp, useNavigation } from "@react-navigation/native";

type RootStackParamList = {
  PaymentWebView: { paymentUrl: string };
  Home: undefined; 
};

type PaymentWebViewProps = {
  route: RouteProp<RootStackParamList, "PaymentWebView">;
};


const PaymentWebView = ({ route }: PaymentWebViewProps) => {
  const navigation : NavigationProp<RootStackParamList> = useNavigation();
  const { paymentUrl } = route.params;

  const handleNavigationStateChange = (navState: any) => {
    const { url } = navState;

   
    if (url.includes("success") || url.includes("https://fix-it-right.vercel.app/")) {
     
      navigation.navigate("Home");
    }
  };

  return (
    <WebView
      source={{ uri: paymentUrl }}
      style={{ flex: 1 }}
      onNavigationStateChange={handleNavigationStateChange}
    />
  );
};

export default PaymentWebView;
