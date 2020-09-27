import React, { useState, useEffect } from 'react';
import { FlatList, View, SafeAreaView, Modal,StyleSheet, TouchableHighlight,Alert } from 'react-native';
import {  List, ListItem, Thumbnail, Text, Left, Body, Right, Button, Badge,Icon,Title, Header, Input,Item,Label,Form } from 'native-base';
import { TextInput } from 'react-native-gesture-handler';
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

const ViewAllUser = () => {
    let [flatListItems, setFlatListItems] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [nama, setNama] = useState('');
    useEffect(() => {
        getAllUser();
    }, []);

    const getAllUser=()=>{
      db.transaction((tx) => {
        tx.executeSql('SELECT * FROM user', [], (tx, results) => {
            var temp = [];
            for (let i = 0; i < results.rows.length; ++i){
                temp.push(results.rows.item(i));
            }
            setFlatListItems(temp);
            console.log(flatListItems);
        },
          (error) => {
              console.log(error);
          });
      });
    }

    const deleteUser=(id)=>{
      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM user where id = ?',
          [id],
          (tx, results) => {
            console.log('Results', results.rowsAffected);
            getAllUser();
            if (results.rowsAffected > 0) {
              alert('Delete Success')
            }
          }
        );
      });
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
        { text: "OK", onPress: () => deleteUser(id) }
      ],
      { cancelable: false }
    );

    const insertUser=()=>{
      console.log(nama);
      if(nama){
        db.transaction(function (tx) {
          tx.executeSql(
              'INSERT INTO user (nama) VALUES (?)',
              [nama],
              (tx, results) => {
                  console.log('Results', results.rowsAffected);
                  getAllUser();
                  setNama('');
                  if (results.rowsAffected > 0) {
                  alert('Success');
                  setModalVisible(!modalVisible);
                  } else alert('Registration Failed');
              }
          );
      });
      }else{
        alert('Registration Failed');
      }
    }


  let listItemView = (item) => {
    return (
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
                <Text>Forsa Team</Text>
              </Body>
              <Right>
                {/* <Badge small info>
                  <Text>Edit</Text>
                </Badge> */}
                <TouchableHighlight onPress={()=>{alertButton(item.id,item.nama)}}>
                  <Badge small danger>
                    <Text>Hapus</Text>
                  </Badge>
                </TouchableHighlight>
              </Right>
            </ListItem>
          </List>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Header>
          <Left>
            <Button transparent>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>List Pemain</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => {
          setModalVisible(true);
        }}>
              <Icon name='add' />
            </Button>
          </Right>
        </Header>
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Tambah Pemain</Text>
            <View style={{ height:60 }}>
              <TextInput style={{ height: 40, borderColor: 'gray', borderWidth: 1, borderRadius:20, width:200, textAlign:'center' }} onChangeText={text => setNama(text)} value={nama}/>
            </View>
            <View style={{ flex:1, flexDirection:'row' }}>
              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: "green", height:40, marginRight:4 }}
                onPress={() => {
                  insertUser();
                }}
              >
                <Text style={styles.textStyle}>Tambahkan</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: "red", height:40 }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.textStyle}>Kembali</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
        <View style={{ flex: 1 }}>
          <FlatList
            data={flatListItems}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => listItemView(item)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    height:200,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  nilaiText:{
    fontSize:11
  }
});
export default ViewAllUser;