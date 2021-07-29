import React, { Component } from 'react'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import * as Permissions from 'expo-permissions'
import * as Location from 'expo-location'
import { View,  Text, Image, ActivityIndicator } from 'react-native'
import { globalStyles } from './globalstyle'
import { wasteColors } from './wastetab'
import { db } from './config'
import Containerselection from './containerselection'



 
export default class Containers extends Component {
    state = {
        location: null,

        mark: { place: '', placeId: 0, distance: 0,
        coords: {latitude: 0, longitude: 0 },
        containers: [] },

        marks: [{ place: '', placeId: 0, distance: 0,
        coords: {latitude: 0, longitude: 0 },
        containers: [] }],

        proximityCheck: true
    }
   
    getLocationAsync = async () => {
        let {status} = await Permissions.askAsync(Permissions.LOCATION)
            
            if (status === 'granted') {
                
                let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true })
                this.setState({location})

              } else {
                throw new Error('Location permission not granted');
              }

        db.ref('/coords/location_001/').once('value', snapshot => {
                let marks = Object.values(snapshot.val())
                this.setState({marks})
                this.setState({mark: this.state.marks[this.closest_marker(marks)]})
        })
            
            
         
         
    }

    // getContainers = () => {
    //     db.ref('/coords/location_001/').on('value', snapshot => {
    //     let marks = Object.values(snapshot.val())
    //     this.setState({marks})
    //     console.log(marks)
    //     })
    // }

    componentDidMount(){
        
        this.getLocationAsync()
        // this.getContainers()
             
    }
    
   
    componentWillUnmount(){
        this.setState({proximityCheck: true})
    }
    
    closest_marker(marks) {
    let lat = this.state.location.coords.latitude
    let lng = this.state.location.coords.longitude
    let R = 6371 // radius of earth in km
    let distances = []
    let closest = -1
    for( i=0; i < marks.length; i++ ) {
        let mlat = marks[i].coords.latitude
        let mlng = marks[i].coords.longitude
        let dLat  = (mlat - lat)*Math.PI/180
        let dLong = (mlng - lng)*Math.PI/180
        let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos((lat)*Math.PI/180) * Math.cos((lat)*Math.PI/180) * Math.sin(dLong/2) * Math.sin(dLong/2)
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
        let d = R * c
        distances[i] = d
        marks[i].distance = d
            if ( closest == -1 || d < distances[closest] ) {
                closest = i
            }
        }
        // console.log(distances)
        // console.log(closest)
    return closest 
    }

    
    
    
    render(){
        
    return(
        <View style = {[globalStyles.container, {backgroundColor: wasteColors[0], alignItems: 'stretch'}]}>
            <View style = {[globalStyles.headerWastes, {marginTop: 28}]}>
                <Text style = {[globalStyles.icon, {fontSize: 30, paddingBottom: 5, color: '#778ca3'}]}>
                    8
                </Text>
            
            <Text style = {[globalStyles.text, {paddingLeft: 10, color: '#778ca3'}]}>
                КОНТЕЙНЕРЫ
            </Text>
            </View>

            

            {this.state.location ?

            <MapView 
                    style={{flex: 1}} 
                    provider={PROVIDER_GOOGLE}
                    initialRegion={{
                        latitude: this.state.location.coords.latitude,
                        longitude: this.state.location.coords.longitude,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005
                    }}
                    >
                        
                       {this.state.marks.map((mark, i) => (
                            <Marker 
                            key={i}
                            coordinate={mark.coords}
                            title={mark.place}
                            description={'контейнеров - ' + mark.containers.length.toString()}
                            onPress={() => {
                                this.setState({mark})
                                this.setState({proximityCheck: false})
                                }}                            
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
                    :
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <ActivityIndicator size = 'large' color = '#778ca3'/>
            </View>}

            <View style={{flex: 4, backgroundColor: 'rgba(235,235,235,1)',
             }}> 
               <Containerselection mark={this.state.mark} navigation={this.props.navigation} pCheck={this.state.proximityCheck}/>
            </View>

        </View>
    )}
}

