import { StatusBar } from "expo-status-bar";
import {
  FlatList,
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TextInput,
  Pressable,
  RefreshControl,
} from "react-native";
import * as SQLite from "expo-sqlite";
import React, { useEffect, useState } from "react";
import Log from "./components/Log";

// Be careful with the database name
const db = SQLite.openDatabase("db.db");

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
    db.transaction((tx) => {
      tx.executeSql(
        "insert into logs (id, date, content) values (?, ?, ?)",
        [Math.random().toString(), date, content],
        (tx, results) => {
          if (results.rowsAffected === 0) alert("Log not added");
        }
      );
    });
  };

  const readLogsFromDatabase = () => {
    setRefreshing(true);
    db.transaction((tx) => {
      tx.executeSql("select * from logs", [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        setLogs(temp);
      });
    });
    setRefreshing(false);
  };

  useEffect(() => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "create table if not exists logs (id text primary key not null, date text, content text);"
        );
      },
      (error) => {
        console.log("Error creating table: " + error);
      }
    );
    readLogsFromDatabase();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dream Log</Text>
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
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
  },
  container: {
    marginHorizontal: 30,
    marginTop: 50,
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
