import React, { Component } from 'react'
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps'
import * as Permissions from 'expo-permissions'
import * as Location from 'expo-location'
import { globalStyles } from './globalstyle'
import { wasteColors } from './wastetab'
import { View,  Text, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native'
import { db } from './config'

const d = Dimensions.get('screen').width * 0.25

export default class EcoPoints extends Component {

state = {
    location: null,

    lat: 0,
    long: 0,

    show: false,

    mark: {
        name: '',
        distance: 0,
        coords: { latitude: 0, longitude: 0 }
        },

    marks: [{ 
        distance: 0,
        name: '', 
        coords: { latitude: 0, longitude: 0 }
         }],
    
    dist: 0
}



  

getMarks = async () => {

    let {status} = await Permissions.askAsync(Permissions.LOCATION)
            
            if (status === 'granted') {
                
                let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true })
                this.setState({lat: location.coords.latitude, long: location.coords.longitude})
                this.setState({location})
                // console.log(this.state.location)

              } else {
                throw new Error('Location permission not granted');
              }

    db.ref('/ecopoints').once('value', snapshot => {
        let marks = Object.values(snapshot.val())
        this.setState({marks}) 
        this.state.marks.map(mark => mark.bhours =  "Пн-Пт 8:00-16:00 (обед 12:00-13:00),\nСб 8:00-14:00 (без обеда),\nВс-выходной")
        this.setState({mark: this.state.marks[this.closest_marker(marks)[0]]})
        this.setState({dist: this.closest_marker(marks)[1]})
        
    })
}

componentDidMount() {
    this.getMarks()
    
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
    return [closest,  distances[closest]] 
    }



render(){
    return (
    <View style = {[globalStyles.container, {backgroundColor: wasteColors[0], alignItems: 'stretch'}]}>
            <View style = {[globalStyles.headerWastes,{marginBottom: 20, marginTop: 28}]}>
                <TouchableOpacity onPress={() => this.props.navigation.goBack(null)}>
                <Text style = {{fontSize: 25, paddingBottom: 5, fontFamily: 'icons', color: '#228B22'}}>
                {'\uf3e5  '}
                </Text>
                </TouchableOpacity>
            <Text style = {[globalStyles.text, {paddingLeft: 10, color: '#228B22'}]}>
                ЭКО ПУНКТЫ
            </Text>
            </View>
            <View style={{backgroundColor: '#fff', borderRadius: 10, borderColor: '#ccc', borderWidth: 2, padding: 10, alignSelf: 'stretch', left: d*.5, width: d*3,
                position: 'absolute', top: d*.75,  zIndex: 10}}>
                    {this.state.mark.address ?
                        <TouchableOpacity onPress={() => {
                            this.setState({ 
                                    lat: this.state.mark.coords.latitude,
                                    long: this.state.mark.coords.longitude,
                                    show: true 
                                    })
                                   
                            }}>
                            <Text style={{fontSize: d*.15}}>
                                {`Ближайший пункт приема вторсырья находится в ${this.state.dist.toFixed(2)*1000} м от вас по адресу:\n${this.state.mark.address}`}
                            </Text>
                        </TouchableOpacity>
                            :
                        <ActivityIndicator
                                animating
                                size = 'small'
                                color = '#228B22'
                                style = {{
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                    }}
                                />}

            </View>
            {this.state.location ?
            <MapView 
                    style={{flex: 1}} 
                    provider={PROVIDER_GOOGLE}
                    loadingEnabled
                    region={{
                        latitude: this.state.lat,
                        longitude: this.state.long,
                        latitudeDelta: 0.02,
                        longitudeDelta: 0.02
                        }}
                    
                    onPress={() => this.setState({show: false})}
                        >     
                        {this.state.location &&
                            <Marker 
                                tracksViewChanges={false}
                                coordinate={this.state.location.coords}
                                title={'Вы здесь'}>
                                <View style={{height: d*.16, width: d*.16, borderRadius: d*.08, backgroundColor: 'rgba(34,139,34,0.3)', alignItems: 'center', justifyContent: 'center'}}>
                                <View style={{height: d*.08, width: d*.08, borderRadius: d*.04, backgroundColor: '#228B22'}}></View>
                                </View>
                            </Marker>}

                        {this.state.show &&
                            <Marker
                                tracksViewChanges={false}
                                coordinate={this.state.mark.coords}
                                >
                                <Image 
                                source = {require('./assets/istok-logo.png')}
                                style={{width: d*0.4, height: d*0.4}}/>
                                    
                            </Marker>}                  

                        {this.state.marks.map((mark, i) => (
                          
                            <Marker 
                                tracksViewChanges={false}
                                key={i}
                                coordinate={mark.coords}
                                title={mark.name}
                                >
                            
                                <Image 
                                source = {require('./assets/istok-logo.png')}
                                style={{width: d*0.4, height: d*0.4}}/>
                            
                            <Callout tooltip>
                                <View style={{width: d*3, padding: 10, margin: 10, backgroundColor: '#fff', borderColor: '#ccc', borderWidth: 2,
                                    flexDirection: 'column', alignItems: 'center', borderRadius: d*0.1 }}>
                                                                       
                                    <Text style={{fontFamily: 'custom'}}>
                                        { mark.address }
                                    </Text>

                                    <Text>
                                        {'Батарейки - ' + (mark.batteries ? 'принимаем' : 'не принимаем')}
                                    </Text>

                                    <Text>
                                        {mark.bhours}
                                    </Text>

                                </View>
                            </Callout>
                            
                           
                            </Marker>
                       )

                       )}
                      
                       
            </MapView> 
            :
             <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
             <ActivityIndicator size = 'large' color = '#228B22'/>
         </View>}
    
    </View>
    )
}

}