import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import WasteBar from './wastebar'
import Recycle from './recycle'
import List from './list'
import EcoPoints from './ecopoints'
import Settings from './settings'
import Containers from './containers'
import EcoOffice from './ecooffice'



const Tab = createMaterialTopTabNavigator()

const WasteSelection = () => {
  
    return (
      
      <Tab.Navigator
          initialRouteName = 'EcoOffice' 
          tabBarPosition = 'bottom'
          tabBar = {props => <WasteBar {...props} />
          }> 
        <Tab.Screen name = 'Containers' component = {Containers} />
        <Tab.Screen name = 'EcoOffice' component = {EcoOffice} />
        <Tab.Screen name = 'Recycle' component = {Recycle} />
        <Tab.Screen name = 'List' component = {List} />
        <Tab.Screen name = 'EcoPoints' component = {EcoPoints} />
        <Tab.Screen name = 'Settings' component = {Settings} />
      </Tab.Navigator>
      
      
    )
  }

export default WasteSelection
