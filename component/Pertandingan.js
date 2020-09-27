import { View } from 'native-base';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { FlatList, SafeAreaView, Modal,StyleSheet,Alert, TouchableOpacity } from 'react-native';
import {  List, ListItem, Thumbnail, Text, Left, Body, Right, Button, Badge,Icon,Title, Header, Input,Item,Label,Form } from 'native-base';
import SQLite from 'react-native-sqlite-storage';

global.db = SQLite.openDatabase(
    {
        name: 'volly',
        location: 'default',
        createFromLocation: '~volly.sqlite',
        },
        () => { },
        error => {
            console.log("ERROR: " + error);
        }
    );
const Pertandingan = () => {

    SQLite.DEBUG = true;

    const [pertandingan, setPertandingan] = useState([]);

    useEffect(() => {
        getAllPertandingan();
    }, [])

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
    
    const getAllPertandingan= async ()=>{
        let selectQuery = await ExecuteQuery("SELECT * FROM pertandingan",[]);
        var rows = selectQuery.rows;
        var temp = [];
        for (let i = 0; i < rows.length; i++) {
            var item = rows.item(i);
            temp.push(item);
        }
        setPertandingan(temp);
    }

    const deletePertandingan = async (id)=>{
        let deleteQuery = await ExecuteQuery('DELETE FROM pertandingan WHERE id = ?', [id]);
        console.log(deleteQuery);
        getAllPertandingan();
    }

    const alertButton = (id,nama) =>
        Alert.alert(
        "Are you sure?",
        "Menghapus "+nama,
        [
            {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
            },
            { text: "OK", onPress: () => deletePertandingan(id) }
        ],
        { cancelable: false }
    );

    const ListPertandingan=(item)=>{
        return(
            <View
                key={item.id}
                style={{ backgroundColor: 'white', padding: 20 }}>
                <List>
                    <ListItem thumbnail>
                    <Left>
                        <Thumbnail square source={require('../assets/default.jpg') } />
                    </Left>
                    <Body>
                        <Text style={{ fontSize:24, fontWeight:'bold' }}>{item.nama}</Text>
                        <Text>{item.tgl}</Text>
                    </Body>
                    <Right>
                        <View style={{ flex:1, flexDirection:'row' }}>
                        <TouchableOpacity onPress={()=>{alertButton(item.id,item.nama)}} style={{ marginRight:3, marginTop:'auto' }}>
                            <Badge small danger>
                                <Text>Hapus</Text>
                            </Badge>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{console.log('print');}} style={{ marginRight:3, marginTop:'auto' }}>
                            <Badge small success>
                                <Text>Print</Text>
                            </Badge>
                        </TouchableOpacity>
                        </View>
                    </Right>
                    </ListItem>
                </List>
            </View>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ flex: 1 }}>
            <FlatList
                data={pertandingan}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => ListPertandingan(item)}
            />
            </View>
        </View>
        </SafeAreaView>
    );
}

export default Pertandingan;