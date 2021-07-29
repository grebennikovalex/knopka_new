import React, { useState }   from 'react'
import { View,  Text,  FlatList, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native'
import ContainerItem from './containeritem'
// import { TouchableOpacity } from 'react-native-gesture-handler'

let values = {
    place: '',
    type: '',
    num: 0,
    placeId: 0,
    typeId: 0,
    name: '',
    phone: '+7',
    email: '',
    date: '',
    color: 'rgba(180, 180, 180, 1)'

}

const d = Dimensions.get('screen').width

const Containerselection = ({ mark, navigation, pCheck }) => {

    const [sample, setSample] = useState(true)

    const wastePress = item => {

        values.image = item.image
        values.type = item.type
        values.typeId = item.typeId
        values.num = item.num
        values.place = mark.place
        values.placeId = mark.placeId   
        navigation.navigate('Containerform', {values: values})
    }

    let proximity = 150
    let dist = mark.distance.toFixed(2)

    if(!pCheck){
        proximity = 10000
    }
    

return (
    <View style={{alignItems: 'center', flex: 1}}>
        
        <View style={{width: '90%', borderColor: 'white', borderBottomWidth: 3}}>
        {mark.containers.length ?
            <View style={{alignItems: 'center', marginTop: d*0.02}}>
            <Text style={{fontSize: d * 0.035, color: '#778ca3'}}>
           {dist < proximity ? 'эта площадка находится в ' + dist * 1000 + ' м от вас' : 'рядом с вами нет контейнерных площадок, показываем пример площадки'}
            </Text>
                <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical: d*0.006}}>
                   
                <Text style={{fontFamily: 'custom', fontSize: d * 0.05, color: '#778ca3', marginBottom: d*0.02}}>
                {dist < proximity ? '№' + mark.placeId + ' - ' + mark.place : null}
                </Text>
                
                </View>
            </View>
            :
            null
        }
        </View>
    
    {!mark.containers.length ? 
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
    <ActivityIndicator size = 'large' color = '#778ca3'/>
    </View> 
        :  dist < proximity ?  
    <FlatList
        numColumns = {2}
        data = {mark.containers}
        keyExtractor = {item => item.num}
        renderItem = {({item}) => (                       
            <ContainerItem
                id = {item.typeId}
                wastePress = {wastePress}
                item = {item}/> )}
            />

            : 

            sample ?
           
            <View style={{flex: 1, alignSelf: 'center'}}>
                <View style={{ margin: d*0.05, justifyContent: 'center', borderColor: '#a1b3c7', }}>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center'}}
                onPress={() => setSample(false)}
                >
                <Text style={{ color: '#a1b3c7',
                 margin: d*0.01, fontSize: d*0.04, fontWeight: 'bold', marginHorizontal: d*0.02}}>
                    {`показать ближайшую`} 
                </Text>
                </TouchableOpacity>
                </View> 
            </View> 
            
            : 
            
            <FlatList
                numColumns = {2}
                data = {mark.containers}
                keyExtractor = {item => item.num}
                renderItem = {({item}) => (                       
                    <ContainerItem
                        id = {item.typeId}
                        wastePress = {wastePress}
                        item = {item}/> )}
                    />
        }
          
        </View>
)
}
export default Containerselection