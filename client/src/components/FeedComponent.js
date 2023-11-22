import React from "react";
import { View, FlatList } from "react-native";
import SwipeComponent from "./SwipeComponent";

const posts = [
  { id: "1", title: "First Post", content: "This is the first post." },
];

const FeedComponent = () => {
  const renderItem = ({ item }) => <SwipeComponent post={item} />;

  return (
    <View>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default FeedComponent;
