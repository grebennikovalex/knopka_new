import React, { useState, useEffect, useCallback } from 'react'
import { View,  Text, FlatList, Dimensions, ImageBackground,
     Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { globalStyles } from './globalstyle'
import { db } from './config'
import firebase from 'firebase'
import { wasteImage } from './wasteitem'
import ItemDate from './date'
import { LinearGradient } from 'expo-linear-gradient'

const d = Dimensions.get('screen').width * 0.17

const History = ({ navigation }) => {

    const [user, setUser] = useState({})
    const [items, setItems] = useState([])
  
    useFocusEffect(

        useCallback(() => {
            
            setUser(firebase.auth().currentUser) 
       
          }, [])
    )

    useEffect(() => {

        user ? 
                db.ref('/users/' + user.uid).once('value', snapshot => {
                const newItems = Object.values(snapshot.val())
                console.log(newItems)
                setItems(newItems.filter(item => item.type))
                })
             : 
                setItems([])
     
    },[items.length, user])    

    const setItemHeight = (key) => {
        setItems((items) => {
            return items.map(item => {
            if (item.key == key) item.height ? item.height = false : item.height = true
            return item
            }).reverse()
        })
    }

    return(

        <View style = {[globalStyles.container, {backgroundColor: '#ccc', alignItems: 'stretch'}]}>
            <ImageBackground 
                    source = {require('./assets/knp_backG.png')}
                    style = {{alignItems: 'center', height: '100%', width: '100%'}}
                    imageStyle = {{resizeMode : 'repeat'}}>

            <LinearGradient
                        colors = {['transparent', '#ccc']}
                        start = {[0, 0.85]}
                        end = {[0, 1.0]}>
            <View style = { [globalStyles.headerWastes, {marginTop: 28}] }>
            <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                <Text style = {{fontSize: 25, paddingLeft: 0, paddingBottom: 5, fontFamily: 'icons', color: '#fff'}}>
                {'\uf3e5  '}
                </Text>
            </TouchableOpacity>
                    <Text style = {[globalStyles.text, {paddingLeft: 10, color: 'white'}]}>
                        МОИ ЗАКАЗЫ
                    </Text>
            </View>

            <View style = {{flex: 1 }}>

                {user ?  null :
                
                    <View style = {{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style = {globalStyles.text}> ВЫ ЕЩЕ НИЧЕГО НЕ ЗАКАЗАЛИ </Text>
                        <Text style={{fontWeight: 'bold', color: 'white', textAlign: 'center',
                         marginTop: d * 0.2, fontSize: d * 0.2}}> 
                            {'ЕСЛИ ВЫ ЗАКАЗЫВАЛИ РАНЕЕ,\nВОЙДИТЕ В СВОЙ ПРОФИЛЬ'} 
                        </Text>
                       
                    </View>}
                
                {!items.length ? 

                        <ActivityIndicator
                                animating={user ? true : false}
                                size = 'large'
                                color = 'white'
                                style = {{
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: 200
                                }}/>
                            :
               
                <FlatList
                    keyExtractor = {item => item.key}
                    data = {items.reverse()}
                    renderItem = {({item}) => (
                        <View style = {{
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'space-between', 
                            alignItems: 'flex-start',
                            backgroundColor: 'rgba(255,255,255,0.35)'
                            
                            }}>
                                <TouchableOpacity onPress = {() => setItemHeight(item.key)}>
                                    <View style = {{
                                                backgroundColor: item.process === 'PROCESSING' ? '#3dc1d3' : item.process === 'DONE' ? '#dfe4ea' : 'white',
                                                height: item.height ? d * 2 : d,
                                                width: Dimensions.get('screen').width * 0.78,
                                                paddingLeft: 10,
                                                padding: 3,
                                                borderTopRightRadius: d / 2,
                                                borderBottomRightRadius: d / 2,
                                                borderBottomLeftRadius: 10,
                                                borderTopLeftRadius: 10,
                                                marginRight: 5,
                                                margin: 5,
                                                elevation: 3,
                                                borderWidth: 2,
                                                borderColor: 'white',
                                                flexDirection: 'row',
                                                alignItems: 'flex-start',
                                                justifyContent: 'space-between'
                                                }}>
                                        <View>
                                            <Text style = {{fontFamily: 'custom', fontSize: d * 0.2, 
                                            color: item.process === 'PROCESSING' ? 'white' : 'gray'}}>
                                            
                                            {item.ecoconts ? (item.type + ' - емкостей ' + item.ecoconts) : (item.type + ' - ' + item.quantity + ' кг.')}
                                            
                                            </Text>

                                            <View style = {{width: d * 3}}>
                                                <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                                                <ItemDate  timestamp = {item.date} mode = 'full' textStyle = {style.textPlain}/>
                                                    <Text style={{paddingLeft: 10, fontFamily: 'custom', fontSize: d * 0.15,
                                                    color: item.process === 'PROCESSING' ? 'white' : item.process === 'DONE' ? 'gray' : '#303952'}}>
                                                    {item.process === 'PROCESSING' ? '- ПРИНЯТ' : item.process === 'DONE' ? '- ВЫВЕЗЕН' : '- В ОБРАБОТКЕ'}
                                                    </Text>
                                                </View>
                                                {item.height ?
                                                <View>
                                                    <Text style={style.textPlain}>{item.address}</Text>
                                                    <Text style={style.textPlain}>Лифт: {item.lift ? ' ЕСТЬ' : ' НЕТ'}</Text>
                                                    <View style = {{flexDirection: 'row'}}>
                                                        <Text style = {[style.textPlain, {fontWeight: 'bold'}]}>ВЫВОЗ: </Text> 
                                                        <ItemDate  timestamp = {item.removalDate} mode = 'full' textStyle = {style.textPlain}/>
                                                    </View>
                                                </View> : 
                                                    <View>
                                                        <Text style = {style.textBold}>...</Text>
                                                    </View>} 
                                                
                                            </View>    
                                        </View>
                                                <Image source = {wasteImage.wasteTypes[item.id]}
                                                style = {{height: d/1.5, width: d/1.5, marginRight: 5, marginTop: 5}}/>

                                                

                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity onPress = {() => navigation.navigate('Orderform', {values: item})}>
                                <View style = {{
                                        
                                        backgroundColor: '#f6b93b',
                                        height: d,
                                        width: d,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: 10,
                                        borderRadius: d / 2,
                                        borderWidth: 2,
                                        borderColor: 'white',
                                        elevation: 5,
                                        margin: 5
                                    
                                        }}>
                                    <Text style ={{fontFamily: 'custom', fontSize: d * 0.12, color: 'white'}}>ПОВТОР</Text>
                                    <Text style ={{fontFamily: 'custom', fontSize: d * 0.12, color: 'white'}}>ЗАКАЗА</Text>
                                </View>
                                </TouchableOpacity>

                        </View>
                    )}
                />}

              


            </View>
            </LinearGradient>
            </ImageBackground>   
        </View>
    )
}

export default History

const style = StyleSheet.create({
    textPlain: {
        fontSize: d * 0.2
    },

    textBold: {
        fontSize: d * 0.2,
        fontWeight: 'bold'
    },

})