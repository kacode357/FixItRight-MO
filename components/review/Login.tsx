import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  ActivityIndicator,
  StyleSheet, // Thêm StyleSheet để định nghĩa style mới
} from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "../../styles/LoginScreenStyles";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import { LoginUserApi } from "../../services/api";

const LoginScreen = () => {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); 

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    setLoading(true); // Bắt đầu loading
    try {
      const response = await LoginUserApi({
        UserName: account,
        Password: password,
      });

      // Lưu token vào AsyncStorage
      await AsyncStorage.setItem("token", response.AccessToken);

      navigation.navigate("MainApp"); 
    } catch (error) {
     
        setLoading(false); 
    } finally {
      setLoading(false); 
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground
        source={require("../../assets/BG_FIR_1.png")}
        style={styles.background}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.subtitle}>Hi welcome back, you been missed</Text>

          <Text style={styles.label}>Account</Text>
          <TextInput
            style={styles.input}
            placeholder="Your account"
            value={account}
            onChangeText={setAccount}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={togglePasswordVisibility}>
              <MaterialCommunityIcons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color="#000"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {loading ? ( // Hiển thị hiệu ứng loading nếu đang tải
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Sign In</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.orText}>Or sign in with</Text>

          <View style={styles.socialIcons}>
            <TouchableOpacity style={styles.iconContainer}>
              <FontAwesome name="apple" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer}>
              <FontAwesome name="google" size={24} color="#DB4437" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer}>
              <FontAwesome name="facebook" size={24} color="#4267B2" />
            </TouchableOpacity>
          </View>

          <Text style={styles.signupText}>
            Don’t have an account?{" "}
            <Text
              style={styles.signupLink}
              onPress={() => navigation.navigate("Register")}
            >
              Sign Up
            </Text>
          </Text>
        </View>
        {/* Dòng chữ hiển thị phiên bản ở góc phải màn hình */}
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};


export default LoginScreen;
