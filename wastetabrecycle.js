import React, { useContext, useEffect } from 'react'
import { TouchableOpacity, View, Text, Dimensions } from 'react-native'
import { EcoOfficeContext } from './ecoofficecontext'


const inactiveIcon = 'rgba(255, 255, 255, 0.5)'
let screens = [
    {name: ' СТЕКЛОБОЙ ', color: '#fff', shadow: true},
    {name: ' ПЛАСТИК ', color: inactiveIcon, shadow: false},
    {name: ' МАКУЛАТУРА ', color: inactiveIcon, shadow: false},
]

const WasteTabRecycle = ({ onPress, index, isActive }) => {

  const { setColor } = useContext(EcoOfficeContext)

  useEffect(() => {

    setColor(isActive)
    
  }, [isActive])
       
        screens.map(screen => {
          screen.color = inactiveIcon 
          screen.shadow = false
          })
        screens[isActive].color = '#fff'
        screens[isActive].shadow = true
        
      
    
    return ( 
      
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: Dimensions.get('screen').height * 0.05, 
            width: Dimensions.get('screen').width / 3
            }}>
    
            <TouchableOpacity 
              onPress = {onPress}
              style = {{alignItems: 'center'}}>
            
            <Text style = {{ color: screens[index].color, fontSize: Dimensions.get('screen').width * 0.035, fontFamily: 'custom',
                    textShadowColor: 'rgba(0, 0, 0, 0.5)',
                    textShadowOffset: {width: 1, height: 1},
                    textShadowRadius: screens[index].shadow ? 7 : 0
                    }}>
              {screens[index].name}
            </Text>
            </TouchableOpacity>
        </View>
      
    )
  }

  export default WasteTabRecycle
  