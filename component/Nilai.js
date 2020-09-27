import React, { useState, useEffect } from 'react';
import { FlatList, View, SafeAreaView, Modal,StyleSheet, TouchableHighlight,TouchableOpacity, Alert } from 'react-native';
import {  List, ListItem, Thumbnail, Text, Left, Body, Right, Button, Badge,Icon,Title, Header, Input,Item,Label,Form }from 'native-base';
import SQLite from 'react-native-sqlite-storage';
import { TextInput } from 'react-native-gesture-handler';

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
        SQLite.DEBUG = true;
        const [modalVisible, setModalVisible] = useState(false);
        const [nama, setNama] = useState('');
        const [user, setUser] = useState([]);
        const [pertandingan, setPertandingan] = useState([])
        const [idPertandingan, setIdPertandingan] = useState([])
        const [loading, setLoading] = useState(false);
        useEffect(() => {
            getAllPertandingan();
            getAllUser();
        }, []);

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

        const getAllUser = async ()=>{
            let selectQuery = await ExecuteQuery("SELECT * FROM user",[]);
            var rows = selectQuery.rows;
            var temp = [];
            for (let i = 0; i < rows.length; i++) {
                var item = rows.item(i);
                temp.push(item);
            }
            setUser(temp);
        }

        const getAllPertandingan = async ()=>{
            let selectQuery = await ExecuteQuery("SELECT * FROM pertandingan",[]);
            var rows = selectQuery.rows;
            var temp = [];
            for (let i = 0; i < rows.length; i++) {
                var item = rows.item(i);
                temp.push(item);
            }
            setPertandingan(temp);
        }

        const insertPertandingan=()=>{
            var a = new Date();
            var tgl = a.getDate();
            var bln = a.getMonth()+1;
            var thn = a.getFullYear();
            var tanggal = tgl+'-'+bln+'-'+thn;
            if(nama){
                db.transaction(function (tx) {
                    tx.executeSql(
                        'INSERT INTO pertandingan (nama,tgl) VALUES (?,?)',
                        [nama,tanggal],
                        (tx, results) => {
                            console.log('Results', results.insertId);
                            setIdPertandingan(results.insertId);
                            getAllPertandingan();
                            insertNilai(results.insertId);
                            setNama('');
                            if (results.rowsAffected > 0) {
                            alert('Success');
                            setModalVisible(!modalVisible);
                            } else alert('Registration Failed');
                        },(error) => {
                            console.log(error);
                        }
                    );
                });
            }else{
                alert('Registration Failed');
            }
        }

        const insertNilai= async (idPer)=>{
            var result = [];
            for (let i = 0; i < user.length; i++) {
                result[i] = new nilaiPemain(user[i].id,idPer);
            }

            let query = "INSERT INTO nilai (user_id, pertandingan_id, k_servis, p_servis, k_passing, p_passing, k_smash, p_smash, k_block, p_block, k_diven, p_diven, jumlah_p, jumlah_k) VALUES";
            for (let i = 0; i < result.length; ++i) {
                query = query + "('"
                    + result[i].user_id //id
                    + "','"
                    + result[i].pertandingan_id //first_name
                    + "','"
                    + result[i].k_servis //first_name
                    + "','"
                    + result[i].p_servis //first_name
                    + "','"
                    + result[i].k_passing //first_name
                    + "','"
                    + result[i].p_passing //first_name
                    + "','"
                    + result[i].k_smash //first_name
                    + "','"
                    + result[i].p_smash //first_name
                    + "','"
                    + result[i].k_block //first_name
                    + "','"
                    + result[i].p_block //first_name
                    + "','"
                    + result[i].k_diven //first_name
                    + "','"
                    + result[i].p_diven //last_name
                    + "','"
                    + result[i].jumlah_k //last_name
                    + "','"
                    + result[i].jumlah_p //is_deleted
                    + "')";
                if (i != result.length - 1) {
                    query = query + ",";
                }
            }
            query = query + ";";
            console.log(query);
        
            let multipleInsert = await ExecuteQuery(query, []);
            console.log(multipleInsert);

            function nilaiPemain(id,id2){
                this.user_id = id;
                this.pertandingan_id = id2;
                this.k_servis = 0;
                this.p_servis = 0;
                this.k_passing = 0;
                this.p_passing = 0;
                this.k_smash = 0;
                this.p_smash = 0;
                this.k_block = 0;
                this.p_block = 0;
                this.k_diven = 0;
                this.p_diven = 0;
                this.jumlah_p = 0;
                this.jumlah_k = 0;
            }
        }

        const detailNilai = async (id)=>{
            let selectQuery = await ExecuteQuery("SELECT * FROM nilai WHERE pertandingan_id = ?",[id]);
            var rows = selectQuery.rows;
            var temp = [];
            for (let i = 0; i < rows.length; i++) {
                var item = rows.item(i);
                temp.push(item);
            }
            console.log(temp);
        }

    const coba=()=>{
        return pertandingan.map((item)=>(
            <View key={item.id}>
                <Text>{item.nama}</Text>
                <TouchableOpacity onPress={()=>{detailNilai(item.id)}}>
                    <Badge>
                    <Text>Nilai</Text>
                    </Badge>
                </TouchableOpacity>
            </View>
        ))
        
    }



    const listItemView = (item,i) => {
        return (
        <View
            key={item.id}
            style={{ backgroundColor: 'white', padding: 0 }}>
            <List>
                <ListItem thumbnail>
                <Body>
                    <Text style={{ fontSize:25, fontWeight:'bold', fontFamily:'arial' }}>{item.id}</Text>
                    <View style={{ flex:1, flexDirection:'row'}}>
                    <TouchableOpacity onPress={()=>{updateNilai(item.id,'k_smash')}}>
                        <Badge style={styles.badge}>
                        <Text style={ styles.nilaiText}>Servis</Text>
                        </Badge>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Badge style={styles.badge}>
                        <Text style={ styles.nilaiText}>Passing</Text>
                        </Badge>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Badge style={styles.badge}>
                        <Text style={ styles.nilaiText}>Smash</Text>
                        </Badge>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Badge style={styles.badge}>
                        <Text style={ styles.nilaiText}>Block</Text>
                        </Badge>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Badge style={styles.badge}>
                        <Text style={ styles.nilaiText}>Diven</Text>
                        </Badge>
                    </TouchableOpacity>
                    </View>
                    <View style={{ flex:1, flexDirection:'row', marginTop:3}}>
                    <TouchableOpacity onPress={()=>{console.log(user);}}>
                        <Badge success style={styles.badge}>
                        <Text style={ styles.nilaiText}>Servis</Text>
                        </Badge>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Badge success style={styles.badge}>
                        <Text style={ styles.nilaiText}>Passing</Text>
                        </Badge>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Badge success style={styles.badge}>
                        <Text style={ styles.nilaiText}>Smash</Text>
                        </Badge>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Badge success style={styles.badge}>
                        <Text style={ styles.nilaiText}>Block</Text>
                        </Badge>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Badge success style={styles.badge}>
                        <Text style={ styles.nilaiText}>Diven</Text>
                        </Badge>
                    </TouchableOpacity>
                    </View>
                </Body>
                <Right>
                    <View style={{ flex:1, flexDirection:'row' }}>
                        <Text style={{ color:'red', fontSize:20, margin:5 }}>K: {item.k_smash}</Text>
                        <Text style={{ color:'green', fontSize:20, margin:5 }}>P: </Text>
                    </View>
                </Right>
                </ListItem>
            </List>
        </View>
        );
    };

    const FLay=()=>{
        return(
            <FlatList
            data={pertandingan}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => listItemView(item)}
        />
        );
    }

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
                <Title>Penilaian</Title>
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
                <Text style={styles.modalText}>Buat Pertandingan</Text>
                <View style={{ height:60 }}>
                <TextInput style={{ height: 40, borderColor: 'gray', borderWidth: 1, borderRadius:20, width:200, textAlign:'center' }} onChangeText={text => setNama(text)} value={nama}/>
                </View>
                <View style={{ flex:1, flexDirection:'row' }}>
                <TouchableHighlight
                    style={{ ...styles.openButton, backgroundColor: "green", height:40, marginRight:4 }}
                    onPress={() => {
                    insertPertandingan();
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
                {coba()}
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
        fontSize:15
    },
    badge:{
        margin:1
    }
    });
    export default ViewAllUser;