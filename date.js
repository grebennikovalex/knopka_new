import React from 'react'
import { View, Text } from 'react-native'


const ItemDate = ({timestamp, mode, textStyle }) => {

    let date = new Date(timestamp)

    let day = date.getDate()
    if(day.toString().length === 1) day = '0' + day

    let month = date.getMonth() + 1 
    if(month.toString().length === 1) month = '0' + month

    let hour = date.getHours()
    if(hour.toString().length === 1) hour = '0' + hour

    let minutes = date.getMinutes()
    if(minutes.toString().length === 1) minutes = '0' + minutes

if(mode === 'full')
    return(
        <View>
            <Text style = {textStyle}>
                {
                day + '.' +
                month + '.' + 
                date.getFullYear() + ' ' +
                hour + ':' +
                minutes
                }
            </Text>
        </View>
    )

if(mode === 'date')
    return(
        <View>
            <Text style = {textStyle}>
                {
                day + '.' +
                month + '.' + 
                date.getFullYear()
                }
            </Text>
        </View>
    )

if(mode === 'time')
    return(
        <View>
            <Text style = {textStyle}>
                {
                hour + ':' +
                minutes
                }
            </Text>
        </View>
    )

}

export default ItemDate