import { StyleSheet, Text } from "react-native"
import { globalStyles } from "../../utils/const";

const styles = StyleSheet.create({
    about :{
        fontSize: 30,
    }
    });
const AboutScreen = () => {
  return (
  <Text style ={[styles.about , globalStyles.globalFont]}> AboutScreen Google</Text>
  )
}

export default AboutScreen