import React, { useState, useEffect }  from 'react'
import { View,  FlatList,  ActivityIndicator, Dimensions, Image } from 'react-native'
import { globalStyles } from './globalstyle'
import WasteItem from './wasteitem'
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
    color: '#33d9b2',
    entity: null,
    ecoconts: 0
}

const d = Dimensions.get('screen').width

export default function Glass({ navigation }) {

    const [glassType, setGlassType] = useState([])

    useEffect(() => {
        
                db.ref('/glassType').on('value', snapshot => {
                const glass = Object.values(snapshot.val())
                setGlassType(glass)
                })
    },[])    
    

    const wastePress = id => {
        values.type = glassType[id].type
        values.id = glassType[id].id
        values.price = glassType[id].price
        
        navigation.navigate('Orderform', {values: values})
    }
    
    return(
        <View style = {[globalStyles.container, { backgroundColor: '#33d9b2', paddingTop: 0 }]}>
            
            <Image
                    source = {require('./assets/knp_backG.png')}
                    resizeMode='repeat'
                    style={{ width: '100%', height: '100%',  position: 'absolute',
                    transform: [{ scale: 1.6 }],
                    alignItems: 'center', flex: 1}}/>
            
            <LinearGradient
                    colors = {['#33d9b2', 'transparent', 'transparent', '#33d9b2']}
                    locations = {[0, 0.1, 0.9, 1.0]}
                    start = {[0, 0]}
                    end = {[0, 1.0]}>
                    
            
            <View>

            {!glassType.length ?

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
                data = {glassType}
                keyExtractor = {item => item.id}
                renderItem = {({item}) => (
                    
                <WasteItem
                    id = {item.id}
                    wastePress = {wastePress}
                    item = {item}
                    />
                    )}
                />
            }
            </View>
           
        </LinearGradient>
       
        </View>
        
    )
}

