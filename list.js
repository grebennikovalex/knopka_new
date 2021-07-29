import React from 'react'
import { View, Text, ImageBackground } from 'react-native'
import { globalStyles } from './globalstyle'
import { LinearGradient } from 'expo-linear-gradient'

const List = ({ navigation }) => {
   

    return(
        <View style = {[globalStyles.container, { backgroundColor: '#eccc68' }]}>
            <ImageBackground 
                    source = {require('./assets/knp_backG.png')}
                    style = {{alignItems: 'center', height: '100%', width: '100%'}}
                    imageStyle = {{resizeMode : 'repeat'}}>
            <LinearGradient
                        colors = {['transparent', '#eccc68']}
                        start = {[0, 0.85]}
                        end = {[0, 1.0]}>
            <View style = {[globalStyles.headerWastes, {marginTop: 28}]}>
            <Text style = {[globalStyles.icon, { fontSize: 25, paddingBottom: 5 }]}>
                V
            </Text>
            
            <Text style = {[globalStyles.text, {paddingLeft: 12}]}>
                СПИСОК
            </Text>
            </View>
            <View style = {globalStyles.wasteListContainer}>

           
           

          
            </View>
            </LinearGradient>
            </ImageBackground>  
        </View>
    )
}

export default List
