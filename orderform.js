import React, { useState, useEffect  } from 'react'
import { View,  Text, TouchableOpacity, TouchableWithoutFeedback, Alert,
     Keyboard, Switch, ImageBackground, Dimensions, Platform, ActivityIndicator,  TextInput, ScrollView } from 'react-native'
import { globalStyles } from './globalstyle'
import { Formik } from 'formik'
// import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'
import firebase from 'firebase'
import { db } from './config'
import DateTimePicker from '@react-native-community/datetimepicker'
import { LinearGradient } from 'expo-linear-gradient'
import ItemDate from './date'
import * as Permissions from 'expo-permissions'
import * as Location from 'expo-location'
// import * as yup from 'yup'

// const schema = yup.object({
//     company: yup.string().required().min(4)  
// })


const d = Dimensions.get('screen').width
const orderString = '  ЗАКАЗАТЬ  '

export default function Orderform ({ route, navigation }) {
   
    let initialValues = route.params.values
    let initialDate = initialValues.removalDate ? new Date (initialValues.removalDate) : new Date()

    const [lift, setLift] = useState(initialValues.lift)
    const [user, setUser] = useState({})

    const [date, setDate] = useState(new Date(initialDate))
    const [time, setTime] = useState(new Date(initialDate))
  
    const [showTime, setShowTime] = useState(false)
    const [showDate, setShowDate] = useState(false)

    const [location, setLocation] = useState({})
    const [where, setWhere] = useState()
    const [address, setAddress] = useState()

    const [entity, setEntity] = useState(true)

    const [company, setCompany] = useState('')
    const [newCompany, setNewCompany] = useState('')

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date
        setShowDate(Platform.OS === 'ios' ? true : false)
        setDate(currentDate)
        
      }
    
      const onTimeChange = (event, selectedTime) => {
        const currentTime = selectedTime || time
        setShowTime(Platform.OS === 'ios' ? true : false)
        setTime(currentTime)
        
      }
    
      let today = new Date(time.getFullYear(), time.getMonth(), time.getDate())
      let diff = time - today
      let dateTemp = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() + diff 
      let dateFinal = new Date(dateTemp)
    

    useEffect(() => {
      

            getLocationAsync()
            
            setUser(firebase.auth().currentUser) 

            user ?

            db.ref('/users/' + user.uid + '/company').once('value', snapshot => {
                setCompany(snapshot.val().company)
                })
            :
                setCompany('')

            setAddress(where ?
                (where.where.street ? where.where.street + ', ' : '') +
                (where.where.name ? where.where.name + ', ' : '') +
                where.where.city + ', ' +
                // where.where.region + ', ' +
                // where.where.country + ', ' +
                where.where.postalCode : '' ) 

            // console.log(where)
                    
    },[user]) 

    const getLocationAsync = async () => {

        let {status} = await Permissions.askAsync(Permissions.LOCATION)
            if (status === 'granted') {
                let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true })
                setLocation(location)
                let where = (await Location.reverseGeocodeAsync(location.coords))[0]
                setWhere({where})

                setAddress(where ?
                    (where.street ? where.street + ', ' : '') +
                    (where.name ? where.name + ', ' : '') +
                    where.city + ', ' +
                    // where.where.region + ', ' +
                    // where.where.country + ', ' +
                    where.postalCode : '' ) 

            } else {
                throw new Error('Location permission not granted')
            }
    }   

    user ? initialValues.name = user.displayName : initialValues.name = ''
    user ? initialValues.phone = user.photoURL : initialValues.phone = '+7'
    user ? initialValues.email = user.email : initialValues.email = ''

    if(!initialValues.address)  initialValues.address = address
        
    const submitCompany = company => {

        db.ref('/users/' + firebase.auth().currentUser.uid + '/company').set({company})
        db.ref('/users/' + user.uid + '/company').once('value', snapshot => {
            setCompany(snapshot.val().company)
            })
    }
    
 
    return(
        <TouchableWithoutFeedback onPress = {Keyboard.dismiss}>
        <View style = {[globalStyles.container, { backgroundColor: initialValues.color, paddingTop: 0 }]}>
            <ImageBackground 
                        source = {require('./assets/knp_backG.png')}
                        style = {{flex: 1, alignItems: 'center', }}
                        imageStyle = {{resizeMode : 'repeat'}}>
            <LinearGradient
                        colors = {['transparent', Platform.OS === 'android' ? initialValues.color : 'transparent']}
                        start = {[0, 0.75]}
                        end = {[0, 0.9]}>
                <View style = {[globalStyles.orderheader, {justifyContent: 'flex-start', flexDirection: 'row', marginBottom: 5}]}>
                    <TouchableOpacity onPress={() => navigation.goBack(null)}>
                    <Text style = {{fontSize: 25, paddingLeft: 25, paddingBottom: 5, fontFamily: 'icons', color: '#fff'}}>
                    {'\uf3e5  '}
                    </Text>
                    </TouchableOpacity>
                    <Text style = {[globalStyles.text, {color: 'white'}]}>
                            { ' ' + initialValues.type + ' ' }
                    </Text>
                </View>
        <ScrollView style = {{ height: Dimensions.get('screen').height }}>
        <View style = {globalStyles.ordercontainer}>

         

        
  
            <Formik
                    initialValues = {initialValues}
                    onSubmit = {values => {
                        
                        values.entity = entity
                        values.key = uuidv4()
                        values.lift = lift
                        values.process = false
                        values.removalDate = dateFinal.getTime()
                        // if(values.entity && !company) {
                        //     Alert.alert('Введите название компании...')
                        //     return null
                        // }
                        if(values.quantity === '') values.quantity = 0
                        if(values.type === 'ЭКО ОФИС' && !values.ecoconts) {
                            Alert.alert('Введите количество вывозимых емкостей...')
                            return null
                        }
                        Keyboard.dismiss()
                        if(user)submitCompany(newCompany ? newCompany : company)
                        navigation.navigate('Confirmation', { values, user, company: entity ? (newCompany ? newCompany : company) : null})
                    }}>
                
                    {props => (
                        <View style = {{width: '100%'}}>

                            
                          

                            {user ?
                            <View style = {[globalStyles.input, {backgroundColor: 'transparent', borderWidth: 2, justifyContent: 'center'}]}>
                                <Text style = {globalStyles.text}>
                                    {user.displayName}
                                </Text>
                            </View>

                            :

                            <View>
                            <Text style = {{marginLeft: 25}}>Ваше имя *:</Text>
                            <TextInput
                                style = { globalStyles.input }
                                placeholderTextColor = '#a5b1c2'
                                placeholder = 'Имя Фамилия'
                                onChangeText = {props.handleChange('name')}
                                value = {props.values.name}
                               
                            />
                            </View>}
                   
                            {user ? 
                            <View style = { [globalStyles.input, {backgroundColor: 'transparent', borderWidth: 2, justifyContent: 'center'} ] }>
                                <Text style = {globalStyles.text}>
                                    {user.photoURL}
                                </Text>
                            </View>
                     
                            :

                            <View>
                            <Text style = {{marginLeft: 25}}>Номер телефона *:</Text>
                            <TextInput
                                style = { globalStyles.input }
                                placeholderTextColor = '#a5b1c2'
                                placeholder = 'мобильный телефон'
                                onChangeText = {props.handleChange('phone')}
                                value = {props.values.phone}
                                keyboardType = 'numeric'
                             
                            />
                            </View>}

                            {user ?
                            <View style = { [globalStyles.input, {backgroundColor: 'transparent', borderWidth: 2, justifyContent: 'center'} ] }>
                                <Text style = {globalStyles.text}>
                                    {user.email}
                                </Text>
                                
                            </View>
                    
                            :
                            
                            <View>
                            <Text style = {{marginLeft: 25}}>Адрес электронной почты *:</Text>
                            <TextInput
                                style = {globalStyles.input}
                                placeholderTextColor = '#a5b1c2'
                                placeholder = 'e-mail'
                                onChangeText = {props.handleChange('email')}
                                value = {props.values.email}
                                keyboardType = 'email-address'
                                
                                
                            />
                            </View>}

                            <View style={{alignSelf: 'center', alignItems: 'center', width: d*0.9, paddingLeft: 10, flexDirection: 'row', height: d*0.1, justifyContent: 'space-between'}}>
                                <Text style={{fontFamily: 'custom', color: '#fff', fontSize: d*0.04}}>{'Юридическое лицо' }</Text>
                                    <Switch
                                        thumbColor = {'#778ca3'}
                                        trackColor = {{false: 'white', true: 'rgba(255, 255, 255, 0.5)'}}
                                        value = {entity}
                                        onValueChange = {e => setEntity(e)}
                                    />
                            </View>

                            {entity ?
                            <View>

                                {company && user ?
                                <View style = {[globalStyles.input, {backgroundColor: 'transparent', borderWidth: 2, justifyContent: 'center'}]}>
                                    <Text style = {globalStyles.text}>
                                        {'Компания: "' + company + '"'}
                                    </Text>
                                </View> : null}
                                                        
                                {(company && !user) || (!company && user) || (!company && !user) ?
                                <View>
                                    <Text style = {{marginLeft: 25}}>Компания *:</Text>
                                    <TextInput
                                        style = { globalStyles.input }
                                        placeholderTextColor = '#a5b1c2'
                                        placeholder = 'Компания'
                                        onChangeText = {text => setNewCompany(text)}
                                        value = {newCompany}
                                        />
                                        </View> : null}

                            </View> : null}
                           

                            <Text style = {{marginLeft: 25}}>Адрес вывоза:</Text>

                            {where ?
                            <TextInput
                                style = {[ globalStyles.input, {height: 100} ]}
                                placeholderTextColor = '#a5b1c2'
                                multiline
                                placeholder = 'адрес'
                                onChangeText = {props.handleChange('address')}
                                value = {props.values.address}
                            />

                            :
                            <View style={{height: 100, width: '100%'}}>
                            <ActivityIndicator
                                animating={true}
                                size = 'large'
                                color = '#fff'
                                style = {{
                                        flex: 1,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: 200
                                    }}/>
                            </View>
                            }

                            <View style = {globalStyles.inputSmallContainer}>
                            <View>
                            <Text style = {{marginLeft: 5}}>Количество, кг:</Text>    
                            <TextInput
                                style = {[globalStyles.input,
                                {width: d *0.4,
                                marginLeft: 0
                                }]}
                                placeholderTextColor = '#a5b1c2'
                                placeholder = 'кол-во, кг'
                                onChangeText = {props.handleChange('quantity')}
                                value = {props.values.quantity}
                                keyboardType = 'numeric'
                                
                            />
                            </View>

                            <View>
                            <Text style = {{marginLeft: 10}}>Этаж:</Text> 
                            <TextInput
                                style = {[ globalStyles.input,
                                {width: d * 0.2,
                                marginRight: 0,
                                paddingRight: 0,
                                paddingLeft: 15                                
                                }]}
                                placeholderTextColor = '#a5b1c2'
                                placeholder = 'этаж'
                                onChangeText = {props.handleChange('floor')}
                                value = {props.values.floor}
                                keyboardType = 'numeric'
                               
                                                                
                            />
                            </View>

                            <View style = {{ alignItems: 'flex-end', height: 50, width: '30%' }}>                                
                                <Switch
                                        thumbColor = {'#778ca3'}
                                        trackColor = {{false: 'white', true: 'rgba(255, 255, 255, 0.5)'}}
                                        value = {lift}
                                        onValueChange = {v => setLift(v)}
                                    />
                                
                                <Text style = {{
                                                fontFamily: 'custom',
                                                color: 'white'
                                                }}>
                                    ЛИФТ: {lift ? ' ЕСТЬ' : ' НЕТ'}
                                </Text>     
                            </View>
                        </View>
 
                        <View>
                            <Text style = {{marginLeft: 25}}>Желаемые дата и время вывоза:</Text>
                        </View>

                        
                        <View style = {[globalStyles.inputSmallContainer, {alignItems: 'flex-start'}]}>
                            <TouchableOpacity 
                                onPress = {() => setShowDate(true)} 
                                style = {[globalStyles.button, {width: '45%', margin: 0, marginTop: 5, borderColor: '#dfe6e9', backgroundColor: 'white'}]}>
                                   <ItemDate  
                                        timestamp = {dateFinal.getTime()} 
                                        mode = 'date'
                                        textStyle = {{fontFamily: 'custom', fontSize: 17, color: '#778ca3'}}
                                        />
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress = {() => setShowTime(true)}
                                style = {[globalStyles.button, {width: '45%', margin: 0, marginTop: 5, borderColor: '#dfe6e9', backgroundColor: 'white'}]}>
                                    <ItemDate
                                        timestamp = {dateFinal.getTime()} 
                                        mode = 'time'
                                        textStyle = {{fontFamily: 'custom', fontSize: 17, color: '#778ca3'}}
                                        />
                            </TouchableOpacity>
                        </View>
                       
      
                                <View>

                                {showTime && (
                                    <DateTimePicker
                                    testID = 'dateTimePicker'
                                    timeZoneOffsetInMinutes = {60 * 3}
                                    value = {time}
                                    mode = 'time'
                                    is24Hour = {true}
                                    display = 'default'
                                    onChange = {onTimeChange}
                                    />
                                )}
                                
                                </View>

                                <View>
                                
                                {showDate && (
                                    <DateTimePicker
                                    testID = 'dateTimePicker'
                                    timeZoneOffsetInMinutes = {0}
                                    value = {time}
                                    mode = 'date'
                                    display = 'default'
                                    onChange = {onDateChange}
                                    />
                                )}
                                
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