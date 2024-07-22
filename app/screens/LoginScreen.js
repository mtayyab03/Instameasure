import React, { useState } from "react";
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  TextInput,
  Alert,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Formik } from "formik";
import * as yup from "yup";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { auth, db } from "../../config";
import { useNavigation } from "@react-navigation/native";
//Components
import Screen from "../components/Screen";
import AppButton from "../components/AppButton";

//config
import Colors from "../config/Colors";
import { FontFamily } from "../config/font";

export default function LoginScreen(props) {
  const [eyeIcon, setEyeIcon] = useState(false);
  const navigation = useNavigation();
  let validationSchema = yup.object().shape({
    email: yup.string().required().email().label("Email"),
    password: yup.string().required().min(4).label("Password"),
  });

  const handleLogin = async ({ email, password }) => {
    try {
      const userCredential = await auth.signInWithEmailAndPassword(
        email,
        password
      );
      const user = userCredential.user;

      // Check if the user's approval status is "approved"
      const userSnapshot = await db.collection("users").doc(user.uid).get();
      if (userSnapshot.exists) {
        const userData = userSnapshot.data();
        console.log("User Data:", userData);
        if (userData.approvalStatus === "approved") {
          navigation.replace("HomeScreen", {
            userId: user.uid,
            apiHitCount: userData.apiHits,
          });
        } else {
          console.log("User approval status:", userData.approvalStatus);
          console.log("Your signup request is still pending approval.");
        }
      } else {
        // Handle the case where the user's data is not found
        console.log("User data not found.");
      }
    } catch (error) {
      console.error(error);
      if (error.code === "auth/user-not-found") {
        Alert.alert(
          "Invalid Credentials",
          "Please use a valid email or password.",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
      } else {
        // Handle other errors (display a generic error message)
        Alert.alert(
          "Error",
          "An error occurred. Please try again later.",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
      }
    }
  };
  return (
    <Screen style={styles.screen}>
      <View
        style={{
          position: "absolute",
          right: RFPercentage(4),
          marginTop: RFPercentage(7),
        }}
      >
        <TouchableOpacity
          style={{
            padding: RFPercentage(1),
            borderWidth: RFPercentage(0.3),
            borderColor: Colors.lightWhite,
            borderRadius: RFPercentage(1),
          }}
          onPress={() => {
            props.navigation.navigate("AdminLogin");
          }}
          activeOpacity={0.7}
        >
          <Text
            style={{
              color: Colors.blacky,
              fontFamily: FontFamily.medium,
              fontSize: RFPercentage(2),
            }}
          >
            Admin
          </Text>
        </TouchableOpacity>
      </View>
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

      {/* //email input */}
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={handleLogin}
        validationSchema={validationSchema}
      >
        {({ handleChange, handleSubmit, errors, setFieldTouched, touched }) => (
          <>
            <View style={styles.inputmaincontainer}>
              <View style={styles.emailmain}>
                <TextInput
                  style={styles.input}
                  keyboardType="email-address"
                  onChangeText={handleChange("email")}
                  onBlur={() => setFieldTouched("email")}
                  placeholder="User Name or Email"
                  placeholderTextColor={Colors.placeholder}
                />
              </View>
              <View style={{ width: "90%" }}>
                {touched.email && (
                  <Text style={styles.error}>{errors.email}</Text>
                )}
              </View>

              <View style={styles.passwordmain}>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange("password")}
                  onBlur={() => setFieldTouched("password")}
                  // value={Password}
                  placeholder="Password"
                  placeholderTextColor={Colors.placeholder}
                  secureTextEntry={true && !eyeIcon}
                />
                <TouchableOpacity
                  onPress={() => setEyeIcon(!eyeIcon)}
                  activeOpacity={0.7}
                  style={styles.eyeicon}
                >
                  <MaterialCommunityIcons
                    color={Colors.grey}
                    style={{ right: RFPercentage(1) }}
                    size={RFPercentage(3)}
                    name={eyeIcon ? "eye-outline" : "eye-off-outline"}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ width: "90%" }}>
                {touched.password && (
                  <Text style={styles.error}>{errors.password}</Text>
                )}
              </View>
            </View>

            <TouchableOpacity
              style={styles.loginbutton}
              activeOpacity={0.7}
              onPress={handleSubmit}
            >
              <AppButton title="Login" buttonColor={Colors.pink} />
            </TouchableOpacity>
          </>
        )}
      </Formik>

      {/* Signup */}
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate("SignUpScreen");
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
            SIGN UP
          </Text>
        </View>
      </TouchableOpacity>
    </Screen>
  );
}

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
  inputmaincontainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: RFPercentage(2),
  },
  eyeicon: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: RFPercentage(1),
    width: RFPercentage(5),
    height: RFPercentage(5),
  },
  emailmain: {
    width: "90%",
    height: RFPercentage(7.5),
    backgroundColor: Colors.white,
    borderWidth: RFPercentage(0.1),
    borderColor: Colors.lightWhite,
    color: Colors.blacky,
    paddingLeft: RFPercentage(3),
    borderRadius: RFPercentage(1.5),
    justifyContent: "center",
  },
  input: { fontFamily: FontFamily.regular },

  passwordmain: {
    width: "90%",
    height: RFPercentage(7.5),
    backgroundColor: Colors.white,
    borderWidth: RFPercentage(0.1),
    borderColor: Colors.lightWhite,
    color: Colors.black,
    paddingLeft: RFPercentage(3),
    borderRadius: RFPercentage(1.5),
    justifyContent: "center",
    marginTop: RFPercentage(2),
  },
  error: {
    color: "#FF0000",
    fontSize: RFPercentage(1.3),
    marginTop: RFPercentage(0.5),
    fontFamily: FontFamily.regular,
  },

  loginbutton: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: RFPercentage(3),
  },
  appfbgcontainer: {
    width: RFPercentage(15),
    height: RFPercentage(8),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: RFPercentage(0.1),
    borderColor: Colors.lightWhite,
    borderRadius: RFPercentage(2),
  },
  socialmain: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: RFPercentage(5),
  },
  fbglogo: {
    width: RFPercentage(4),
    height: RFPercentage(4),
  },
  applelogo: {
    width: RFPercentage(3.2),
    height: RFPercentage(4),
  },
});
