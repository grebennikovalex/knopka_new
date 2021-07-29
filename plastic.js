import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, ActivityIndicator, Image } from 'react-native'
import { globalStyles } from './globalstyle'
import WasteItem from './wasteitem'
import { wasteColors } from './wastetab'
import { LinearGradient } from 'expo-linear-gradient'
import { db } from './config'

let values = {
    name: '',
    phone: '+7',
    email: '',
    address: '',
    floor: '',
    quantity: '',
    key: '',
    date: '',
    type: '',
    lift: '',
    color: '#ffb142',
    entity: null,
    ecoconts: 0
}


export default function Plastic( { navigation } ) {

    const [plasticType, setPlasticType] = useState([])

    useEffect(() => {
        
                db.ref('/plasticType').on('value', snapshot => {
                const plastic = Object.values(snapshot.val())
                setPlasticType(plastic)
                })
    },[])    
  

    const wastePress = (id) => {
        values.type = plasticType[id-4].type
        values.id = plasticType[id-4].id
        values.price = plasticType[id-4].price
        navigation.navigate('Orderform', {values: values})
        }
  
    return(
        <View style = {[globalStyles.container, {backgroundColor: '#ffb142', paddingTop: 0}]}>
            <Image 
                    source = {require('./assets/knp_backG.png')}
                    resizeMode='repeat'
                    style={{ width: '100%', height: '100%',  position: 'absolute',
                    transform: [{ scale: 1.6 }],
                    alignItems: 'center', flex: 1}}/>
            <LinearGradient
                        colors = {['#ffb142', 'transparent', 'transparent', '#ffb142']}
                        locations = {[0, 0.1, 0.9, 1.0]}
                        start = {[0, 0]}
                        end = {[0, 1.0]}>
           
            <View style = {globalStyles.wasteListContainer}>

            {!plasticType.length ? 

            <ActivityIndicator
                    animating={true}
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
                numColumns = {2}
                data = {plasticType}
                keyExtractor = {item => item.id}
                renderItem = {({item}) => ( 
                
                <WasteItem
                    id = {item.id}
                    item = {item}
                    wastePress = {wastePress}
                />
                )}
                />
            }
            </View>
            </LinearGradient>
              
        </View>
    )
 }

 