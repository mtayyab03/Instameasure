import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Button,
} from "react-native";
import { db } from "../../config"; // Import your Firebase configuration
import { RFPercentage } from "react-native-responsive-fontsize";

//Components
import Screen from "../components/Screen";
import AppButton from "../components/AppButton";

//config
import Colors from "../config/Colors";
import { FontFamily } from "../config/font";

function AdminDashboard() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    // Fetch pending requests from Firestore
    const fetchPendingRequests = async () => {
      const snapshot = await db
        .collection("users")
        .where("approvalStatus", "==", "pending")
        .get();
      const requests = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPendingRequests(requests);
    };

    fetchPendingRequests();
  }, []);

  const handleApprove = async (selectedItem) => {
    console.log("Approve button clicked");

    if (selectedItem) {
      const userId = selectedItem.id; // Access the document ID directly
      console.log("Selected user ID:", userId);

      // Update user's approval status in the database
      try {
        await db
          .collection("users")
          .doc(userId) // Use the document ID
          .update({ approvalStatus: "approved" });

        console.log("Request approved:", userId);

        // Send a notification to the user
      } catch (error) {
        console.error("Error updating approval status:", error);
      }
    }
  };

  const handleReject = async (selectedItem) => {
    console.log("Reject button clicked");
    if (selectedItem) {
      const userId = selectedItem.id; // Access the document ID directly
      console.log("Selected user ID:", userId);
      await db
        .collection("users")
        .doc(userId) // Use the document ID
        .update({ approvalStatus: "rejected" });

      // Send a notification to the user

      console.log("Request rejected:", userId);
    }
  };
  // Render pending requests in a FlatList
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
            onPress={() => {
              console.log("Selected user ID:", item.id);
              handleApprove(item);
            }}
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
              Approve
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
          backgroundColor: Colors.grey,
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
      <FlatList
        data={pendingRequests}
        renderItem={renderItem}
        keyExtractor={(item) => item.id} // Use user ID as the key
      />
    </View>
  );
}

export default AdminDashboard;
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
});
