import { StatusBar } from "expo-status-bar";
import {
  FlatList,
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TextInput,
  Pressable,
} from "react-native";
import * as SQLite from "expo-sqlite";
import React, { useEffect, useState } from "react";

export default function App() {
  const db = SQLite.openDatabase("dreamlog.db");

  db.transaction((tx) => {
    tx.executeSql(
      "create table if not exists logs (id text primary key not null, date text, content text);"
    );
  });

  const [logs, setLogs] = useState([]);
  const [isCreateLogFormOpen, setIsCreateLogFormOpen] = useState(false);
  const [date, setDate] = useState(new Date().toLocaleDateString());
  const [content, setContent] = useState("");

  const openCreateLogForm = () => {
    setIsCreateLogFormOpen(true);
  };

  const closeCreateLogForm = () => {
    setIsCreateLogFormOpen(false);
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
    db.transaction((tx) => {
      tx.executeSql("select * from logs", [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        setLogs(temp);
      });
    });
  };

  const deleteLog = (id) => {
    db.transaction((tx) => {
      tx.executeSql("delete from logs where id = ?", [id], (tx, results) => {
        if (results.rowsAffected === 0) alert("Log not deleted");
      });
    });
  };

  useEffect(() => {
    readLogsFromDatabase();
  }, [addLogToDatabase]);

  const Log = ({ id, date, content }) => {
    return (
      <View style={styles.logContainer}>
        <View>
          <Text style={styles.date}>{date ? date : "No date"}</Text>
          <Text style={styles.content}>{content ? content : "No content"}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dream Log</Text>
        <Pressable style={styles.button} onPress={openCreateLogForm}>
          <Text style={styles.buttonText}>Add</Text>
        </Pressable>
      </View>

      <FlatList
        data={logs}
        renderItem={({ item }) => (
          <Log date={item.date} content={item.content} id={item.id} />
        )}
        keyExtractor={(item) => item.id}
      ></FlatList>
      <StatusBar style="auto" />

      <View
        style={[
          isCreateLogFormOpen ? { display: "flex" } : { display: "none" },
          {
            borderWidth: 1,
            borderColor: "black",
            padding: 10,
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
              closeCreateLogForm();
            }}
          >
            <Text style={styles.buttonText}>Add</Text>
          </Pressable>
          <Pressable
            style={styles.secondaryButton}
            onPress={closeCreateLogForm}
          >
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  date: {
    fontSize: 14,
    fontWeight: "bold",
  },
  content: {
    fontSize: 16,
    marginTop: 5,
  },
  logContainer: {
    zIndex: 2,
    marginBottom: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
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
