import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import { db } from "../../config"; // Import your Firebase configuration
import { RFPercentage } from "react-native-responsive-fontsize";

//config
import Colors from "../config/Colors";
import { FontFamily } from "../config/font";

function ApprovedScreen(props) {
  const [updatedRequests, setUpdatedRequests] = useState([]);
  const [apiHits, onChangeApiNumber] = useState("");
  const [searchQuery, onChangeSearchQuery] = useState("");
  useEffect(() => {
    const fetchApprovedRequests = async () => {
      try {
        const snapshot = await db
          .collection("users")
          .where("approvalStatus", "==", "approved")
          .get();

        const requests = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUpdatedRequests(requests);
      } catch (error) {
        console.error("Error fetching approved requests:", error);
      }
    };

    fetchApprovedRequests();
  }, []);
  const handleApiHitsChange = (itemId, newApiHits) => {
    console.log(
      "handleApiHitsChange - itemId:",
      itemId,
      "newApiHits:",
      newApiHits
    );
    setUpdatedRequests((prevRequests) =>
      prevRequests.map((req) =>
        req.id === itemId ? { ...req, apiHits: newApiHits } : req
      )
    );
  };
  // Filter the requests based on the search query
  const filteredRequests = updatedRequests.filter((request) =>
    request.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleUpdateMeasurements = async (userId, newApiHits) => {
    try {
      await db.collection("users").doc(userId).update({
        apiHits: newApiHits,
      });

      // Update the local state after successful update
      setUpdatedRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === userId ? { ...req, apiHits: newApiHits } : req
        )
      );

      Alert.alert("Success", "Measurements updated successfully!");
    } catch (error) {
      console.error("Error updating measurements:", error);
      Alert.alert("Error", "Failed to update measurements. Please try again.");
    }
  };

  const handleReject = async (selectedItem) => {
    console.log("Reject button clicked");
    if (selectedItem) {
      const userId = selectedItem.id; // Access the document ID directly
      console.log("Selected user ID:", userId);

      // Update user's approval status and account status in the database
      try {
        await db.collection("users").doc(userId).update({
          approvalStatus: "rejected",
          accountStatus: "disabled", // Add a field to indicate account status
        });

        const updatedReqList = updatedRequests.filter(
          (req) => req.id !== selectedItem.id
        );
        setUpdatedRequests(updatedReqList);

        console.log("Request rejected:", userId);
      } catch (error) {
        console.error("Error updating approval status:", error);
      }
    }
  };

  const renderItem = ({ item }) => (
    <>
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          marginTop: RFPercentage(2.5),
          width: "90%",
          marginLeft: RFPercentage(4),
        }}
        key={item.userId}
      >
        <View>
          <Text
            style={{
              color: Colors.blacky,
              fontSize: RFPercentage(2.5),
              fontFamily: FontFamily.bold,
            }}
          >
            {item.company}
          </Text>
          <Text
            style={{
              color: Colors.blacky,
              fontSize: RFPercentage(1.5),
              fontFamily: FontFamily.medium,
              marginTop: RFPercentage(1),
            }}
          >
            {item.name}
          </Text>

          {/* //company name input */}
          <View style={{ marginTop: RFPercentage(1.3) }} />
          <View style={styles.emailmain}>
            <TextInput
              style={{
                fontSize: RFPercentage(1.5),
                alignItems: "center",
                justifyContent: "center",
              }}
              onChangeText={(newApiHits) =>
                handleApiHitsChange(item.id, newApiHits)
              }
              value={item.apiHits}
              placeholder="Measurements"
              placeholderTextColor={Colors.placeholder}
            />
          </View>
          {/* Use item.email instead of item.name */}
        </View>
        <View
          style={{
            flexDirection: "row",
            position: "absolute",
            right: RFPercentage(3),
          }}
        >
          {/* Display user details here */}
          <TouchableOpacity
            onPress={() => handleUpdateMeasurements(item.id, item.apiHits)}
            style={{
              width: RFPercentage(8),
              height: RFPercentage(4),
              backgroundColor: Colors.primary,
              borderRadius: RFPercentage(1),
              alignItems: "center",
              justifyContent: "center",
              marginRight: RFPercentage(1),
            }}
          >
            <Text
              style={{
                color: Colors.white,
                fontSize: RFPercentage(1.5),
                fontWeight: "bold",
              }}
            >
              Update
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              console.log("Selected user ID:", item.id);
              handleReject(item);
            }}
            style={{
              width: RFPercentage(8),
              height: RFPercentage(4),
              backgroundColor: Colors.red,
              borderRadius: RFPercentage(1),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: Colors.white,
                fontSize: RFPercentage(1.5),
                fontWeight: "bold",
              }}
            >
              Reject
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* line */}
      <View
        style={{
          marginTop: RFPercentage(2.5),
          width: "100%",
          height: RFPercentage(0.1),
          backgroundColor: Colors.lightWhite,
        }}
      />
    </>
  );

  return (
    <View style={styles.screen}>
      <View
        style={{
          width: "100%",
          backgroundColor: Colors.primary,
          height: RFPercentage(13),
          alignItems: "center",
          marginBottom: RFPercentage(1),
        }}
      >
        <Image
          style={styles.logo}
          source={require("../../assets/images/measurelogowhite.png")}
        />
      </View>
      <View
        style={{
          width: "90%",
          marginLeft: RFPercentage(3),
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("AdminDashboard"); // Pass approvedRequests data
          }}
        >
          <Text
            style={{
              color: Colors.blacky,
              fontSize: RFPercentage(1.7),
              fontWeight: "bold",
            }}
          >
            Back
          </Text>
        </TouchableOpacity>
        <View
          style={{
            marginLeft: RFPercentage(2),
            width: "80%",
            height: RFPercentage(5),
            backgroundColor: Colors.white,
            borderWidth: RFPercentage(0.1),
            borderColor: Colors.lightWhite,
            color: Colors.blacky,
            paddingHorizontal: RFPercentage(2),
            borderRadius: RFPercentage(1.5),
            justifyContent: "center",
          }}
        >
          <TextInput
            style={{
              fontSize: RFPercentage(1.5),
              alignItems: "center",
              justifyContent: "center",
            }}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={onChangeSearchQuery}
          />
        </View>
      </View>

      {/* line */}
      <View
        style={{
          marginTop: RFPercentage(2),
          width: "100%",
          height: RFPercentage(0.1),
          backgroundColor: Colors.lightWhite,
        }}
      />
      <FlatList
        data={filteredRequests}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: Colors.white,
  },
  logo: {
    width: RFPercentage(20),
    height: RFPercentage(5),
    position: "absolute",
    bottom: RFPercentage(2),
  },
  emailmain: {
    width: RFPercentage(12),
    height: RFPercentage(4),
    backgroundColor: Colors.white,
    borderWidth: RFPercentage(0.1),
    borderColor: Colors.lightWhite,
    color: Colors.blacky,
    paddingHorizontal: RFPercentage(1),
    borderRadius: RFPercentage(1.5),
    justifyContent: "center",
    alignItems: "center",
  },
  approvedItem: {
    alignItems: "center",
    marginTop: RFPercentage(2.5),
    width: "90%",
    marginLeft: RFPercentage(4),
  },
  company: {
    color: Colors.blacky,
    fontSize: RFPercentage(2.5),
    fontFamily: FontFamily.medium,
  },
  name: {
    color: Colors.blacky,
    fontSize: RFPercentage(1.5),
    fontFamily: FontFamily.medium,
    marginTop: RFPercentage(1),
  },
  line: {
    marginTop: RFPercentage(2.5),
    width: "100%",
    height: RFPercentage(0.1),
    backgroundColor: Colors.grey,
  },
});

export default ApprovedScreen;
