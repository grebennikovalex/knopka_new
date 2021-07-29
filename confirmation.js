import React, { useState, useRef, useEffect } from 'react'
import { View,  Text, TouchableOpacity, Alert, Dimensions, ImageBackground } from 'react-native'
import { globalStyles } from './globalstyle'
import Check from './check'
import firebase from 'firebase'
import { db } from './config'
import ItemDate from './date'
import * as Notifications from 'expo-notifications'
import * as Permissions from 'expo-permissions'

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  })



const Confirmation = ({ route, navigation }) => {

    const [notification, setNotification] = useState(false)
    const notificationListener = useRef()
    const responseListener = useRef()

    const [user, setUser] = useState({})
    const [token, setToken] = useState('')
    
    const [persData, setPersData] = useState(false)
    const [orderNum, setOrderNum] = useState(0)

    const  registerForPush = async () => {
        let token
        const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS)
        let finalStatus = existingStatus
        if (existingStatus !== 'granted') {
          const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
          finalStatus = status
        }
        if (finalStatus !== 'granted') {
          alert('Уведомления заблокированы...')
          return
        }
        token = (await Notifications.getExpoPushTokenAsync()).data
       
        // notifications style Android
      
        if (Platform.OS === 'android') {
          Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#eee',
          })
        }
      
        return token
    }


useEffect(() => {

    setUser(route.params.user)
    
        db.ref('/counters/orders').once('value').then(snapshot => {
                setOrderNum(snapshot.val())
                })
         
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
                   setNotification(notification)
                 })
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
                   console.log(response)
                 })
        return () => {
                   Notifications.removeNotificationSubscription(notificationListener)
                   Notifications.removeNotificationSubscription(responseListener)
                 }
}, [])

useEffect(() => {
   if(user && token) db.ref('/users/' + user.uid + '/token/').set({ token: token })
}, [user, token])

const values = route.params.values
// let user = route.params.user
let company = route.params.company


const addOrder = item => {
    item.date = firebase.database.ServerValue.TIMESTAMP
    db.ref('/counters').update({orders: orderNum + 1})
    item.process = false
    item.order = orderNum + 1
    db.ref('/users/' + user.uid).push(item)
    .then(Alert.alert('ВАШ ЗАКАЗ ОТПРАВЛЕН'))
    .then(navigation.navigate('History'))
    .catch(error => alert( error.message ))
}

const createUser = (values, company) => {
    
    firebase.auth().createUserWithEmailAndPassword(values.email, values.phone)

            .then(user => {

                user = firebase.auth().currentUser
                setUser(user) 
                 
                user.updateProfile({
                    displayName: values.name,
                    photoURL: values.phone
                })
                .catch(error => {
                    
                    Alert.alert( error.message )
                    navigation.navigate('Orderform')
                })
                
                
                return user

            }).then(user => {

                registerForPush().then(token => setToken(token))

                values.date = firebase.database.ServerValue.TIMESTAMP
                db.ref('/counters').update({orders: orderNum + 1})
                values.process = false
                values.order = orderNum + 1
                db.ref('/users/' + user.uid).push(values)
                .then(() => db.ref('/users/' + firebase.auth().currentUser.uid + '/company').set({company}))
                .then(Alert.alert(' ПОЗДРАВЛЯЕМ! \n ВАШ ПЕРВЫЙ ЗАКАЗ ОТПРАВЛЕН!'))
                .then(navigation.navigate('History'))
                                               
                .catch(error => {
                    
                    Alert.alert( error.message )
                    navigation.navigate('Orderform')
                    
                })
                

            }).catch(error => {
                if(error.code === 'auth/email-already-in-use') {
                    firebase.auth().signInWithEmailAndPassword(values.email, values.phone)

                    .then(user => {
                        user = firebase.auth().currentUser
                        values.date = firebase.database.ServerValue.TIMESTAMP
                        db.ref('/counters').update({orders: orderNum + 1})
                        values.process = false
                        values.order = orderNum + 1
                        db.ref('/users/' + user.uid).push(values)
                        .then(() => db.ref('/users/' + firebase.auth().currentUser.uid + '/company').set({company}))
                        .then(Alert.alert('ВАШ ЗАКАЗ ОТПРАВЛЕН'))
                        .then(navigation.navigate('History'))
                        
                    })

                    .catch(error => {
                        if(error.code === 'auth/wrong-password') Alert.alert('НЕПРАВИЛЬНЫЙ НОМЕР ТЕЛЕФОНА')
                        if(error.code === 'auth/invalid-email')  Alert.alert('НЕПРАВИЛЬНЫЙ АДРЕС ЭЛЕКТРОННОЙ ПОЧТЫ')
                        if(error.code === 'auth/user-not-found') Alert.alert('ПОЛЬЗОВАТЕЛЬ НЕ НАЙДЕН')
                        if(error.code === 'auth/user-disabled')  Alert.alert('ПОЛЬЗОВАТЕЛЬ ОТКЛЮЧЕН')
                    })
                }
                if(error.code === 'auth/invalid-email') { 
                    Alert.alert('НЕПРАВИЛЬНЫЙ АДРЕС ЭЛЕКТРОННОЙ ПОЧТЫ')
                    navigation.navigate('Orderform')
                }
                if(error.code === 'auth/operation-not-allowed') {
                    Alert.alert('ОШИБКА СЕРВЕРА')
                    navigation.navigate('Orderform')
                }
                if(error.code === 'auth/weak-password') {
                    Alert.alert('ИСПОЛЬЗУЙТЕ НАСТОЯЩИЙ НОМЕР ТЕЛЕФОНА')
                    navigation.navigate('Orderform')
                }
            })
} 

return (

<View style = {[globalStyles.container, {backgroundColor: '#ced6e0', alignItems: 'center', justifyContent: 'space-between' }]}>
<ImageBackground 
            source = {require('./assets/knp_backG.png')}
            style = {{flex: 1, alignItems: 'center', width: '100%'}}
            imageStyle = {{resizeMode : 'repeat'}}>

    <View style = {{
            alignItems: 'center',
            width: Dimensions.get('screen').width * 0.8,
            marginTop: 50,
            paddingTop: 20,
            backgroundColor: 'white', 
            elevation: 3, 
            borderRadius: 10, 
            borderColor: '#dfe6e9', 
            borderWidth: 2, 
            
            }}>

        <Text style = {{marginBottom: 10}}>|| ВЫВОЗИМ ||</Text>

        <Text style = {[globalStyles.text, {color: 'gray', marginBottom: 10}]}>
      
                {values.type === 'ЭКО ОФИС' ? ('Емкостей - ' + values.ecoconts) : (values.type + ' - ' + values.quantity + ' кг.')}
        </Text>
        <View style = {{width: '90%'}}>
            <Text>{values.name}</Text>
            {company ? <Text>КОМПАНИЯ: {company}</Text> : null}
            <Text>АДРЕС:  {values.address}</Text>
            <Text>ТЕЛЕФОН:  {values.phone}</Text>
            <Text>E-mail:  {values.email}</Text>
            <Text>ЭТАЖ:  {values.floor}</Text>
            <Text>ЛИФТ: {values.lift ? ' ЕСТЬ' : ' НЕТ'}</Text>
            <View style = {{flexDirection: 'row'}}>
                <Text>ДАТА ВЫВОЗА: </Text>
                <ItemDate  timestamp = {values.removalDate} mode = 'full'/>
            </View>
            
        </View>
       
        
       
        
        <View style = {{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '90%', 
                    paddingHorizontal: 5, 
                    paddingVertical: 5, 
                    margin: 10, 
                    backgroundColor: 'white',
                                    
                    }}>
            <View style={{ width: '80%'}}>
                <Text>Подтвердите согласие на обработку персональных данных:</Text>
            </View>
                        <View style = {{justifyContent: 'center' }}>
                            <Check  
                            value = {persData}
                            onPress = {() => persData ? setPersData(false) : setPersData(true)}
                            />
            </View>



    </View>
    <TouchableOpacity
            style = {{width: '100%', alignItems: 'center'}}  
            disabled = {!persData}
            onPress = {() => {!user ? 
                    createUser(values, company) 
                    : addOrder(values)
                    
                    }}>
            <View style = { [persData ? globalStyles.activeButton : globalStyles.passiveButton, {width: '90%', marginVertical: 20}]}>
               <Text style = {{fontFamily: 'custom', color: 'white'}}> ПОДТВЕРДИТЬ ЗАКАЗ</Text>
            </View>
        </TouchableOpacity>    
    
    
    </View>
       
    </ImageBackground>   

    <TouchableOpacity
            style = {{width: '100%', alignItems: 'center'}}
            onPress = {() => {
            setPersData(false)
            navigation.goBack(null)
            }}>
                <View style = {[globalStyles.passiveButton, {width: '80%', backgroundColor: 'white', marginBottom: 20}]}>
                    <Text style = {{fontFamily: 'custom', color: '#b2bec3'}}> ОТМЕНИТЬ </Text>
                </View>    

        </TouchableOpacity>

</View> 


)}

export default Confirmation