import React, { useContext } from 'react'
import { View, Dimensions, Text} from 'react-native'
import WasteTabRecycle from './wastetabrecycle'
import { globalStyles } from './globalstyle'
import { EcoOfficeContext } from './ecoofficecontext'


const WasteBarRecycle = ({ state, navigation }) => {

    const { currentColor } = useContext(EcoOfficeContext)
    const { setColor } = useContext(EcoOfficeContext)
      
        
    return (
        <View style={{paddingTop: 28, backgroundColor: currentColor}}>
            <View style = {[globalStyles.headerWastes, {backgroundColor: currentColor}]}>

                <Text style = {[globalStyles.icon, {fontSize: 25, paddingBottom: 5}]}>
                    W
                </Text>
                
                <Text style = {[globalStyles.text, {paddingLeft: 12}]}>
                    ВТОРСЫРЬЕ
                </Text>
            </View>

            <View style = {{
                height: Dimensions.get('screen').height * 0.07, 
                // width: '90%',
                backgroundColor: currentColor,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                // paddingHorizontal: 10
                
            }}>

            {state.routes.map((route, index) => {
                
                    return (
                    <WasteTabRecycle 
                        key = {index}
                        index = {index}
                        isActive = {state.index}
                        onPress={() => {
                            navigation.navigate(route.name)
                            setColor(state.index)
                            }}
                    />
                    )
                })}
            
            </View>
        </View>
    )
}

export default WasteBarRecycle