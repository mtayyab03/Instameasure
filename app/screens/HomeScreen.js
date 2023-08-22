import React, { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { db } from "../../config";

//Components
import Screen from "../components/Screen";
import AppButton from "../components/AppButton";

//config
import Colors from "../config/Colors";
import { FontFamily } from "../config/font";

export default function HomeScreen() {
  const route = useRoute();
  const userId = route.params?.userId || null;
  const initialApiHitCount = route.params?.apiHitCount || 0;
  const [Street, onChangeStreet] = useState("");
  const [Suite, onChangeSuite] = useState("");
  const [City, onChangeCity] = useState("");
  const [State, onChangeState] = useState("");
  const [Zip, onChangeZip] = useState("");
  const [Pitch, onChangePitch] = useState("");
  const [Areasqft, onChangeAreasqft] = useState("");
  const [loading, setLoading] = useState(false);
  const [ModeSlope, setModeSlope] = useState(""); // To store ModeSlope from API response
  const [Area_SqFt, setArea_SqFt] = useState(""); // To store Area_SqFt from API response
  const [degreeMultiplier, setDegreeMultiplier] = useState(1);
  const [wasteMultiplier, setWasteMultiplier] = useState(1);
  const [pricePerSqFt, setPricePerSqFt] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [degmenuid, setdegmenuid] = useState(0);
  const [Wastemenuid, setWastemenuid] = useState(0);
  const [apiHits, setApiHitCount] = useState(initialApiHitCount);
  // Change the initial count as needed
  const [isApiHitExhausted, setIsApiHitExhausted] = useState(false);

  const degreeList = [
    {
      id: 1,
      title: "Flat",
    },
    {
      id: 2,
      title: "Degree 4-27   1/12-6/12",
    },
    {
      id: 3,
      title: "Degree 28-37   7/12-9/12",
    },
    {
      id: 4,
      title: "Degree 38 and up 10/12",
    },
  ];

  const wasteList = [
    {
      id: 1,
      title: "0%",
    },
    {
      id: 2,
      title: "10%",
    },
    {
      id: 3,
      title: "12%",
    },
    {
      id: 4,
      title: "15%",
    },
    {
      id: 5,
      title: "20%",
    },
  ];

  const handleGetButtonClick = async () => {
    if (apiHits > 0 && !loading) {
      setLoading(true);

      try {
        const completeAddress = `${Street} ${Suite}, ${City} ${State} ${Zip}`;
        const apiUrl = `https://api.buildings.earthdefine.com/v1/buildings?address=${encodeURIComponent(
          completeAddress
        )}&token=bf310fb2-1273-4065-81fd-591cf7e60dc0`;

        const response = await axios.get(apiUrl);
        const data = response.data;

        if (data && data.length > 0) {
          const firstBuilding = data[0];
          setModeSlope(firstBuilding.ModeSlope);
          setArea_SqFt(firstBuilding.Area_SqFt);

          // Decrement the API hit count here, after the API call is successful
          setApiHitCount(apiHits - 1);

          // Update the API hit count in Firebase
          await db
            .collection("users")
            .doc(userId)
            .update({
              apiHits: apiHits - 1,
            });
        }
      } catch (error) {
        console.error("Error fetching API data:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setIsApiHitExhausted(true);
      if (apiHits === 0) {
        alert(
          "Your API hits are exhausted. Please contact the admin for more."
        );
      }
    }
  };
  useEffect(() => {
    if (isApiHitExhausted) {
    }
  }, [isApiHitExhausted]);

  useEffect(() => {
    // Update the Degree/Pitch and Area square ft fields
    onChangePitch(ModeSlope);
    onChangeAreasqft(Area_SqFt);
  }, [ModeSlope, Area_SqFt]);

  // mmultiple

  const degreeMultipliers = {
    1: 1,
    2: 1.0505,
    3: 1.2032,
    4: 1.3575,
  };

  const wasteMultipliers = {
    1: 1,
    2: 1.1,
    3: 1.12,
    4: 1.15,
    5: 1.2,
  };

  useEffect(() => {
    // Calculate total price
    const areaSqFtFloat = parseFloat(Areasqft.replace(/[^\d.-]/g, ""));
    const pricePerSqFtFloat = parseFloat(pricePerSqFt.replace(/[^\d.-]/g, ""));

    const calculatedPrice =
      areaSqFtFloat * degreeMultiplier * wasteMultiplier * pricePerSqFtFloat;

    setTotalPrice(calculatedPrice.toFixed(2)); // Format to two decimal places
  }, [degreeMultiplier, wasteMultiplier, Areasqft, pricePerSqFt]);

  const handleDegreeRadioPress = (degreeId) => {
    setdegmenuid(degreeId);
    setDegreeMultiplier(degreeMultipliers[degreeId]);

    // Update the Areasqft state based on the selected degree option
    onChangeAreasqft((prevAreasqft) => {
      const areaSqFtFloat = parseFloat(prevAreasqft.replace(/[^\d.-]/g, ""));
      const updatedAreasqft = (
        areaSqFtFloat * degreeMultipliers[degreeId]
      ).toFixed(2);
      return `${updatedAreasqft} sqft`;
    });
  };

  const handleWasteRadioPress = (wasteId) => {
    setWastemenuid(wasteId);
    setWasteMultiplier(wasteMultipliers[wasteId]);

    // Update the Areasqft state based on the selected waste option
    onChangeAreasqft((prevAreasqft) => {
      const areaSqFtFloat = parseFloat(prevAreasqft.replace(/[^\d.-]/g, ""));
      const updatedAreasqft = (
        areaSqFtFloat * wasteMultipliers[wasteId]
      ).toFixed(2);
      return `${updatedAreasqft} sqft`;
    });
  };

  // Update price input handler
  const handlePriceInputChange = (text) => {
    setPricePerSqFt(text);
  };
  return (
    <View style={styles.screen}>
      <View
        style={{
          width: "100%",
          backgroundColor: Colors.primary,
          height: RFPercentage(13),
          alignItems: "center",
        }}
      >
        <Image
          style={styles.logo}
          source={require("../../assets/images/measurelogowhite.png")}
        />
      </View>
      <ScrollView
        contentContainerStyle={{ alignItems: "center" }}
        showsVerticalScrollIndicator={false}
        style={{ width: "100%" }}
      >
        {/* street input field */}
        <View style={{ marginTop: RFPercentage(4) }} />
        <View style={styles.emailmain}>
          <TextInput
            style={{ fontSize: RFPercentage(2.2) }}
            onChangeText={onChangeStreet}
            value={Street}
            placeholder="Street Address"
            placeholderTextColor={Colors.placeholder}
          />
        </View>

        {/* Suite&City input field */}
        <View
          style={{
            width: "90%",
            marginTop: RFPercentage(2),
            flexDirection: "row",
          }}
        >
          <View
            style={{
              width: "35%",
              height: RFPercentage(7.5),
              backgroundColor: Colors.white,
              borderWidth: RFPercentage(0.1),
              borderColor: Colors.placeholder,
              color: Colors.blacky,
              paddingLeft: RFPercentage(2.5),
              borderRadius: RFPercentage(1.5),
              justifyContent: "center",
            }}
          >
            <TextInput
              style={{ fontSize: RFPercentage(2.2) }}
              onChangeText={onChangeSuite}
              value={Suite}
              placeholder="Suite"
              placeholderTextColor={Colors.placeholder}
            />
          </View>
          <View style={{ marginLeft: "5%" }} />
          <View
            style={{
              width: "60%",
              height: RFPercentage(7.5),
              backgroundColor: Colors.white,
              borderWidth: RFPercentage(0.1),
              borderColor: Colors.placeholder,
              color: Colors.blacky,
              paddingLeft: RFPercentage(2.5),
              borderRadius: RFPercentage(1.5),
              justifyContent: "center",
            }}
          >
            <TextInput
              style={{ fontSize: RFPercentage(2.2) }}
              onChangeText={onChangeCity}
              value={City}
              placeholder="City"
              placeholderTextColor={Colors.placeholder}
            />
          </View>
        </View>

        {/* State&ZipCode input field */}
        <View
          style={{
            width: "90%",
            marginTop: RFPercentage(2),
            flexDirection: "row",
          }}
        >
          <View
            style={{
              width: "60%",
              height: RFPercentage(7.5),
              backgroundColor: Colors.white,
              borderWidth: RFPercentage(0.1),
              borderColor: Colors.placeholder,
              color: Colors.blacky,
              paddingLeft: RFPercentage(2.5),
              borderRadius: RFPercentage(1.5),
              justifyContent: "center",
            }}
          >
            <TextInput
              style={{ fontSize: RFPercentage(2.2) }}
              onChangeText={onChangeState}
              value={State}
              placeholder="State"
              placeholderTextColor={Colors.placeholder}
            />
          </View>
          <View style={{ marginLeft: "5%" }} />
          <View
            style={{
              width: "35%",
              height: RFPercentage(7.5),
              backgroundColor: Colors.white,
              borderWidth: RFPercentage(0.1),
              borderColor: Colors.placeholder,
              color: Colors.blacky,
              paddingLeft: RFPercentage(2.5),
              borderRadius: RFPercentage(1.5),
              justifyContent: "center",
            }}
          >
            <TextInput
              style={{ fontSize: RFPercentage(2.2) }}
              onChangeText={onChangeZip}
              value={Zip}
              placeholder="Zip Code"
              placeholderTextColor={Colors.placeholder}
            />
          </View>
        </View>

        {/* button */}
        <TouchableOpacity
          onPress={handleGetButtonClick}
          style={styles.loginbutton}
          activeOpacity={0.7}
          disabled={apiHits === 0} // Disable the button if apiHitCount is 0
        >
          <AppButton
            title={`Get (${apiHits} left)`} // Display remaining API hit count
            buttonColor={Colors.pink}
          />
        </TouchableOpacity>

        {/* degree text */}
        <View style={{ width: "90%", marginTop: RFPercentage(6) }}>
          <Text
            style={{
              color: Colors.blacky,
              fontFamily: FontFamily.medium,
              fontSize: RFPercentage(2.5),
            }}
          >
            Degree/Pitch
          </Text>
        </View>
        {/* //degree/pitch input */}
        <View style={{ marginTop: RFPercentage(2) }} />
        <View style={styles.emailmain}>
          <TextInput
            style={{ fontSize: RFPercentage(2.2) }}
            onChangeText={onChangePitch}
            value={Pitch}
            placeholder="e.g 25"
            placeholderTextColor={Colors.placeholder}
          />
        </View>

        {/* degree radio options */}
        <View style={{ width: "90%", marginTop: RFPercentage(6) }}>
          <Text
            style={{
              color: Colors.blacky,
              fontFamily: FontFamily.medium,
              fontSize: RFPercentage(2.5),
            }}
          >
            Degree
          </Text>
        </View>

        {/* radio button title */}
        <View style={{ width: "90%" }}>
          {degreeList.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              onPress={() => handleDegreeRadioPress(item.id)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: RFPercentage(3),
              }}
            >
              {/* radio button */}
              <View
                style={{
                  width: RFPercentage(2.5),
                  height: RFPercentage(2.5),
                  borderWidth: RFPercentage(0.2),
                  borderRadius: RFPercentage(2),
                  borderColor: Colors.placeholder,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {degmenuid === item.id ? (
                  <View
                    style={{
                      width: RFPercentage(1.5),
                      height: RFPercentage(1.5),
                      borderRadius: RFPercentage(2),
                      backgroundColor: Colors.pink,
                    }}
                  />
                ) : null}
              </View>

              {/* title */}
              <View style={{ marginLeft: RFPercentage(2) }} />
              <Text
                style={{
                  fontFamily: FontFamily.medium,
                  fontSize: RFPercentage(2.3),
                  color: Colors.subtextcolor,
                  fontWeight: "600",
                }}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* degree radio options */}
        <View style={{ width: "90%", marginTop: RFPercentage(6) }}>
          <Text
            style={{
              color: Colors.blacky,
              fontFamily: FontFamily.medium,
              fontSize: RFPercentage(2.5),
            }}
          >
            Waste
          </Text>
        </View>

        {/* waste */}
        {/* radio button title */}
        <View style={{ width: "90%" }}>
          {wasteList.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              onPress={() => handleWasteRadioPress(item.id)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: RFPercentage(3),
              }}
            >
              {/* radio button */}
              <View
                style={{
                  width: RFPercentage(2.5),
                  height: RFPercentage(2.5),
                  borderWidth: RFPercentage(0.2),
                  borderRadius: RFPercentage(2),
                  borderColor: Colors.placeholder,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {Wastemenuid === item.id ? (
                  <View
                    style={{
                      width: RFPercentage(1.5),
                      height: RFPercentage(1.5),
                      borderRadius: RFPercentage(2),
                      backgroundColor: Colors.pink,
                    }}
                  />
                ) : null}
              </View>

              {/* title */}
              <View style={{ marginLeft: RFPercentage(2) }} />
              <Text
                style={{
                  fontFamily: FontFamily.medium,
                  fontSize: RFPercentage(2.3),
                  color: Colors.subtextcolor,
                  fontWeight: "600",
                }}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Area sqft text*/}
        <View style={{ width: "90%", marginTop: RFPercentage(6) }}>
          <Text
            style={{
              color: Colors.blacky,
              fontFamily: FontFamily.medium,
              fontSize: RFPercentage(2.5),
            }}
          >
            Area square ft
          </Text>
        </View>
        {/* Area sqft input */}
        <View style={{ marginTop: RFPercentage(2) }} />
        <View style={styles.emailmain}>
          <TextInput
            style={{ fontSize: RFPercentage(2.2) }}
            onChangeText={onChangeAreasqft}
            value={Areasqft}
            placeholder="e.g 43330 sqft"
            placeholderTextColor={Colors.placeholder}
          />
        </View>

        {/* Price per square text*/}
        <View style={{ width: "90%", marginTop: RFPercentage(5) }}>
          <Text
            style={{
              color: Colors.blacky,
              fontFamily: FontFamily.medium,
              fontSize: RFPercentage(2.5),
            }}
          >
            Price per sqft
          </Text>
        </View>
        <View style={{ marginTop: RFPercentage(2) }} />
        <View style={styles.emailmain}>
          <TextInput
            style={{ fontSize: RFPercentage(2.2) }}
            onChangeText={handlePriceInputChange}
            value={pricePerSqFt}
            placeholder="e.g  $4"
            placeholderTextColor={Colors.placeholder}
          />
        </View>

        {/* Total price text*/}
        <View
          style={{
            width: "90%",
            marginTop: RFPercentage(5),
          }}
        >
          <Text
            style={{
              color: Colors.blacky,
              fontFamily: FontFamily.medium,
              fontSize: RFPercentage(2.5),
            }}
          >
            Total price
          </Text>
        </View>
        {/* Total price input */}
        <View style={{ marginTop: RFPercentage(2) }} />
        <View style={styles.emailmain}>
          <TextInput
            style={{ fontSize: RFPercentage(2.2) }}
            onChangeText={setTotalPrice}
            value={totalPrice}
            placeholder="e.g  $1546.00"
            placeholderTextColor={Colors.placeholder}
          />
        </View>
        <View style={{ marginBottom: RFPercentage(7) }} />
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  logo: {
    width: RFPercentage(20),
    height: RFPercentage(5),
    position: "absolute",
    bottom: RFPercentage(2),
  },
  emailmain: {
    width: "90%",
    height: RFPercentage(7.5),
    backgroundColor: Colors.white,
    borderWidth: RFPercentage(0.1),
    borderColor: Colors.placeholder,
    color: Colors.blacky,
    paddingLeft: RFPercentage(2.5),
    borderRadius: RFPercentage(1.5),
    justifyContent: "center",
  },
  loginbutton: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: RFPercentage(2),
  },
});
