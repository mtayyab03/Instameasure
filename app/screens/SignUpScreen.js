import React, { useState } from "react";
import {
  Image,
  Alert,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  TextInput,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { auth, db } from "../../config";
//Components
import Screen from "../components/Screen";
import AppButton from "../components/AppButton";

//config
import Colors from "../config/Colors";
import { FontFamily } from "../config/font";

export default function SignUpScreen(props) {
  const [eyeIcon, setEyeIcon] = useState(false);
  const [company, onChangeCompany] = useState("");
  const [email, onChangeEmail] = useState("");
  const [Password, onChangePassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    if (!company || !email || !Password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const existingUserSnapshot = await db
        .collection("users")
        .where("name", "==", email)
        .get();

      if (existingUserSnapshot.size > 0) {
        // User with the same email already exists in Firestore
        // Update the approvalStatus to "pending" and accountStatus to "active"
        const userDoc = existingUserSnapshot.docs[0];
        await userDoc.ref.update({
          approvalStatus: "pending",
          accountStatus: "active",
          company: company, // Update the company name if needed
        });

        Alert.alert(
          "Request Sent",
          "Your registration request has been sent for approval by the admin."
        );
      } else {
        // User does not exist, proceed with creating a new user
        const userCredential = await auth.createUserWithEmailAndPassword(
          email,
          Password
        );
        const user = userCredential.user;

        // Save user data with pending approval status and active account status
        await db.collection("users").doc(user.uid).set({
          company: company,
          name: email,
          approvalStatus: "pending",
          accountStatus: "active",
        });

        Alert.alert(
          "Request Sent",
          "Your signup request has been sent for approval by the admin."
        );
      }

      onChangeCompany("");
      onChangeEmail("");
      onChangePassword("");
    } catch (error) {
      setError(error.message);
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
          Signup
        </Text>
      </View>
      {/* //company name input */}
      <View style={{ marginTop: RFPercentage(3) }} />
      <View style={styles.emailmain}>
        <TextInput
          onChangeText={onChangeCompany}
          value={company}
          placeholder="Company Name"
          placeholderTextColor={Colors.placeholder}
        />
      </View>
      {/* //email input */}
      <View style={{ marginTop: RFPercentage(3) }} />
      <View style={styles.emailmain}>
        <TextInput
          onChangeText={onChangeEmail}
          value={email}
          placeholder="User Name or Email"
          placeholderTextColor={Colors.placeholder}
        />
      </View>

      {/* password */}
      <View style={{ marginTop: RFPercentage(2) }} />

      <View style={styles.emailmain}>
        <TextInput
          onChangeText={onChangePassword}
          value={Password}
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

      {/* button */}
      <TouchableOpacity
        style={styles.loginbutton}
        activeOpacity={0.7}
        onPress={handleSignup}
      >
        <AppButton title="Signup" buttonColor={Colors.primary} />
      </TouchableOpacity>

      {/* Signup */}
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate("LoginScreen");
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
            Don’t have an account?
          </Text>
          <Text
            style={{
              color: Colors.blacky,
              fontFamily: FontFamily.medium,
              fontSize: RFPercentage(2.1),
            }}
          >
            Login
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
    alignItems: "center",
    justifyContent: "center",
    marginTop: RFPercentage(10),
  },
  logo: {
    width: RFPercentage(21),
    height: RFPercentage(5.4),
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
    color: Colors.black,
    paddingLeft: RFPercentage(3),
    borderRadius: RFPercentage(1.5),
    justifyContent: "center",
  },
  input: { fontFamily: FontFamily.regular },

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
});
