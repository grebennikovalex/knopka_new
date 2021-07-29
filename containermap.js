import React, { Component } from 'react'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { globalStyles } from './globalstyle'
import { wasteColors } from './wastetab'
import { View,  Text, Image, TouchableOpacity } from 'react-native'
import { db } from './config'



export default class Containermap extends Component {
state = {
    latitude: 56.3286700,
    longitude: 44.0020500,

    marks: [{ place: '', placeId: 0, distance: 0,
        coords: {latitude: 0, longitude: 0 },
        containers: [] }]
}

getMarks = () => {
    db.ref('/coords/location_001/').once('value', snapshot => {
        let marks = Object.values(snapshot.val())
        this.setState({marks}) 
    })
}

componentDidMount() {
    this.getMarks()
}

render(){
    return (
    <View style = {[globalStyles.container, {backgroundColor: wasteColors[0], alignItems: 'stretch'}]}>
            <View style = {[globalStyles.headerWastes,{marginBottom: 20, marginTop: 28}]}>
                <TouchableOpacity onPress={() => this.props.navigation.goBack(null)}>
                <Text style = {{fontSize: 25, paddingBottom: 5, fontFamily: 'icons', color: '#778ca3'}}>
                {'\uf3e5  '}
                </Text>
                </TouchableOpacity>
            <Text style = {[globalStyles.text, {paddingLeft: 10, color: '#778ca3'}]}>
                КОНТЕЙНЕРЫ
            </Text>
            </View>
            <MapView 
                    style={{flex: 1}} 
                    provider={PROVIDER_GOOGLE}
                    initialRegion={{
                        latitude: this.state.latitude,
                        longitude: this.state.longitude,
                        latitudeDelta: 50,
                        longitudeDelta: 50
                    }}
                    >                      

                       {this.state.marks.map((mark, i) => (
                            <Marker 
                            key={i}
                            coordinate={mark.coords}
                            title={mark.place}
                            description={'контейнеров - ' + mark.containers.length.toString()}
                            
                            >
                            <View>
                                <Image 
                                source = {require('./assets/knp-app.png')}
                                style={{width: 40, height: 40}}/>
                            </View>
                            </Marker>
                       )

                       )}
                      
                       
            </MapView>
    
    </View>
    )
}

}