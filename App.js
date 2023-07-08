import { StatusBar } from "expo-status-bar";
import { FlatList, StyleSheet, SafeAreaView, Text, View } from "react-native";
import * as SQLite from "expo-sqlite";
import React, { useEffect, useState } from "react";

const Log = ({ date, content }) => (
  <View>
    <Text>{date}</Text>
    <Text>{content}</Text>
  </View>
);

export default function App() {
  const db = SQLite.openDatabase("dreamlog.db");

  db.transaction((tx) => {
    tx.executeSql(
      "create table if not exists logs (id text primary key not null, date text, content text);"
    );
    tx.executeSql(
      "insert into logs (id, date, content) values ('1', 'July 7, 2023', 'Friends laughing at me');"
    );
    tx.executeSql(
      "insert into logs (id, date, content) values ('2', 'July 8, 2023', 'Monsters celebrating my birthday');"
    );
  });

  const [logs, setLogs] = useState([
    {
      id: "1",
      date: "July 8, 2023",
      content: "Default log",
    },
  ]);

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

  useEffect(() => {
    readLogsFromDatabase();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text>Dream Log</Text>

      <FlatList
        data={logs}
        renderItem={({ item }) => (
          <Log date={item.date} content={item.content} />
        )}
        keyExtractor={(item) => item.id}
      ></FlatList>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginLeft: 30,
    marginTop: 50,
  },
});
