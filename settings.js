import React, { useState, useCallback, useEffect }  from 'react'
import { View, Text, TouchableOpacity, ImageBackground, Dimensions, Image, StyleSheet, ScrollView,
     TextInput, Alert, Keyboard, Linking, Platform, TouchableWithoutFeedback, ActivityIndicator, Switch } from 'react-native'
import Modal from 'react-native-modal'
import { useFocusEffect } from '@react-navigation/native'
import { globalStyles } from './globalstyle'
import { wasteColors } from './wastetab'
import firebase from 'firebase'
import { Formik } from 'formik'
import { LinearGradient } from 'expo-linear-gradient'
import { db, VER_NUMBER } from './config'
import * as WebBrowser from 'expo-web-browser'



let modalId = 0
const d = Dimensions.get('screen').width * 0.40

const Settings = ({ navigation }) => {

    const [modal, setModal] = useState(false)
    const [user, setUser] = useState({})
    const [extraData, setExtra] = useState([
        {image: '', about: '', title: ''},
        {image: '', about: '', title: ''},
        {image: '', about: '', title: ''}
    ])
    const [entity, setEntity] = useState(true)
    const [company, setCompany] = useState('')
    const [newCompany, setNewCompany] = useState('')

    useFocusEffect(

        useCallback(() => {
            
            setUser(firebase.auth().currentUser) 

            user ?

            db.ref('/users/' + user.uid + '/company').once('value', snapshot => {
                setCompany(snapshot.val().company)
                })
            :       
                setCompany('')
            
           
          }, [user])
          
    )

    useEffect(() => {

        // setUser(firebase.auth().currentUser) 

        // user ?

        //     db.ref('/users/' + user.uid + '/company').once('value', snapshot => {
        //         setCompany(snapshot.val().company)
        //         })
        //     :       
        //         setCompany('')
        

            db.ref('/extraData').once('value', snapshot => {
                const extra = Object.values(snapshot.val())
                setExtra(extra)
                })

    },[user])    
    

   
    const submitUser = (email, password, company) => {

       

        firebase.auth().signInWithEmailAndPassword(email, password)
                                
                .then(() => setUser(firebase.auth().currentUser))
                // .then(() => db.ref('/users/' + firebase.auth().currentUser.uid + '/company').set({company}))
                .then(() => Alert.alert('ВЫ ВОШЛИ В ПРОФИЛЬ'))

                .catch(error => {
                    if(error.code === 'auth/wrong-password') Alert.alert('НЕПРАВИЛЬНЫЙ НОМЕР ТЕЛЕФОНА')
                    if(error.code === 'auth/invalid-email')  Alert.alert('НЕПРАВИЛЬНЫЙ АДРЕС ЭЛЕКТРОННОЙ ПОЧТЫ')
                    if(error.code === 'auth/user-not-found') Alert.alert('ПОЛЬЗОВАТЕЛЬ НЕ НАЙДЕН')
                    if(error.code === 'auth/user-disabled')  Alert.alert('ПОЛЬЗОВАТЕЛЬ ОТКЛЮЧЕН')
                })
    }

    const submitCompany = company => {

        db.ref('/users/' + firebase.auth().currentUser.uid + '/company').set({company})

        db.ref('/users/' + user.uid + '/company').once('value', snapshot => {
            setCompany(snapshot.val().company)
            })
    }
    

    const callNumber = phone => {
            let phoneNumber = phone
            if (Platform.OS !== 'android') {
                phoneNumber = `telprompt:${phone}`
            } else {
                phoneNumber = `tel:${phone}` 
                }
        
        Linking.canOpenURL(phoneNumber)
            .then(supported => {
            if (!supported) {
                Alert.alert('ЗВОНКИ НЕ ПОДДЕРЖИВАЮТСЯ')
            } else {
                return Linking.openURL(phoneNumber)
                }
        })
        
    }

    const openLink = () => WebBrowser.openBrowserAsync('https://knopka-r.ru/privacy')

    return(
        

        <View style = {[globalStyles.container, {backgroundColor: wasteColors[5], alignItems: 'stretch'}]}>
            <ImageBackground 
                    source = {require('./assets/knp_backGb.png')}
                    style = {{alignItems: 'center', height: '100%', width: '100%'}}
                    imageStyle = {{resizeMode : 'repeat'}}>
            <LinearGradient
                        colors = {['transparent', Platform.OS === 'android' ? wasteColors[5] : 'transparent' ]}
                        start = {[0, 0.85]}
                        end = {[0, 1.0]}>
                    <View style = {[ 
                                globalStyles.headerWastes, {
                                flexDirection: 'row', 
                                justifyContent: 'space-between', 
                                paddingHorizontal: 25,
                                marginTop: 28
                                }]}>
                        <View style = {{flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-start'}}>
                            <Text style = {[globalStyles.icon, {fontSize: 30, paddingBottom: 5, color: '#778ca3'}]}>
                                4
                            </Text>
                            <Text style = {[globalStyles.text, {paddingLeft: 10, color: '#778ca3'}]}>
                            НАСТРОЙКИ
                            </Text>
                        </View>
                            
                        {user ?
                        <View>
                            <TouchableOpacity
                                    onPress = {() => {
                                    firebase.auth().signOut()
                                    .then(() => Alert.alert('ВЫ ВЫШЛИ ИЗ ПРОФИЛЯ'))
                                    .then(() => setUser(firebase.auth().currentUser))
                                    .catch((error) => alert(error.message))
                                    
                                }}>
                                <Text style = {[globalStyles.icon, {paddingLeft: 10, color: '#778ca3', fontSize: 30}]}>
                                Z
                            </Text>
                            </TouchableOpacity>
                            </View> : null }
                
                    </View>


            <Formik
                    initialValues = {{ email: '', password: '+7', company: '' }}
                    onSubmit = {values => {
                                    
                        if(!user) {
                            submitUser(values.email, values.password)
                            setNewCompany('')
                        }else{
                            submitCompany(newCompany)
                            setNewCompany('')
                        }
                     
                        Keyboard.dismiss()
                        
                    }}> 

                {props => (            
           

                <View>
                {user ?    
           
                <View style = {{width: '90%', alignSelf: 'center', marginBottom: 10}}>
                   
                   <View style = {{flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                        
                        <Text style = {{fontSize: d * 0.1, fontFamily: 'custom', color: '#778ca3'}}>
                            {user.displayName}
                        </Text>
                        <Text style = {{fontSize: d * 0.1, fontFamily: 'custom', color: '#778ca3'}}>
                            {user.email}
                        </Text>
                        <Text style = {{fontSize: d * 0.1, fontFamily: 'custom', color: '#778ca3'}}>
                            {user.photoURL}
                        </Text>
                        {(company && entity) ?
                        <Text style = {{fontSize: d * 0.1, fontFamily: 'custom', color: '#778ca3'}}>
                            {'Компания:  "' + company + '"'}
                        </Text> : null}

                    </View>

                    <View 
                        style={{width: '80%', height: d * 0.04, 
                        backgroundColor: '#778ca3', alignSelf: 'center',
                        marginTop: d * 0.05, borderBottomColor: 'white', borderBottomWidth: 3}}>
                    </View>
                    
                </View>         
                    
                    :

                <View style = {{alignItems: 'center', marginTop: 10}}>
                    <View style = {{ marginBottom: 10 }}>
                    <Text style = {{marginLeft: 25}}>Адрес электронной почты:</Text>
                        <TextInput
                            style = {globalStyles.inputFocused}
                            keyboardType = 'email-address'
                            placeholder = 'user@host.ru'
                            onChangeText = {props.handleChange('email')}
                            value = {props.values.email}
                            />
                    <Text style = {{marginLeft: 25}}>Номер телефона:</Text>
                        <TextInput
                            style = {globalStyles.inputFocused}
                            keyboardType = 'numeric'
                            onChangeText = {props.handleChange('password')}
                            placeholder = '+7'
                            value = {props.values.password}
                            />
                </View>
                    <TouchableOpacity 
                                    onPress={props.handleSubmit}>
                                <View style = {[globalStyles.button, {borderColor: '#dfe6e9', backgroundColor: 'white'}]}>
                                    <Text style = {[globalStyles.text, {color: '#778ca3' }]}> ВОЙТИ </Text>
                                </View>
                    </TouchableOpacity> 
                </View>}

                {user ?
                    <View>
                    {entity && !company ?
                        <View> 
                                <View>
                                    <Text style = {{marginLeft: 25}}>Компания *:</Text>
                                    <TextInput
                                        style = { globalStyles.inputFocused }
                                        placeholderTextColor = '#a5b1c2'
                                        placeholder = 'Компания'
                                        onChangeText = {text => setNewCompany(text)}
                                        value = {newCompany}
                                        />
                                </View> 
                                                             
                            <TouchableOpacity 
                                    onPress={props.handleSubmit}>
                                <View style = {[globalStyles.button, {borderColor: '#dfe6e9', backgroundColor: 'white'}]}>
                                    <Text style = {[globalStyles.text, {color: '#778ca3' }]}> СОХРАНИТЬ </Text>
                                </View>
                            </TouchableOpacity> 

                        </View> : null}
                    </View> : null}  
        
                </View>)}

            </Formik>
            
            {user ?
                <View style={{alignSelf: 'center', alignItems: 'center', width: d*0.9/0.4, paddingLeft: 10, marginVertical: 15,
                        flexDirection: 'row', height: d*0.1, justifyContent: 'space-between'}}>
                            <Text style={{fontFamily: 'custom', color: '#778ca3', fontSize: d*0.04/0.4}}>{'Юридическое лицо'}</Text>
                            <Switch
                                thumbColor = {'#778ca3'}
                                trackColor = {{false: '#eee', true: '#778ca3'}}
                                value = {entity}
                                onValueChange = {e => setEntity(e)}
                            />
                </View> : null}

            

           
           
                <ScrollView>
                <View style = {{width: '95%', alignSelf: 'center'}}>
                
                    <TouchableOpacity style = {{flexDirection: 'row', marginVertical: 3, alignItems: 'center'}}
                                onPress={() => {
                                        setModal(true)
                                        modalId = 0
                                        }}>
                    <View style = {[style.icon, {backgroundColor: 'rgba(65,151,230,1)'}]}>
                        <Text style = {{fontFamily: 'icons', color: '#fff', fontSize: d * 0.12 }}>{'\uF05A'}</Text>
                    </View>
                    
                    <Text style = {{paddingVertical: 5, fontSize: d * 0.1}}>
                        {' О нас'}
                    </Text>
                    </TouchableOpacity>
                
     
              
                    <TouchableOpacity style = {{flexDirection: 'row', marginVertical: 3, alignItems: 'center'}}
                                onPress={() => callNumber('+79063483827')}>
                    <View style = {style.icon}>
                        <Text style = {{fontFamily: 'icons', color: '#fff', fontSize: d * 0.12 }}>{'\uf095'}</Text>
                    </View>
                    
                    <Text style = {{paddingVertical: 5, fontSize: d * 0.1}}>
                        {' Позвонить нам'}
                    </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style = {{flexDirection: 'row', marginVertical: 3, alignItems: 'center'}}
                                onPress={() => navigation.navigate('Statistics')}>
                    <View style = {[style.icon, {backgroundColor: 'rgba(120,166,0,1)'}]}>
                        <Text style = {{fontFamily: 'icons', color: '#fff', fontSize: d * 0.12 }}>{'\uf080'}</Text>
                    </View>
                    
                    <Text style = {{paddingVertical: 5, fontSize: d * 0.1}}>
                        {' Моя статистика'}
                    </Text>
                    </TouchableOpacity>   

                    <TouchableOpacity style = {{flexDirection: 'row', marginVertical: 3, alignItems: 'center'}}
                                onPress={() => navigation.navigate('History')}>
                    <View style = {[style.icon, {backgroundColor: 'rgba(65,151,230,1)'}]}>
                        <Text style = {{fontFamily: 'knp', color: '#fff', fontSize: d * 0.12, left: d*0.015 }}>{'5'}</Text>
                    </View>
                    
                    <Text style = {{paddingVertical: 5, fontSize: d * 0.1}}>
                        {' Мои заказы'}
                    </Text>
                    </TouchableOpacity>            
            
                
                    {/* <TouchableOpacity style = {{flexDirection: 'row', marginVertical: 3, alignItems: 'center'}}
                                onPress={() => openMaps(56.284471, 43.956362)}>
                    <View style = {[style.icon, {backgroundColor: 'rgba(65,151,230,1)'}]}>
                        <Text style = {{fontFamily: 'icons', color: 'white', fontSize: d * 0.12 }}>{'\uf57d'}</Text>
                    </View>
                    
                    <Text style = {{paddingVertical: 5, fontSize: d * 0.1}}>
                        {' г. Нижний Новгород,\n ул. Правдинская, 27'}
                    </Text>
                    </TouchableOpacity> */}
                

               
                {/* <TouchableOpacity style = {{flexDirection: 'row', marginVertical: 3, alignItems: 'center'}}
                                onPress={() => {
                                    setModal(true)
                                    modalId = 1}}>
                    <View style = {[style.icon, {backgroundColor: 'rgba(120,166,100,1)'}]}>
                        <Text style = {{fontFamily: 'icons', color: 'white', fontSize: d * 0.12 }}>{'\uf4fe'}</Text>
                    </View>
                
                    <Text style = {{paddingVertical: 5, fontSize: d * 0.1}}>
                        {' Информация о разработчике'}
                    </Text>
                    </TouchableOpacity> */}
                

                
                    <TouchableOpacity style = {{flexDirection: 'row', marginVertical: 3, alignItems: 'center'}}
                                onPress={() => navigation.navigate('Containermap')}>
                    <View style = {[style.icon, {backgroundColor: 'rgba(255,150,15,1)'}]}>
                        <Text style = {{fontFamily: 'knp', color: 'white', fontSize: d * 0.14 }}>8</Text>
                    </View>
                
                    <Text style = {{paddingVertical: 5, fontSize: d * 0.1}}>
                        {' Карта контейнеров'}
                    </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style = {{flexDirection: 'row', marginVertical: 3, alignItems: 'center'}}
                                onPress={() => openLink()}>
                    <View style = {[style.icon,{backgroundColor: 'rgba(120,166,0,1)'}]}>
                        <Text style = {{fontFamily: 'icons', color: 'white', fontSize: d * 0.12 }}>{'\uf505'}</Text>
                    </View>
                
                    <Text style = {{paddingVertical: 5, fontSize: d * 0.1}}>
                        {' Политика конфиденциальности'}
                    </Text>
                    </TouchableOpacity>
                

                    <Text style = {{paddingVertical: 5, fontSize: d * 0.075, alignSelf: 'center'}}>
                        {VER_NUMBER}
                    </Text>
                </View>
                </ScrollView>
            

            
            {/* <TouchableOpacity onPress={() => {
                db.ref('/ecopoints').push(ecopoint)
            }}>
                <View style = {[globalStyles.button, {borderColor: '#dfe6e9', backgroundColor: 'white'}]}>
                    <Text style = {[globalStyles.text, {color: '#778ca3' }]}> PUSH PLACE </Text>
                </View>
            </TouchableOpacity> */}
         

            
            </LinearGradient>
            </ImageBackground>

            <Modal 
                isVisible = {modal}
                animationIn	= 'slideInRight'
                animationOut = 'fadeOutUpBig'
                animationInTiming = {500}
                onSwipeComplete={() => setModal(false)}
                onBackButtonPress={() => setModal(false)}
                swipeDirection={['down', 'up', 'left', 'right']}
                backdropColor='#778ca3'
                propagateSwipe
                style={{justifyContent: 'flex-start'}}
                >
                
                <View style={{paddingBottom: d * 0.5, backgroundColor: 'rgba(0,0,0,0)', borderRadius: 20}}>
                <View style={{
                    alignSelf: 'center',
                    width: Dimensions.get('screen').width * 0.9,
                    height: Dimensions.get('screen').height * 0.65,
                    backgroundColor: 'white',
                    borderRadius: 20,
                    borderWidth: 2,
                    borderColor: '#778ca3',
                    padding: 15,
                    elevation: 5
                }}> 
                   
                            <Image source = {{uri: extraData[modalId].image}}
                                style = {{height: d * 0.75, width: d * 0.75, alignSelf: 'center'}}/> 
  
                            <Text style={{
                                fontFamily: 'custom',
                                color: '#778ca3',
                                fontSize: 20
                                     }}>
                        {'  ' + extraData[modalId].title}
                            </Text>
                        
                    <ScrollView> 
                    <TouchableWithoutFeedback>
                    <Text style={{fontSize: d * 0.1}}>{extraData[modalId].about}</Text>
                    </TouchableWithoutFeedback>
                    </ScrollView>
                    
                    <View style={{
                            
                            
                            alignItems: 'center',  
                            marginTop:  -d * 0.25,                          
                            position: 'relative',
                            top: d * 0.5,
                            
                            }}>
                            
                                <Text style={{fontFamily: 'icons', fontSize: d * 0.3, color: 'white' }}>
                                                    {'\uf103'}
                                </Text>
                            
                        </View>   

                    
                </View>
                </View>
            </Modal>

        </View>
        
    )
}

export default Settings

const style = StyleSheet.create({
    icon: {
        marginHorizontal: 20, 
        height: d * 0.3, 
        width: d * 0.3, 
        backgroundColor: 'red', 
        alignItems: 'center', 
        justifyContent: 'center', 
        borderRadius: d * 0.15,
        borderWidth: 2,
        borderColor: 'white'
    }
})

const newPlace = {
    
        containers: {
        '0': {
            image: "https://knopka-r-site.web.app/assets/waste-plastic-0.png",
            num: 0,
            type: "ПЛАСТИК",
            typeId: 0
        },
        '1': {
            image: "https://knopka-r-site.web.app/assets/waste-paper-3.png",
            num: 1,
            type: "МАКУЛАТУРА",
            typeId: 1
        },
        '2': {
            image: "https://knopka-r-site.web.app/assets/batteries.png",
            num: 2,
            type: "БАТАРЕЙКИ",
            typeId: 2
        },
        '3': {
            image: "https://knopka-r-site.web.app/assets/tires.png",
            num: 3,
            type: "ШИНЫ",
            typeId: 3
        },
        '4': {
            image: "https://firebasestorage.googleapis.com/v0/b/knoprka-e6c2e.appspot.com/o/knopka%2Fassets%2Fmercury.png?alt=media&token=6d5bf1dc-b948-43b4-a483-2c27e58b1eb5",
            num: 4,
            type: "РТУТНЫЕ ЛАМПЫ",
            typeId: 3
        },
        '5': {
            image: "https://firebasestorage.googleapis.com/v0/b/knoprka-e6c2e.appspot.com/o/knopka%2Fassets%2Fcontainer_8.png?alt=media&token=2a63ec90-5640-447a-8cab-579ba3b6eeb6",
            num: 5,
            type: "Бункер 8 куб.м",
            typeId: 10
          },
        '6': {
            image: "https://firebasestorage.googleapis.com/v0/b/knoprka-e6c2e.appspot.com/o/knopka%2Fassets%2Fcontainer_20.png?alt=media&token=74b02e0b-2a91-49ee-ac78-26dc1c417fa5",
            num: 6,
            type: "Контейнер 20 куб.м",
            typeId: 20
          },
        '7': {
            image: "https://firebasestorage.googleapis.com/v0/b/knoprka-e6c2e.appspot.com/o/knopka%2Fassets%2Fcompactor.png?alt=media&token=74b02e0b-2a91-49ee-ac78-26dc1c417fa5",
            num: 7,
            type: "Пресс-компактор",
            typeId: 30
          }

        },
        coords : {
          latitude: 55.854366, 
          longitude:  37.705063
        },
        place: "Москва",
        placeId: 200
      
      
}

const ecopoint = {
    address: 'ул. Ясная, 31',
    batteries: true,
    bhours: 'Пн-Пт 8:00-16:00 (обед 12:00-13:00), Сб 8:00-14:00 (без обеда), Вс-выходной',
    coords: {
        latitude: 56.381779,
        longitude: 43.796833
    },
    name: 'Ясный'
}