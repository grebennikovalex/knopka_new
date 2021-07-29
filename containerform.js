import React, { useState, useCallback  } from 'react'
import { View,  Text, TouchableOpacity, TouchableWithoutFeedback, Alert,
     Keyboard, ImageBackground, Dimensions, Platform, Image, TextInput, ScrollView } from 'react-native'
import { globalStyles } from './globalstyle'
import { useFocusEffect } from '@react-navigation/native'
import { Formik } from 'formik'
// import { ScrollView } from 'react-native-gesture-handler'
import { uuid } from 'uuidv4'
import firebase from 'firebase'
import { db } from './config'
import { LinearGradient } from 'expo-linear-gradient'
// import { wasteImage } from './containeritem'


const d = Dimensions.get('screen').width
const orderString = '  ВЫВЕЗТИ КОНТЕЙНЕР  '

export default function Containerform ({ route, navigation }) {
   
    let initialValues = route.params.values
    
    const [user, setUser] = useState({})
    const [address, setAddress] = useState(true)
    

    useFocusEffect(

        useCallback(() => {
            
            setUser(firebase.auth().currentUser) 
                    
          }, [])
    )

    user ? initialValues.name = user.displayName : initialValues.name = 'волонтер'
    user ? initialValues.phone = user.photoURL : initialValues.phone = 'не указан'
    user ? initialValues.email = user.email : initialValues.email = 'не указан'
    
    let uid
    user ?  uid = user.uid : uid = 'anonimous' 

    const addOrder = item => {
                         
        db.ref('/containers/' + uid).push(item) 
        .then(Alert.alert(`ЗАПРОС НА ВЫВОЗ КОНТЕЙНЕРА №${item.num} "${item.type}" ОТПРАВЛЕН`))
        .then(navigation.navigate('Containers'))
        .catch(error => alert( error.message ))
       
    }
    
    

    return(
        <TouchableWithoutFeedback onPress = {Keyboard.dismiss}>
        <View style = {[globalStyles.container, { backgroundColor: initialValues.color}]}>
            <ImageBackground 
                        source = {require('./assets/knp_backG.png')}
                        style = {{flex: 1, alignItems: 'center', }}
                        imageStyle = {{resizeMode: 'repeat'}}>
            <LinearGradient
                        colors = {['transparent', Platform.OS === 'android' ? initialValues.color : 'transparent']}
                        start = {[0, 0.75]}
                        end = {[0, 0.9]}>
                <View style = {[globalStyles.orderheader, {justifyContent: 'flex-start', flexDirection: 'row'}]}>
                    <TouchableOpacity onPress={() => navigation.goBack(null)}>
                    <Text style = {{fontSize: 25, paddingLeft: 25, paddingBottom: 5, fontFamily: 'icons', color: '#fff'}}>
                    {'\uf3e5  '}
                    </Text>
                    </TouchableOpacity>
                    <Text style = {[globalStyles.text, {color: 'white'}]}>
                            { ' ' + initialValues.type + ' '}
                    </Text>
                </View>
        <ScrollView style = {{
            height: Dimensions.get('screen').height,
            
            }}>
        <View style = {globalStyles.ordercontainer}>
        <Image source = {{uri: route.params.values.image}}
                                style = {{height: d*0.8, width: d*0.8}}/>  

            
            <Formik
                    initialValues = {initialValues}
                    enableReinitialize = {true}
                    onSubmit = {(values) => {
                        values.key = uuid()
                        values.process = false
                        values.date = firebase.database.ServerValue.TIMESTAMP
                        values.num++
                        Keyboard.dismiss()
                        addOrder(values)
                    }}>
                
                    {props => (
                        <View style = {{width: '100%'}}>
                           
                        <View style={{flexDirection: 'row', alignSelf: 'center'}}>                     
                         {address ? <View style = { [globalStyles.input, {backgroundColor: 'transparent',
                                         borderWidth: 2, justifyContent: 'center', width: d*0.76} ] }>
                                        <Text style = {globalStyles.text}>
                                        {'Пл. №' + initialValues.placeId + ' - ' + props.values.place}
                                        </Text>
                                    </View>
                                    :
                                    <View>
                                    <TextInput
                                        style = { [globalStyles.input, { width: d*0.76} ]}
                                        placeholderTextColor = '#a5b1c2'
                                        placeholder = 'уточните адрес'
                                        onChangeText = {props.handleChange('place')}
                                        value = {props.values.place}
                                        />
                                    </View>}


                                <TouchableOpacity  onPress={() =>  {
                                    address ? setAddress(false) : setAddress(true)
                                    address ? initialValues.place = route.params.values.place : initialValues.place = ''
                                    }}>
                                <View style = { [globalStyles.input, {backgroundColor: 'transparent', paddingHorizontal: 0, backgroundColor: 'rgba(255,255,255,0.35)',
                                 borderWidth: 2, justifyContent: 'center', alignItems: 'center', width: d*0.12, 
                                 paddingLeft: 0, paddingRight: 0}]}>
                                    <Text style={{fontSize: d*0.05, fontFamily: 'icons', color: '#778ca3'}}>
                                         {'\uF303'}
                                    </Text>
                                </View>
                                </TouchableOpacity>
                        </View>


                            <View style = { [globalStyles.input, {backgroundColor: 'transparent', borderWidth: 2, justifyContent: 'center'} ] }>
                                <Text style = {globalStyles.text}>
                                    {'Контейнер №' + (initialValues.num + 1) + '   ' + initialValues.type}
                                </Text>
                            </View>

                            <TouchableOpacity
                                 onPress={props.handleSubmit}>
                                <View style = {[globalStyles.button,
                                    {
                                        backgroundColor: '#778ca3', 
                                        borderColor: '#b2bec3'
                                    }]}>
                                    <Text style = {globalStyles.text}>
                                         {orderString}     
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                       )}

            </Formik>
                 
                </View>
                </ScrollView>  

                {/* <TouchableOpacity
                        onPress = {() => {
                            navigation.goBack(null)
                            }}>
                             <View style = {[globalStyles.button,
                                    {
                                        backgroundColor: initialValues.color, 
                                        borderColor: initialValues.color
                                    }]}>

                                <Text style = {globalStyles.text}>
                                НАЗАД
                                </Text>
                            </View>
                    
                </TouchableOpacity>     */}
                </LinearGradient>                 
        </ImageBackground>
        
        </View>
        </TouchableWithoutFeedback>

    )
}