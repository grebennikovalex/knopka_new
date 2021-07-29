import React, { useState, useEffect } from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { AppLoading } from 'expo'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import WasteSelection from './wasteselection'
import Orderform from './orderform'
import Confirmation from './confirmation'
import Containerform from './containerform'
import Containermap from './containermap'
import Statistics from './statistics'
import History from './history'
import EcoOfficeContextProvider from './ecoofficecontext'
import * as Updates from 'expo-updates'
import { useFonts } from 'expo-font'
import { VER_NUMBER } from './config'

const Stack = createStackNavigator()

console.disableYellowBox = true

export default function App()  {

  // const [fontsLoaded, setFontsLoaded] = useState(false)
  let [fontsLoaded] = useFonts({
    'custom': require('./assets/fonts/MPLUSRounded1c-Black.ttf'),
    'knp': require('./assets/fonts/knp.ttf'),
    'icons': require('./assets/fonts/fa-solid-900.ttf')
  })

  
  const [button, setButton] = useState(false)
  const [check, setCheck] = useState(false)

  useEffect(() => {

    Updates.checkForUpdateAsync().then(update => {

      if(update.isAvailable) {

        setCheck(true)

        Updates.fetchUpdateAsync().then(fetched => {
          if(fetched.isNew) setButton(true)
        })
      }
    })
  
  },[])

if(fontsLoaded && check) {
  return (
      <View style={{flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'flex-end', padding: 0}}>
        <Image
              source = {require('./assets/splash.png')}
              style={{ width: '100%', height: '100%',  position: 'absolute'
              }}/>
        
          <Text style={{ margin: 5, fontSize: 15, fontStyle: 'bold'}}>
            {'доступно обновление ' + VER_NUMBER}
          </Text>
          
          <TouchableOpacity 
            disabled={!button}
            onPress={() => Updates.reloadAsync()}>
                <View style = {[globalStyles.button, {borderColor: '#dfe6e9', backgroundColor: 'white'}]}>
                    <Text style = {[globalStyles.text, {color: button ? '#778ca3' : '#eee' }]}> {' загрузить '} </Text>
                </View>
          </TouchableOpacity>  
            
      </View>
)}

  
if(fontsLoaded){
    return (
     
      <EcoOfficeContextProvider>
      <NavigationContainer>
      <Stack.Navigator 
        initialRouteName = 'WasteSelection' 
        headerMode = 'none'
        >
          <Stack.Screen name = 'WasteSelection'  component = {WasteSelection} />
          <Stack.Screen name = 'Orderform'  component = {Orderform} />
          <Stack.Screen name = 'Confirmation'  component = {Confirmation} />
          <Stack.Screen name = 'Containerform'  component = {Containerform} />
          <Stack.Screen name = 'Containermap'  component = {Containermap} />
          <Stack.Screen name = 'Statistics'  component = {Statistics} />
          <Stack.Screen name = 'History'  component = {History} />
      </Stack.Navigator>
      </NavigationContainer>
      </EcoOfficeContextProvider>
         
    )

  } else {
    return (
    <AppLoading 
      // startAsync = {getFonts}
      // onFinish = {() => setFontsLoaded(true)}
      />
      )
  }

}
