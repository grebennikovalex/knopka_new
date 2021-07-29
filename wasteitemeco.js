import React, { useState, useContext } from 'react'
import { View,  Text, TouchableOpacity, Image, Dimensions,StyleSheet } from 'react-native'
import { globalStyles } from './globalstyle'
import { EcoOfficeContext } from './ecoofficecontext'


const buttonString = ' ВЫВЕЗТИ '

const d = Dimensions.get('screen').width

export default function WasteItemEco ({ item }) {
    
    const { officeContsModificator } = useContext(EcoOfficeContext)

    const [number, setNumber] = useState(0)

    const setQuantity = num => {
        if(num < 0) num = 0
        if(num > 9) num = 9
        setNumber(num)
        officeContsModificator(item.id, num)
    }

    return(
        <View style={{ width: d*0.5, alignItems: 'center', jusifyContent: 'center', marginVertical: d*0.03}}>
               <View style={{width: d*0.4, height: d*0.4, borderColor: '#fff', borderWidth: 2,  backgroundColor: 'rgba(255,255,255,0.3)',
                alignItems: 'center', jusifyContent: 'center', borderRadius: d*0.2}}>
                   <Image style={{height: d*0.4, width: d*0.4, top: -2, left: 1}}
                       source={{uri: item.image}}
                   />
                </View>
                <View style={{backgroundColor: 'rgba(255,255,255,0.4)', alignItems: 'center',
                 marginTop: 10, borderBottomLeftRadius: 10, borderBottomRightRadius: 10}}>
                    <Text style={{fontFamily:'custom', color: '#fff', fontSize: d*0.035, padding: 7, 
                        textShadowColor: 'rgba(0, 0, 0, 0.5)', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 7}}>
                        {' ' + item.type + ' '}
                    </Text>

                    <View style={{width: d*0.4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff',
                        height: d*0.1, borderRadius: 10}}>
                            <TouchableOpacity
                                    onPress={() => {
                                        setQuantity(number - 1)}}>
                                        <View style = {style.smallbtn}>
                                                <Text style = {globalStyles.text}>
                                                    {' - '}     
                                                </Text>
                                            </View>
                            </TouchableOpacity>
                        
                                <Text style={{fontSize: d*0.07, fontFamily: 'custom', color: '#aaa'}}>
                                    {number}
                                </Text>
                            
                            <TouchableOpacity
                                    onPress={() => setQuantity(number + 1)}>
                                        <View style = {style.smallbtn}>
                                                <Text style = {globalStyles.text}>
                                                    {' + '}     
                                                </Text>
                                            </View>
                            </TouchableOpacity>
                    </View>
                </View>
        </View> 
    )
}


const style = StyleSheet.create({
    smallbtn: { alignItems: 'center', justifyContent: 'center', width: d*0.1, height: d*0.1, marginVertical: 5, backgroundColor: '#778ca3',borderColor: '#b2bec3',
    borderRadius: 10,  borderWidth: 2,  elevation: 3}
    })
