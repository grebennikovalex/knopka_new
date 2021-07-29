import React from 'react'
import { View, Dimensions } from 'react-native'

import WasteTab from './wastetab'

const WasteBar = ({ state, navigation }) => {
    
        
    return (

        <View style = {{
            height: Dimensions.get('screen').height * 0.07, 
            backgroundColor: '#636e72',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center'
            
        }}>

        {state.routes.map((route, index) => {
            
                return (
                <WasteTab 
                    key = {index}
                    index = {index}
                    isActive = {state.index}
                    onPress={() => navigation.navigate(route.name)}
                />
                )
            })}
        </View>
    )
}

export default WasteBar


      
 