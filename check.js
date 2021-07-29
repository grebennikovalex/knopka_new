import React from 'react'
import { View,  Text, TouchableOpacity, Dimensions } from 'react-native'

const d = Dimensions.get('screen').width * 0.16

const Check = ({value, onPress}) => {
    
    return(
        <TouchableOpacity onPress = {onPress}>
        <View style = {{
            width: d / 2, 
            height: d /2, 
            borderRadius: d / 4, 
            borderWidth: 2,
            borderColor: value ? '#b8e994' : 'rgba(230,230,230,1)',
            backgroundColor: value ? '#78e08f' : 'white',
            alignItems: 'center',
            justifyContent: 'center'
            }}>
            <Text 
            style = {{
                fontFamily: 'knp',
                fontSize: 20,
                color: value ? 'white' : 'rgba(230,230,230,1)'
            }}>Y</Text>
        </View>
        </TouchableOpacity>
    )
}

export default Check