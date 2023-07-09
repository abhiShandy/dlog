import { Text, View } from "react-native";

const Log = ({ date, content }) => {
  const displayDate = date ? date : "No date";
  const displayContent = content ? content : "No content";
  return (
    <View
      style={{
        zIndex: 2,
        marginBottom: 20,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <View>
        <Text
          accessibilityLabel={displayDate}
          style={{
            fontSize: 14,
            fontWeight: "bold",
          }}
        >
          {displayDate}
        </Text>
        <Text
          accessibilityLabel={displayContent}
          style={{
            fontSize: 16,
            marginTop: 5,
          }}
        >
          {displayContent}
        </Text>
      </View>
    </View>
  );
};

export default Log;
