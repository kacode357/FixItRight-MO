import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, TextInput, Button, TouchableOpacity } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Portal, Modal, Provider } from "react-native-paper";
import DatePicker from "react-native-modern-datepicker";
import { BookingsnApi, ViewUser, AddTransactionApi } from "../../../services/api";

type RootStackParamList = {
  PaymentScreen: { userId: string; serviceId: string; price: number };
  YourProfile: undefined;
  PaymentWebView: { paymentUrl: string };
};

type PaymentScreenProps = {
  route: RouteProp<RootStackParamList, "PaymentScreen">;
};

const PaymentScreen = ({ route }: PaymentScreenProps) => {
  const { userId, serviceId, price } = route.params;
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  const [workingDate, setWorkingDate] = useState("");
  const [workingTime, setWorkingTime] = useState("");
  const [address, setAddress] = useState("");

  const [showDateModal, setShowDateModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);

  // Lấy địa chỉ người dùng
  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const getInfoUser = await ViewUser(userId);
        if (getInfoUser.Address) {
          setAddress(getInfoUser.Address);
        }
      } catch (error) {
        console.error("Lỗi khi lấy địa chỉ người dùng:", error);
      }
    };
    fetchUserAddress();
  }, [userId]);

  const handleUseCurrentAddress = async () => {
    try {
      const getInfoUser = await ViewUser(userId);
      if (getInfoUser.Address) {
        setAddress(getInfoUser.Address);
        Alert.alert("Thông báo", "Đã sử dụng địa chỉ hiện tại.");
      } else {
        Alert.alert("Thông báo", "Vui lòng cập nhật địa chỉ của bạn.", [
          { text: "OK", onPress: () => navigation.navigate("YourProfile") },
        ]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy địa chỉ người dùng:", error);
      Alert.alert("Lỗi", "Không thể lấy thông tin địa chỉ.");
    }
  };

  const handleTransaction = async () => {
    if (!workingDate || !workingTime || !address) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      const response = await BookingsnApi({
        ServiceId: serviceId,
        CustomerId: userId,
        Address: address,
        WorkingDate: workingDate.replace(/\//g, "-"), // Định dạng ngày
        WorkingTime: workingTime.padStart(5, "0"),   // Định dạng giờ
      });
      const transactionApi = await AddTransactionApi({
        Amount: price,
        BookingId: response.Id,
        UserId: userId,
      });
      navigation.navigate("PaymentWebView", {
        paymentUrl: transactionApi, 
      });
      console.log("Transaction response:", transactionApi);
      console.log("Transaction response:", response);
      
    } catch (error) {
      console.log("Error in handleTransaction>>>   :", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi xử lý giao dịch.");
    }
  };

  return (
    <Provider>
      <View style={styles.container}>
        <Text style={styles.title}>Thông tin thanh toán</Text>
        <Text>User ID: {userId}</Text>
        <Text>Service ID: {serviceId}</Text>
        <Text>Price: {price}</Text>

        <TouchableOpacity onPress={() => setShowDateModal(true)} style={styles.input}>
          <Text>{workingDate || "Chọn ngày làm việc"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowTimeModal(true)} style={styles.input}>
          <Text>{workingTime || "Chọn giờ làm việc"}</Text>
        </TouchableOpacity>

        <View style={styles.addressContainer}>
          <TextInput
            style={[styles.input, styles.addressInput]}
            placeholder="Nhập địa chỉ"
            value={address}
            onChangeText={setAddress}
          />
          <TouchableOpacity style={styles.button} onPress={handleUseCurrentAddress}>
            <Text style={styles.buttonText}>Sử dụng địa chỉ hiện tại</Text>
          </TouchableOpacity>
        </View>

        <Button title="Đặt lịch" onPress={handleTransaction} />

        {/* Modal chọn ngày */}
        <Portal>
          <Modal visible={showDateModal} onDismiss={() => setShowDateModal(false)} contentContainerStyle={styles.modal}>
            <DatePicker
              mode="calendar"
              onDateChange={(selectedDate) => {
                setWorkingDate(selectedDate);
                setShowDateModal(false);
              }}
            />
          </Modal>
        </Portal>

        {/* Modal chọn giờ */}
        <Portal>
          <Modal visible={showTimeModal} onDismiss={() => setShowTimeModal(false)} contentContainerStyle={styles.modal}>
            <DatePicker
              mode="time"
              onTimeChange={(selectedTime) => {
                setWorkingTime(selectedTime);
                setShowTimeModal(false);
              }}
            />
          </Modal>
        </Portal>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    justifyContent: "center",
    marginVertical: 10,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  addressInput: {
    flex: 1,
    marginRight: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
});

export default PaymentScreen;
