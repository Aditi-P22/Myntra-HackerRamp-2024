// import {
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   TouchableOpacity,
// } from "react-native";
// import React, { useState, useEffect, useContext } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import jwt_decode from "jwt-decode";
// import axios from "axios";
// import { UserType } from "../UserContext";
// import User from "../components/User";
// import Header from "../components/Header";

// const ActivityScreen = () => {
//   const [selectedButton, setSelctedButton] = useState("people");
//   const [content, setContent] = useState("People Content");
//   const [users, setUsers] = useState([]);
//   const { userId, setUserId } = useContext(UserType);
//   const handleButtonClick = (buttonName) => {
//     setSelctedButton(buttonName);
//   };
//   useEffect(() => {
//     const fetchUsers = async () => {
//       const token = await AsyncStorage.getItem("authToken");
//       const decodedToken = jwt_decode(token);
//       const userId = decodedToken.userId;
//       setUserId(userId);

//       axios
//         .get(`http://192.168.0.155:3000/user/${userId}`)
//         .then((response) => {
//           setUsers(response.data);
//         })
//         .catch((error) => {
//           console.log("error", error);
//         });
//     };

//     fetchUsers();
//   }, []);
//   console.log("users", users);
//   return (
//     <View style={styles.container}>
//       <Header />
//       <ScrollView style={{ marginTop: 50 }}>
//         <View style={{ padding: 10, marginTop: 5 }}>
//           <Text style={{ fontSize: 18, fontWeight: "bold" }}>Activity</Text>

//           <View
//             style={{
//               flexDirection: "row",
//               alignItems: "center",
//               gap: 10,
//               marginTop: 12,
//             }}
//           >
//             <TouchableOpacity
//               onPress={() => handleButtonClick("people")}
//               style={[
//                 {
//                   flex: 1,
//                   paddingVertical: 10,
//                   paddingHorizontal: 20,
//                   backgroundColor: "white",
//                   borderColor: "#D0D0D0",
//                   borderRadius: 6,
//                   borderWidth: 0.7,
//                 },
//                 selectedButton === "people"
//                   ? { backgroundColor: "#ff3e6c" }
//                   : null,
//               ]}
//             >
//               <Text
//                 style={[
//                   { textAlign: "center", fontWeight: "bold" },
//                   selectedButton === "people"
//                     ? { color: "white" }
//                     : { color: "#ff3e6c" },
//                 ]}
//               >
//                 People
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               onPress={() => handleButtonClick("all")}
//               style={[
//                 {
//                   flex: 1,
//                   paddingVertical: 10,
//                   paddingHorizontal: 20,
//                   backgroundColor: "white",
//                   borderColor: "#D0D0D0",
//                   borderRadius: 6,
//                   borderWidth: 0.7,
//                 },
//                 selectedButton === "all"
//                   ? { backgroundColor: "#ff3e6c" }
//                   : null,
//               ]}
//             >
//               <Text
//                 style={[
//                   { textAlign: "center", fontWeight: "bold" },
//                   selectedButton === "all"
//                     ? { color: "white" }
//                     : { color: "#ff3e6c" },
//                 ]}
//               >
//                 All
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               onPress={() => handleButtonClick("requests")}
//               style={[
//                 {
//                   flex: 1,
//                   paddingVertical: 10,
//                   paddingHorizontal: 20,
//                   backgroundColor: "white",
//                   borderColor: "#D0D0D0",
//                   borderRadius: 6,
//                   borderWidth: 0.7,
//                 },
//                 selectedButton === "requests"
//                   ? { backgroundColor: "#ff3e6c" }
//                   : null,
//               ]}
//             >
//               <Text
//                 style={[
//                   { textAlign: "center", fontWeight: "bold" },
//                   selectedButton === "requests"
//                     ? { color: "white" }
//                     : { color: "#ff3e6c" },
//                 ]}
//               >
//                 Requests
//               </Text>
//             </TouchableOpacity>
//           </View>

//           <View>
//             {selectedButton === "people" && (
//               <View style={{ marginTop: 20 }}>
//                 {users?.map((item, index) => (
//                   <User key={index} item={item} />
//                 ))}
//               </View>
//             )}
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// export default ActivityScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "white",
//     paddingTop: 10,
//   },
// });

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { UserType } from "../UserContext";
import User from "../components/User";
import Header from "../components/Header";

const ActivityScreen = () => {
  const [selectedButton, setSelectedButton] = useState("people");
  const [users, setUsers] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId, setUserId } = useContext(UserType);

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const decodedToken = jwt_decode(token);
        const userId = decodedToken.userId;
        setUserId(userId);

        // Fetch users for the "People" tab
        const usersResponse = await axios.get(
          `http://192.168.0.155:3000/user/${userId}`
        );
        console.log("Users Response:", usersResponse.data);
        setUsers(usersResponse.data);

        // Fetch followers for the "Followers" tab
        const followersResponse = await axios.get(
          `http://192.168.0.155:3000/user/${userId}/followers`
        );
        console.log("Followers Response:", followersResponse.data);
        setFollowers(followersResponse.data);

        setLoading(false);
      } catch (error) {
        console.log(
          "Error fetching data",
          error.response ? error.response.data : error.message
        );
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleFollow = async (userToFollow) => {
    try {
      // Follow user
      await axios.post(`http://192.168.0.155:3000/user/${userId}/follow`, {
        followId: userToFollow.id,
      });
      const updatedFollowersResponse = await axios.get(
        `http://192.168.0.155:3000/user/${userId}/followers`
      );
      setFollowers(updatedFollowersResponse.data);
      // Update state
      setFollowers((prevFollowers) => [...prevFollowers, userToFollow]);

      // Optionally: Remove from "People" list if desired
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== userToFollow.id)
      );
    } catch (error) {
      console.log("Error following user", error);
    }
  };

  const renderUsers = (list) =>
    list.length > 0 ? ( // Check if list has elements
      <View style={{ marginTop: 20 }}>
        {list.map((item, index) => (
          <User key={index} item={item} onFollow={() => handleFollow(item)} />
        ))}
      </View>
    ) : (
      <Text>No followers yet.</Text> // Display message for empty list
    );

  if (loading) {
    return <ActivityIndicator size="large" color="#ff3e6c" />;
  }

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={{ marginTop: 50 }}>
        <View style={{ padding: 10, marginTop: 5 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Activity</Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              marginTop: 12,
            }}
          >
            <TouchableOpacity
              onPress={() => handleButtonClick("people")}
              style={[
                {
                  flex: 1,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  backgroundColor: "white",
                  borderColor: "#D0D0D0",
                  borderRadius: 6,
                  borderWidth: 0.7,
                },
                selectedButton === "people"
                  ? { backgroundColor: "#ff3e6c" }
                  : null,
              ]}
            >
              <Text
                style={[
                  { textAlign: "center", fontWeight: "bold" },
                  selectedButton === "people"
                    ? { color: "white" }
                    : { color: "#ff3e6c" },
                ]}
              >
                People
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleButtonClick("followers")}
              style={[
                {
                  flex: 1,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  backgroundColor: "white",
                  borderColor: "#D0D0D0",
                  borderRadius: 6,
                  borderWidth: 0.7,
                },
                selectedButton === "followers"
                  ? { backgroundColor: "#ff3e6c" }
                  : null,
              ]}
            >
              <Text
                style={[
                  { textAlign: "center", fontWeight: "bold" },
                  selectedButton === "followers"
                    ? { color: "white" }
                    : { color: "#ff3e6c" },
                ]}
              >
                Followers
              </Text>
            </TouchableOpacity>
          </View>

          <View>
            {selectedButton === "people" && renderUsers(users)}
            {selectedButton === "followers" && renderUsers(followers)}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ActivityScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 10,
  },
});
