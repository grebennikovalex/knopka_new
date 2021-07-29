import React, { useState } from 'react'
import { View, Platform, TouchableOpacity, Text  } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { globalStyles } from './globalstyle'


const DateTime = ({initialDate, dateFinal}) => {
  
  const [date, setDate] = useState(new Date(initialDate))
  const [time, setTime] = useState(new Date(initialDate))
  
  const [showTime, setShowTime] = useState(false)
  const [showDate, setShowDate] = useState(false)

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date
    setShowDate(Platform.OS === 'ios' ? true : false)
    setDate(currentDate)
    
  }

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time
    setShowTime(Platform.OS === 'ios' ? true : false)
    setTime(currentTime)
    
  }

  let today = new Date(time.getFullYear(), time.getMonth(), time.getDate())
  let diff = time - today
  let dateTemp = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() + diff 
  dateFinal = new Date(dateTemp)
 
  
  
  return (
    
    <View>
    <View style = {[globalStyles.inputSmallContainer, {alignItems: 'flex-start'}]}>
                            <TouchableOpacity 
                                onPress = {() => setShowDate(true)} 
                                style = {[globalStyles.button, {width: '45%', margin: 0, marginTop: 5, borderColor: '#dfe6e9', backgroundColor: 'white'}]}>
                                    <Text style = {[globalStyles.text, {color: '#778ca3' }]}>
                                        {dateFinal.getDate() + '-' + (parseInt(dateFinal.getMonth()) + 1) + '-' + dateFinal.getFullYear()}
                                    </Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress = {() => setShowTime(true)}
                                style = {[globalStyles.button, {width: '45%', margin: 0, marginTop: 5, borderColor: '#dfe6e9', backgroundColor: 'white'}]}>
                                    <Text style = {[globalStyles.text, {color: '#778ca3' }]}>
                                        {dateFinal.getHours() + ':' + dateFinal.getMinutes()}
                                    </Text>
                            </TouchableOpacity>
    </View>
                       
      
      <View>

      {showTime && (
        <DateTimePicker
          testID = 'dateTimePicker'
          timeZoneOffsetInMinutes = {0}
          value = {time}
          mode = 'time'
          is24Hour = {true}
          display = 'default'
          onChange = {onTimeChange}
        />
      )}
    
      </View>

      <View>
      
      {showDate && (
        <DateTimePicker
          testID = 'dateTimePicker'
          timeZoneOffsetInMinutes = {0}
          value = {time}
          mode = 'date'
          display = 'default'
          onChange = {onDateChange}
        />
      )}
    
    </View>
    
  </View>  

  )
}

export default DateTime