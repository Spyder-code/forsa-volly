import React, { Component, useState, useEffect } from 'react';
import { View,Text, Button } from "native-base";
import SQLite from 'react-native-sqlite-storage';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    StatusBar,
    TouchableOpacity,
  } from 'react-native';
global.db = SQLite.openDatabase(
{
        name: 'forsa',
        location: 'default',
        createFromLocation: '~forsa.sqlite',
        },
    () => { },
    error => {
        console.log("ERROR: " + error);
    }
);

const Home = ()=> {
    const [user, setUser] = useState([])

    const ExecuteQuery = (sql, params = []) => new Promise((resolve, reject) => {
        db.transaction((trans) => {
          trans.executeSql(sql, params, (trans, results) => {
            resolve(results);
          },
            (error) => {
              reject(error);
            });
        });
      });

    const SelectQuery=()=>{
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM user', [], (tx, results) => {
                var temp = [];
                for (let i = 0; i < results.rows.length; ++i){
                    temp.push(results.rows.item(i));
                }
                setUser(temp);
            },
            (error) => {
                console.log(error);
            });
        });
    }
    
    const DeleteQuery=(idUser)=>{
        let deleteQuery = ExecuteQuery('DELETE FROM user WHERE id = ?', [idUser]);
        console.log(deleteQuery);
    }
    
    const InsertQuery=(nama)=> {
        let singleInsert = ExecuteQuery('INSERT INTO user (nama) VALUES (? , ?)', [nama]);
        console.log(singleInsert);
    }
    
    const UpdateQuery=(id,nama)=>{
        let updateQuery = ExecuteQuery('UPDATE user SET nama = ? WHERE id = ?', [nama, id]);
    
        console.log(updateQuery);
    }

    const handle=()=>{
        console.log('yes isr');
    }
    
        return (
            <View>
                <Button
                    onPress={() => {
                        handle()
                    }}
                    
                >
                    <Text>Press me</Text>
                </Button>
            </View>
        );
    
}

export default Home;