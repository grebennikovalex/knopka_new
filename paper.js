import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, Image, ActivityIndicator } from 'react-native'
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
        color: '#45aaf2',
        entity: null,
        ecoconts: 0
    }


export default function Paper({ navigation }) {

    const [paperType, setPaperType] = useState([])

    useEffect(() => {
        
                db.ref('/paperType').on('value', snapshot => {
                const paper = Object.values(snapshot.val())
                setPaperType(paper)
                })
    },[])    

                 
    const wastePress = (id) => {
        values.type = paperType[id-10].type
        values.id = paperType[id-10].id
        values.price = paperType[id-10].price
        navigation.navigate('Orderform', {values: values})
    }
       

    return(
        <View style = {[globalStyles.container, {backgroundColor: '#45aaf2', paddingTop: 0 }]}>
            <Image
                    source = {require('./assets/knp_backG.png')}
                    resizeMode='repeat'
                    style={{ width: '100%', height: '100%',  position: 'absolute',
                    transform: [{ scale: 1.6 }],
                    alignItems: 'center', flex: 1}}/>
            <LinearGradient
                        colors = {['#45aaf2', 'transparent', 'transparent', '#45aaf2']}
                        locations = {[0, 0.1, 0.9, 1.0]}
                        start = {[0, 0]}
                        end = {[0, 1.0]}>
            
            <View style = {globalStyles.wasteListContainer}>

            {!paperType.length ?  

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
                    data = {paperType}
                    keyExtractor = {item => item.id}
                    renderItem = {({item}) => (
                    
                    <WasteItem
                        id = {item.id}
                        wastePress = {wastePress}                  
                        item = {item}
                    />
                    )}
                />}
           

          
            </View>
            </LinearGradient>
           
        </View>
    )
 }

 