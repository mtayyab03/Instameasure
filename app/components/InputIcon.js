import React, { useState } from "react";
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

//config
import Colors from "../config/Colors";
import { FontFamily } from "../config/font";

export default function InputIcon({ title, imageSource }) {
  const [link, onChangeLink] = useState("");

  return (
    <View style={styles.searchmain}>
      <View style={styles.innermain}>
        <Image style={styles.img} source={imageSource} />

        <TextInput
          style={styles.inputtext}
          onChangeText={onChangeLink}
          value={link}
          placeholder={title}
          placeholderTextColor={"#616C87"}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchmain: {
    width: "90%",
    backgroundColor: Colors.white,
    padding: RFPercentage(1),
    borderWidth: RFPercentage(0.2),
    borderColor: Colors.lightWhite,
    borderRadius: RFPercentage(5),
    height: RFPercentage(6),
    justifyContent: "center",
    marginTop: RFPercentage(2),
  },

  innermain: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: RFPercentage(1),
  },

  img: { width: RFPercentage(3), height: RFPercentage(3) },

  inputtext: {
    width: "100%",
    paddingLeft: RFPercentage(1.5),
    fontWeight: "500",
    fontSize: RFPercentage(1.9),
    color: Colors.black,
    fontFamily: FontFamily.medium,
  },
});
