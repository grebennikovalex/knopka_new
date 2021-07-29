import React, { useState } from 'react'
import { View,  Text, TouchableOpacity, Image, Dimensions, ScrollView, TouchableWithoutFeedback } from 'react-native'
import Modal from 'react-native-modal'
import { globalStyles } from './globalstyle'


const buttonString = ' ВЫВЕЗТИ '

const d = Dimensions.get('screen').width * 0.4

export default function WasteItem ({ id, item, wastePress }) {

    const [modalOn, setModal] = useState(false)

    return(
        <View>
        <View style = {globalStyles.wasteItem}>
                    <TouchableOpacity onPress = {() => setModal(true)}>      
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
                            <Image source = {wasteImage.wasteTypes[id]}
                                style = {{height: d, width: d}}/>            
      
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
                    <TouchableOpacity onPress = {() => wastePress(id)}>
                            <Text style = {{
                                    alignSelf: 'center',
                                    fontFamily: 'custom',
                                    fontSize: d * 0.09,
                                    color: 'white',
                                    textShadowColor: 'rgba(0, 0, 0, 0.5)',
                                    textShadowOffset: {width: 1, height: 1},
                                    textShadowRadius: 7
                                    }}>
                                {' ' + item.type + ' '}
                            </Text>
                            <Text style = {{fontSize: 15, color: 'black', alignSelf: 'center'}}>
                                {item.price + ' ' + '\u20bd' + (item.price > 1000 ?  '/тонна' : '/кг')}
                            </Text>
                         
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
            </View>

            <Modal                  
                isVisible = {modalOn}
                animationIn	= 'slideInRight'
                animationOut = 'fadeOutUpBig'
                animationInTiming={500}
                onSwipeComplete={() => setModal(false)}
                onBackButtonPress={() => setModal(false)}
                swipeDirection={['left', 'right', 'down', 'up' ]}
                propagateSwipe 
                backdropColor='#778ca3'
                style={{justifyContent: 'flex-start'}}
                >
<View style={{paddingBottom: d * 0.5, backgroundColor: 'rgba(0,0,0,0)', borderRadius: 20}}>
                <View style = {{                   
                        alignSelf: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: Dimensions.get('screen').width * 0.9,
                        height: Dimensions.get('screen').height * 0.65,
                        backgroundColor: 'white',
                        borderRadius: 20,
                        borderWidth: 2,
                        borderColor: '#778ca3',
                        paddingHorizontal: 25,
                        paddingTop: 5,
                        elevation: 5  
                        }}>
                            

                    
                    <Image source = {wasteImage.wasteTypes[id]}
                           style = {{height: d * 0.75, width: d * 0.75}}/> 

                   
                        <Text style = {{fontSize: d * 0.1, fontFamily: 'custom'}}>
                            {item.type}
                        </Text>
                        
                        
                        <ScrollView style = {{marginTop: 10, flex: 1, marginBottom: 0}}>
                            <TouchableWithoutFeedback>
                            <Text style={{
                                marginVertical: 15,
                                fontSize: d * 0.1,
                                textAlign: 'left'
                                }}>
                                    {item.description}
                            </Text>
                            </TouchableWithoutFeedback>
                        </ScrollView>
                       
                    
                   
                        <View style = {{
                                        width: '100%',
                                        padding: 7, 
                                        marginTop: 15,
                                        backgroundColor: '#778ca3',
                                        borderRadius: 10,
                                        borderWidth: 2,
                                        borderColor: '#b2bec3',
                                        elevation: 2
                                        }}>
                    <TouchableOpacity onPress = {() => {
                        wastePress(id)
                        setModal(false)
                        }}>
                               
                                    <Text style = {[globalStyles.text, {
                                        alignSelf: 'center',
                                        fontSize: 18                                       
                                        }]}>
                                        {buttonString}
                                    </Text>
                                
                    </TouchableOpacity>
                    </View>

                        <View style={{
                            
                            
                            alignItems: 'center',  
                            marginTop:  -d * 0.2,                            
                            position: 'relative',
                            top: d * 0.4,
                            
                            }}>
                            
                                <Text style={{fontFamily: 'icons', fontSize: d * 0.3, color: 'white' }}>
                                                    {'\uf103'}
                                </Text>
                            
                        </View>
                    </View> 
               
                    </View>
            </Modal>
        </View>

    )
}


export const wasteImage = {
    wasteTypes: {
        '0': {uri: 'https://knopka-r-site.web.app/assets/waste-glass-0.png'},
        '1': {uri: 'https://knopka-r-site.web.app/assets/waste-glass-1.png'},
        '2': {uri: 'https://knopka-r-site.web.app/assets/waste-glass-2.png'},
        '3': {uri: 'https://knopka-r-site.web.app/assets/waste-glass-3.png'},
        '4': {uri: 'https://knopka-r-site.web.app/assets/waste-plastic-0.png'},
        '5': {uri: 'https://knopka-r-site.web.app/assets/waste-plastic-1.png'},
        '6': {uri: 'https://knopka-r-site.web.app/assets/waste-plastic-2.png'},
        '7': {uri: 'https://knopka-r-site.web.app/assets/waste-plastic-3.png'},
        '8': {uri: 'https://knopka-r-site.web.app/assets/waste-plastic-4.png'},
        '9': {uri: 'https://knopka-r-site.web.app/assets/waste-plastic-5.png'},
        '10': {uri: 'https://knopka-r-site.web.app/assets/waste-paper-0.png'},
        '11': {uri: 'https://knopka-r-site.web.app/assets/waste-paper-1.png'},
        '12': {uri: 'https://knopka-r-site.web.app/assets/waste-paper-2.png'},
        '13': {uri: 'https://knopka-r-site.web.app/assets/waste-paper-3.png'}
    }
}


