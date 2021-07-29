import React from 'react'
import { View,  Text, TouchableOpacity, Image, Dimensions } from 'react-native'
import { globalStyles } from './globalstyle'

const buttonString = ' ВЫВЕЗТИ '
const d = Dimensions.get('screen').width * 0.4

export default function ContainerItem ({ item, wastePress}) {
   
    return(
        <View>
        <View style = {globalStyles.wasteItem}>
                    <TouchableOpacity onPress = {() => wastePress(item)}>      
                    <View style = {{
                                borderWidth: 1,
                                borderColor: 'white',
                                height: d,
                                width: d,
                                borderRadius: d / 2,
                                alignContent: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'rgba(255, 255, 255, 0.2)'
                                }}>
                            <Image source = {{uri: item.image}}
                                style = {{height: d, width: d}}/>   
                                
      
                    </View>
                    <View style={{position: 'absolute', height: d/3, width: d/3, right: 0, 
                    backgroundColor: 'rgba(247, 180, 49, 0.7)', borderRadius: d/1.5,
                    }}>
                    <Image source = {require('./assets/glass-mask.png')}
                            style = {{height: d/3, width: d/3, transform: [{scale: 1.25}]}}/>
                            <View style={{ position: 'absolute', right: d/17, top: d/13,
                             flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                            <Text style={{fontFamily: 'custom', color: 'white', fontSize: d/8}}>
                                {'№'}
                            </Text>
                            <Text style={{fontFamily: 'custom', fontSize: d/8, color: 'white'}}>
                                {item.num + 1}
                            </Text>
                            </View>      
                    </View>
                    </TouchableOpacity>  

                    <View style = {{
                                paddingTop: 7, 
                                backgroundColor: 'rgba(255, 255, 255, 0.4)', 
                                width: '100%',
                                marginTop: 10,
                                borderBottomLeftRadius: 10,
                                borderBottomRightRadius: 10
                                }}>
                    <TouchableOpacity onPress = {() => wastePress(item)}>
                            <Text style = {{
                                    alignSelf: 'center',
                                    fontFamily: 'custom',
                                    fontSize: d * 0.09,
                                    color: '#778ca3',
                                    
                                    }}>
                                {' ' + item.type + ' '}
                            </Text>
                            {/* <Text style = {{fontSize: 15, color: 'black', alignSelf: 'center'}}>
                                {item.price + ' ' + '\u20bd' + (item.price > 1000 ?  '/тонна' : '/кг')}
                            </Text> */}
                         
                            <View style = {{
                                    padding: 7, 
                                    marginTop: 5,
                                    backgroundColor: '#778ca3',
                                    borderRadius: 10,
                                    borderWidth: 2,
                                    borderColor:'#b2bec3',
                                    elevation: 2
                                    }}>
                                <Text style = {[globalStyles.text, {
                                    alignSelf: 'center',
                                    fontSize: 18,
                                    }]}>
                                    {buttonString}
                                </Text>
                            </View>
                          
                    </TouchableOpacity>
                    </View>

                    {/* <View style = {{width: '100%'}}>
                    <TouchableOpacity onPress = {() => wastePress(item.num, item.type, item.typeId)}>
                                                      
                         
                            <View style = {{
                                    padding: 7, 
                                    marginTop: 5,
                                    backgroundColor: '#778ca3',
                                    borderRadius: 10,
                                    borderWidth: 2,
                                    borderColor:'#b2bec3',
                                    elevation: 2
                                    }}>
                                <Text style = {[globalStyles.text, {
                                    alignSelf: 'center',
                                    fontSize: 18,
                                    }]}>
                                    {item.type}
                                </Text>
                            </View>
                          
                    </TouchableOpacity>
                    </View> */}
            </View>

            
        </View>

    )
}



export const wasteImage = {
    wasteTypes: {
        '0': {uri: 'https://knopka-r-site.web.app/assets/waste-plastic-0.png'},
        '1': {uri: 'https://knopka-r-site.web.app/assets/waste-paper-3.png'},
        '2': {uri: 'https://knopka-r-site.web.app/assets/batteries.png'},
        '3': {uri: 'https://knopka-r-site.web.app/assets/tires.png'}
    }
}

