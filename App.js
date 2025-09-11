import * as SQLite from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Log from "./components/Log";

// Be careful with the database name
const db = SQLite.openDatabaseSync("db.db");

export default function App() {
  const [logs, setLogs] = useState([]);
  const [isCreateLogFormOpen, setIsCreateLogFormOpen] = useState(false);
  const [date, setDate] = useState(new Date().toLocaleDateString());
  const [content, setContent] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const openCreateLogForm = () => {
    setIsCreateLogFormOpen(true);
  };

  const closeCreateLogForm = () => {
    setIsCreateLogFormOpen(false);
  };

  const resetForm = () => {
    setContent("");
    setDate(new Date().toLocaleDateString());
  };

  const addLogToDatabase = () => {
    db.runSync(
        "insert into logs (id, date, content) values (?, ?, ?)",
        [Math.random().toString(), date, content]
      );
  };

  const readLogsFromDatabase = () => {
    setRefreshing(true);
    const rows = db.getAllSync("select * from logs order by date desc");
    setLogs(rows);
    setRefreshing(false);
  };

  useEffect(() => {
    db.runSync(
          "create table if not exists logs (id text primary key not null, date text, content text);"
        );
    readLogsFromDatabase();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require("./assets/header-logo.png")}
            style={{
              width: 48,
              height: 48,
            }}
          />
          <Pressable style={styles.button} onPress={openCreateLogForm}>
            <Text style={styles.buttonText}>Add</Text>
          </Pressable>
        </View>

        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={readLogsFromDatabase}
            />
          }
          style={[
            isCreateLogFormOpen ? { opacity: 0.25 } : { opacity: 1 },
            {
              height: "90%",
            },
          ]}
          data={logs}
          renderItem={({ item }) => (
            <Log date={item.date} content={item.content} id={item.id} />
          )}
          keyExtractor={(item) => item.id}
        ></FlatList>
        <StatusBar style="auto" />

        {isCreateLogFormOpen && (
          <View
            style={[
              {
                borderWidth: 2,
                borderRadius: 4,
                borderColor: "black",
                padding: 10,
                position: "absolute",
                top: 200,
                left: 0,
                width: "100%",
                backgroundColor: "white",
              },
            ]}
          >
            <Text
              style={{
                fontSize: 20,
                textAlign: "center",
              }}
            >
              Add a dream log
            </Text>
            <TextInput
              placeholder="Date"
              defaultValue={new Date().toLocaleDateString()}
              style={{
                height: 48,
                borderBottomColor: "gray",
                borderBottomWidth: 1,
              }}
              value={date}
              onChange={(e) => setDate(e.nativeEvent.text)}
            />
            <TextInput
              placeholder="Content"
              style={{
                height: 100,
                borderBottomColor: "gray",
                borderBottomWidth: 1,
              }}
              value={content}
              onChange={(e) => setContent(e.nativeEvent.text)}
            />
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                margin: 10,
              }}
            >
              <Pressable
                style={styles.button}
                onPress={() => {
                  addLogToDatabase();
                  resetForm();
                  closeCreateLogForm();
                  readLogsFromDatabase();
                }}
              >
                <Text style={styles.buttonText}>Confirm</Text>
              </Pressable>
              <Pressable
                style={styles.secondaryButton}
                onPress={() => {
                  resetForm();
                  closeCreateLogForm();
                }}
              >
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
  },
  container: {
    marginHorizontal: 30,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    marginBottom: 20,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "black",
  },
  secondaryButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "black",
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  secondaryButtonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "black",
  },
});
