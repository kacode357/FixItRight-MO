import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert,
} from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "../../styles/RegisterScreenStyles";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import { RegisterUserApi } from "../../services/api"; 
import { APP_VERSION } from "../../utils/const";
import Toast from "react-native-toast-message";

const RegisterScreen = () => {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validatePhoneNumber = (phone: string) => {
    return /^[0-9]{10,11}$/.test(phone); // Số điện thoại phải có 10-11 chữ số
  };

  const handleRegister = async () => {
    Keyboard.dismiss(); 
    if (userName.trim().length < 3) {
      Alert.alert("Invalid Username", "Username must be at least 3 characters.");
      return;
    }
    if (!validatePhoneNumber(phoneNumber)) {
      Alert.alert("Invalid Phone Number", "Please enter a valid phone number.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const response = await RegisterUserApi({
        UserName: userName,
        PhoneNumber: phoneNumber,
        Password: password,
      });
      Toast.show({
        type: "success",
        text1: "Registration Successful",
        text2: "Your account has been created!",
        position: "top",
        visibilityTime: 3000,
        onHide: () => navigation.navigate("Login"),
      });
    } catch (error) {
      Alert.alert("Registration Failed", "An error occurred. Please try again.");
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
          <Text style={styles.title}>Sign Up</Text>
          <Text style={styles.subtitle}>Create your account to get started</Text>

          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Your username"
            value={userName}
            onChangeText={setUserName}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Your phone number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            maxLength={11}
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

          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.registerButtonText}>Sign Up</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.orText}>Or sign up with</Text>

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

          <Text style={styles.loginText}>
            Already have an account?{" "}
            <Text
              style={styles.loginLink}
              onPress={() => navigation.navigate("Login")}
            >
              Sign In
            </Text>
          </Text>
        </View>

        <Text style={styles.versionText}>{APP_VERSION}</Text>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

export default RegisterScreen;
