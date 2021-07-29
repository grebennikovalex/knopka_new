import React, { useContext, useState, useEffect, useRef } from 'react'
import { View,  Text, TouchableOpacity, FlatList, Dimensions, ImageBackground, ScrollView, Platform } from 'react-native'
import { globalStyles } from './globalstyle'
import { wasteColors } from './wastetab'
import { LinearGradient } from 'expo-linear-gradient'
import WasteItemEco from './wasteitemeco'
import { EcoOfficeContext } from './ecoofficecontext'


const d = Dimensions.get('screen').width

const ecooffice = ({ navigation }) => {

    const { officeConts } = useContext(EcoOfficeContext)
  
    
    let values = {
        color: '#badc58',
        type: 'ЭКО ОФИС',
        lift: false,
        quantity: 0
    }

   
    return (
        <View style = {[globalStyles.container, { backgroundColor: wasteColors[1] }]}>
        <ImageBackground 
               source = {require('./assets/knp_backG.png')}
               style = {{alignItems: 'center', height: '100%', width: '100%'}}
               imageStyle = {{resizeMode : 'repeat'}}>
       
       <LinearGradient
                   colors = {['transparent', wasteColors[1]]}
                   start = {[0, 0.85]}
                   end = {[0, 1.0]}>
       <View style = {[globalStyles.headerWastes, { marginTop: 28 }]}>
            <Text style = {[globalStyles.icon, { fontSize: 30, paddingBottom: 5 }]}>
                7
            </Text>
            <Text style = {[globalStyles.text, { paddingLeft: 10 }]}>
                ЭКО ОФИС
            </Text>
       </View>
      
       <ScrollView style={{ height: Dimensions.get('screen').height * 1.5 }}>
            <View style = {{ flex: 1, alignItems: 'center', jusifyContent: 'flex-start' }}>
                        
                <FlatList
                data={officeConts}
                numColumns = {2}
                keyExtractor = {item => item.id}
                renderItem={({item}) => (
                        <WasteItemEco
                            item={item}
                            id={item.id}
                            />
                        )}
                        />
            </View>

                <TouchableOpacity
                        onPress={() => {
                            values.ecoconts = officeConts.reduce((sum, item) => sum + item.number, 0)    
                            navigation.navigate('Orderform', {values})
                            }}>
                            <View style = {[globalStyles.button, {backgroundColor: '#778ca3',borderColor: '#b2bec3', marginTop: 5}]}>
                                    <Text style = {globalStyles.text}>
                                         {' ВЫВЕЗТИ '}     
                                    </Text>

                                </View>
                </TouchableOpacity>

    </ScrollView>  
   </LinearGradient>
   </ImageBackground>
   </View>
    )
}

export default ecooffice

