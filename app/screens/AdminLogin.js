import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
//config
import Colors from "../config/Colors";
import { FontFamily } from "../config/font";

//Components
import Screen from "../components/Screen";
import AppButton from "../components/AppButton";

const AdminLogin = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email === "Tayyab@gmail.com" && password === "123456") {
      // Navigate to the admin panel or dashboard
      navigation.navigate("AdminDashboard"); // Replace 'AdminDashboard' with the actual screen name
    } else {
      Alert.alert(
        "Invalid Credentials",
        "Please enter correct email and password."
      );
    }
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.logocontainer}>
        <Image
          style={styles.logo}
          source={require("../../assets/images/measurecolorlogo.png")}
        />
      </View>
      {/* login text */}
      <View style={{ width: "90%", marginTop: RFPercentage(10) }}>
        <Text
          style={{
            color: Colors.blacky,
            fontFamily: FontFamily.medium,
            fontSize: RFPercentage(2.5),
          }}
        >
          Login
        </Text>
      </View>
      <View style={{ marginTop: RFPercentage(3) }} />

      {/* login */}
      <View style={styles.emailmain}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
      </View>

      <View style={{ marginTop: RFPercentage(3) }} />

      {/* login */}
      <View style={styles.emailmain}>
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
      </View>

      {/* button */}
      <TouchableOpacity
        style={styles.loginbutton}
        activeOpacity={0.7}
        onPress={handleLogin}
      >
        <AppButton title="Login" buttonColor={Colors.primary} />
      </TouchableOpacity>

      {/* Signup */}
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("LoginScreen");
        }}
        activeOpacity={0.7}
        style={{ position: "absolute", bottom: RFPercentage(6) }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              color: Colors.textcolor,
              fontFamily: FontFamily.regular,
              fontSize: RFPercentage(2),
            }}
          >
            Don’t have a account ?
          </Text>
          <Text
            style={{
              color: Colors.blacky,
              fontFamily: FontFamily.medium,
              fontSize: RFPercentage(2.1),
            }}
          >
            Back
          </Text>
        </View>
      </TouchableOpacity>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  logocontainer: {
    marginTop: RFPercentage(12),
  },
  logo: {
    width: RFPercentage(21),
    height: RFPercentage(5.4),
  },
  emailmain: {
    width: "90%",
    height: RFPercentage(7.5),
    backgroundColor: Colors.white,
    borderWidth: RFPercentage(0.1),
    borderColor: Colors.lightWhite,
    color: Colors.black,
    paddingLeft: RFPercentage(3),
    borderRadius: RFPercentage(1.5),
    justifyContent: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginbutton: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: RFPercentage(3),
  },
});

export default AdminLogin;
