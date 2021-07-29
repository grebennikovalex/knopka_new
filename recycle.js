import React from 'react'
import { View, Text, ImageBackground } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Glass from './glass'
import Paper from './paper'
import Plastic from './plastic'
import WasteBarRecycle from './wastebarrecycle'
import { globalStyles } from './globalstyle'
import { wasteColors } from './wastetab'
import { LinearGradient } from 'expo-linear-gradient'

const Tab = createMaterialTopTabNavigator()

const Recycle = ({ navigation }) => {
   

    return(
         
                <Tab.Navigator
                    initialRouteName = 'Glass' 
                    tabBar = {props => <WasteBarRecycle {...props} />
                    }> 
                    <Tab.Screen name = 'Glass' component = {Glass} />
                    <Tab.Screen name = 'Plastic' component = {Plastic} />
                    <Tab.Screen name = 'Paper' component = {Paper} />
                </Tab.Navigator>
     
    )
}

export default Recycle

 