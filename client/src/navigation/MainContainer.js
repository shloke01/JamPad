import React from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../assets/styles.js";

// Sreens
import HomeScreen from "./screens/HomeScreen";
import SearchScreen from "./screens/SearchScreen.js";
import NotificationsScreen from "./screens/NotificationsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import LoginScreen from "./screens/LoginScreen";

const Tab = createBottomTabNavigator();

function MainContainer(navigation) {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let routeName = route.name;

          if (routeName === "Home") {
            iconName = focused ? "musical-notes" : "musical-notes-outline";
          } else if (routeName === "Search") {
            iconName = focused ? "search" : "search-outline";
          } else if (routeName === "Notifications") {
            iconName = focused ? "notifications" : "notifications-outline";
          } else if (routeName === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={28} color={color} />;
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "grey",
        tabBarShowLabel: false,
        tabBarStyle: styles.navBar,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  navBar: {
    backgroundColor: "black",
    justifyContent: "flex-end",
    borderTopWidth: 0,
  },
});

export default MainContainer;
