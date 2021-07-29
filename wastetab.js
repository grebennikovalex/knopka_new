import React, { useContext, useEffect } from 'react'
import { TouchableOpacity, View, Text, Dimensions } from 'react-native'
import { globalStyles } from './globalstyle'
import { EcoOfficeContext } from './ecoofficecontext'


export const wasteColors = [
  'rgba(235,235,235,1)',
  '#badc58',
  '#33d9b2',
  '#eccc68',
  // '#45aaf2',
  'rgba(235,235,235,1)',
  '#fff'
]

const inactiveIcon = '#b2bec3'

let wasteType =
        [{icon: '8', name: 'КОНТЕЙНЕРЫ', color: wasteColors[0], iconColor: 'white', ears: true},
        {icon: '7', name: 'ЭКООФИС', color: 'transparent', iconColor: inactiveIcon, ears: false},
        {icon: 'W', name: 'ВТОРСЫРЬЕ', color: 'transparent', iconColor: inactiveIcon, ears: false},
        {icon: 'V', name: 'СПИСОК', color: 'transparent', iconColor: inactiveIcon, ears: false},
        // {icon: '2', name: 'МАКУЛАТУРА', color: 'transparent', iconColor: inactiveIcon, ears: false},
        {icon: '0', name: 'ЭКО ПУНКТЫ', color: 'transparent', iconColor: inactiveIcon, ears: false},
        {icon: '4', name: 'НАСТРОЙКИ', color: 'transparent', iconColor: inactiveIcon, ears: false}]  



const WasteTab = ({ onPress, index, isActive }) => {

  const { currentColor } = useContext(EcoOfficeContext)
  
       
        wasteType.map(waste => {
             waste.color = 'transparent'
             waste.iconColor = inactiveIcon
             waste.ears = false
            
            })
        
        if(isActive === 4 || isActive === 0 || isActive === 5 ) {
          wasteType[isActive].iconColor = '#778ca3'
        } else {
          wasteType[isActive].iconColor = 'white'
        }

        wasteType[isActive].color = wasteColors[isActive]
        wasteType[isActive].ears = true
      
    
    return ( 
      
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: Dimensions.get('screen').height * 0.07, 
            width: Dimensions.get('screen').width / 6, 
            backgroundColor: (index === 2 && isActive === 2)? currentColor : wasteType[index].color,
            borderBottomLeftRadius: index === 0 ? 0 : 10,
            borderBottomRightRadius: index === 5 ? 0 : 10
            }}
        >
          {wasteType[index].ears ?
          <View style = {{
                position: 'absolute',
                left: -20,
                top: 0, 
                width: 20, 
                height: 20, 
                backgroundColor:  index === 2 ? currentColor : wasteType[index].color
                }}></View> : null }

          {wasteType[index].ears ?
          <View style = {{
                position: 'absolute',
                left: -20,
                top: 0, 
                width: 20, 
                height: 20, 
                borderTopRightRadius: 10, 
                backgroundColor: '#636e72'
                }}></View> : null }

          {wasteType[index].ears ?
          <View style = {{
                position: 'absolute',
                right: -20,
                top: 0, 
                width: 20, 
                height: 20, 
                backgroundColor:  index === 2 ? currentColor : wasteType[index].color
                }}></View> : null }

          {wasteType[index].ears ?
          <View style = {{
                position: 'absolute',
                right: -20,
                top: 0, 
                width: 20, 
                height: 20, 
                borderTopLeftRadius: 10, 
                backgroundColor: '#636e72'
                }}></View> : null }
              
            <TouchableOpacity 
              onPress = {onPress}
              style = {{alignItems: 'center'}}>
            <Text style = {[globalStyles.icon,
                { 
                zIndex: 100,  
                color: wasteType[index].iconColor, 
                fontSize: Dimensions.get('window').width * 0.06, 
                marginTop: 10}
                ]}>
            {wasteType[index].icon}
            </Text>
          <Text style = {{
            color: wasteType[index].iconColor,
            fontSize: Dimensions.get('window').width * 0.013,
            paddingTop: 5
            
          }}>
            {wasteType[index].name}
          </Text>
          </TouchableOpacity>
        </View>
      
    )
  }

  export default WasteTab
  