import React, { useState, useEffect, useCallback } from 'react'
import { View,  Text, TouchableOpacity, FlatList, Dimensions, StyleSheet, ImageBackground, ScrollView } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { db } from './config'
import firebase from 'firebase'


const d = Dimensions.get('screen').width

const inactiveColor = '#b2bec3'
const inactiveBack = '#eee'
const activeColor = '#006266'
const activeBack = '#fff'



const Statistics = ({ navigation }) => {

    let thisYear = new Date().getFullYear()

    const [screens, setScreen] = useState([
        {name: 'Экологический эффект', color: activeColor, backgrColor: activeBack},
        {name: 'Сдано вторсырья', color: inactiveColor, backgrColor: inactiveBack},
        {name: 'Сдано отходов', color: inactiveColor, backgrColor: inactiveBack}
    ])

    const [months, setMonths] = useState([
        {name: 'за все время', color: activeColor, backgrColor: activeBack},
        {name: 'за ' + thisYear + ' г.', color: inactiveColor, backgrColor: inactiveBack},
        {name: 'январь', color: inactiveColor, backgrColor: inactiveBack},
        {name: 'февраль', color: inactiveColor, backgrColor: inactiveBack},
        {name: 'март', color: inactiveColor, backgrColor: inactiveBack},
        {name: 'апрель', color: inactiveColor, backgrColor: inactiveBack},
        {name: 'май', color: inactiveColor, backgrColor: inactiveBack},
        {name: 'июнь', color: inactiveColor, backgrColor: inactiveBack},
        {name: 'июль', color: inactiveColor, backgrColor: inactiveBack},
        {name: 'август', color: inactiveColor, backgrColor: inactiveBack},
        {name: 'сентябрь', color: inactiveColor, backgrColor: inactiveBack},
        {name: 'октябрь', color: inactiveColor, backgrColor: inactiveBack},
        {name: 'ноябрь', color: inactiveColor, backgrColor: inactiveBack},
        {name: 'декабрь', color: inactiveColor, backgrColor: inactiveBack}    
    ])

    const [screenNum, setSecreenNum] = useState(0)
    const [timeSpan, setTimeSpan] = useState(0)
      
    const [orders, setOrders] = useState([])
    const [user, setUser] = useState([])
    
    const [totalWeight, setTotalWeight] = useState(0)
    const [totalOrders, setTotalOrders] = useState(0)
    
    const [totalGlass, setTotalGlass] = useState(0)
    const [totalPlastic, setTotalPlastic] = useState(0)
    const [totalPaper, setTotalPaper] = useState(0)
    
    const [glassArray, setTotalGlassArray] = useState(0)
    const [plasticArray, setTotalPlasticArray] = useState(0)
    const [paperArray, setTotalPaperArray] = useState(0)
    
    const [paperStat, setPaperStat] = useState([])
    const [plasticStat, setPlasticStat] = useState([])
    const [glassStat, setGlassStat] = useState([])
           
    const [trees, setTrees] = useState(0)
    const [litres, setLitres] = useState(0)
    const [kWatts, setKWatts] = useState(0)  
    
    useFocusEffect(

        useCallback(() => {
            
            setUser(firebase.auth().currentUser) 
       
          }, [])
    )

    useEffect(() => {

        // setUser(firebase.auth().currentUser) 
    
        user ? 
                db.ref('/users/' + user.uid).on('value', snapshot => {
                const newItems = Object.values(snapshot.val())
                setOrders(newItems.filter(item => item.type && !item.ecoconts))
                })
             : 
                setOrders([])

                
        setSelected(new Date().getMonth() + 2)
        setTimeSpan(new Date().getMonth())
        calculate(new Date().getMonth() + 2)

        console.log(timeSpan)
       
    },[orders.length, user]) 

    const calculate = key => {

        let items = []
    
        if(key === 0) items = orders
        if(key === 1) items = orders.filter(item => {
            return new Date(item.removalDate).getFullYear() == thisYear
        })
        if(key > 1) items = orders.filter(item => {
            return new Date(item.removalDate).getFullYear() == thisYear && new Date(item.removalDate).getMonth() == (key - 2)
        })

        setTotalOrders(items.length)
        setTimeSpan(key-2)
    
        let tot = 0
    
        let totPl = 0
        let totPap = 0
        let totGl = 0
    
        let plastic = []
        let paper = []
        let glass = []
    
        let plasticStat = []
        let paperStat = []
        let glassStat = []
    
        items.map(item => {
            tot = tot + parseFloat(item.quantity)
    
            if(parseInt(item.id) < 4) {
                totGl = totGl + parseFloat(item.quantity)
                glass.push(item)
            }
            if(parseInt(item.id) > 3 && parseInt(item.id) < 10) {
                totPl = totPl + parseFloat(item.quantity)
                plastic.push(item)
            }
            if(parseInt(item.id) > 9) {
                totPap = totPap + parseFloat(item.quantity)
                paper.push(item)
            }
            
        })
    
        for (let i = 0; i < 4; i++) {
    
            let plTemp = {total: 0, type: ''}
    
            glass.map(item => {
                if(parseInt(item.id) === i) {
                    plTemp.total = plTemp.total + parseFloat(item.quantity)
                    plTemp.type = item.type
                }
                
            })
    
            glassStat.push(plTemp)      
        
        }
    
    
    
        for (let i = 4; i < 10; i++) {
    
            let plTemp = {total: 0, type: ''}
    
            plastic.map(item => {
                if(parseInt(item.id) === i) {
                    plTemp.total = plTemp.total + parseFloat(item.quantity)
                    plTemp.type = item.type
                }
                
            })
    
            plasticStat.push(plTemp)      
        
        }
    
        for (let i = 10; i < 14; i++) {
    
            let plTemp = {total: 0, type: ''}
    
            paper.map(item => {
                if(parseInt(item.id) === i) {
                    plTemp.total = plTemp.total + parseFloat(item.quantity)
                    plTemp.type = item.type
                }
                
            })
    
            paperStat.push(plTemp)      
        
        }
    
        setTotalWeight(tot)
    
        setTotalGlass(totGl)
        setTotalPlastic(totPl)
        setTotalPaper(totPap)
    
        setTotalGlassArray(glass)
        setTotalPlasticArray(plastic)
        setTotalPaperArray(paper)
    
        setPlasticStat(plasticStat)
        setPaperStat(paperStat)
        setGlassStat(glassStat)

        setTrees(totPap/100)
        setLitres(totPap*20)
        setKWatts((totPap + totPl*.00577).toFixed(2))
    
    }
    
 
    const setSelected = key => {
     
        setMonths(months => {
            return months.map((item, index) => {
                item.color = inactiveColor
                item.backgrColor = inactiveBack 
            if (index === key) {
                item.color = activeColor
                item.backgrColor = activeBack
                }
            return item
            })
        })
    }

    const setSelectedScreen = key => {
     
        setScreen(screens => {
            return screens.map((item, index) => {
                item.color = inactiveColor
                item.backgrColor = inactiveBack 
            if (index === key) {
                item.color = activeColor
                item.backgrColor = activeBack
                }
            return item
            })
        })
    }

    
    
        

    return (
        <View style={{marginTop: 30 }}>
             <ImageBackground 
                    source = {require('./assets/knp_backGb.png')}
                    style = {{ height: '100%', width: '100%'}}
                    imageStyle = {{resizeMode : 'repeat'}}>
        <View style={{padding: 10, paddingLeft: 0, flexDirection: 'row'}}>
            <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                <Text style = {{fontSize: 25, paddingLeft: 25, paddingBottom: 5, fontFamily: 'icons', color: activeColor}}>
                {'\uf3e5  '}
                </Text>
            </TouchableOpacity>
            <Text style={{fontFamily: 'custom', fontSize: 20, color: activeColor }}>
                {'Моя статистика'}
            </Text>
        </View>
   
    
                <View style = {{ paddingHorizontal: 10 }}>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={screens}
                        renderItem={({item, index}) => (
                            <TouchableOpacity style={{flex: 1}} key={index} onPress = {() => {
                                setSelectedScreen(index)
                                setSecreenNum(index)
                            }}>
                                <View
                                style={{ backgroundColor: item.backgrColor, borderRadius: d * 0.12 /2,
                                    alignItems: 'center', justifyContent: 'center', height: d * 0.12, paddingHorizontal: 15,
                                    marginHorizontal: 7, marginVertical: 5
                                }}>
                                <Text style = {{ fontFamily: 'custom', color: item.color, fontSize: d * 0.04 }}>
                                {item.name}
                                </Text>
                                </View>
                        </TouchableOpacity>
                    )}

                    />
                
                </View>
    

       

            <View style = {{ paddingHorizontal: 10 }}>
                <FlatList
                    initialScrollIndex={new Date().getMonth() + 1}
                    getItemLayout={(data, index) => (
                        {length: d*0.35+d*0.02, offset: (d*0.35+d*0.02) * index, index}
                      )}
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    data={months}
                    renderItem={({item, index}) => (
                        <TouchableOpacity style={{flex: 1}} key={index} onPress={() => {
                             setSelected(index)
                             calculate(index)
                             }}>
                            <View style={{ backgroundColor: item.backgrColor, paddingHorizontal: d*0.05, height: d*0.1, magrinHorizontal: 3,
                            borderRadius: d*0.05, justifyContent: 'center', marginHorizontal: d*0.01, width: d*0.35}}>
                                <Text style={{color: item.color, textAlign: 'center'}}>{item.name}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                
                    />
            </View>
            <ScrollView>
           
            {user ?
            
                <View style={{margin: 15}}>
                    
                        {screenNum === 0 ?
                        <View>
                        {totalOrders ?
                            <View>
                                <View style={{padding: 10}}>
                                    <Text>{'Всего заказов: ' + totalOrders}</Text>
                                </View>

                                <View style={{flex: 1}}>
                                    {trees ?
                                    <View style={style.block}>
                                        <View style={[style.iconBox, {backgroundColor: '#6ab04c'}]}>
                                        <Text style={style.icon}>{'\uf4d8'}</Text>
                                        </View>
                                        <View style={style.textBox}>
                                        <Text style={[style.text, {fontSize: d*0.05}]}>{trees}</Text>
                                        <Text style={style.text}>{'деревьев спасено'}</Text>
                                        </View>
                                    </View> : null}
                                    {litres ? 
                                    <View style={style.block}>
                                        <View style={[style.iconBox, {backgroundColor: '#22a6b3'}]}>
                                        <Text style={style.icon}>{'\uf043'}</Text>
                                        </View>
                                        <View style={style.textBox}>
                                        <Text style={[style.text, {fontSize: d*0.05}]}>{litres + ' литров'}</Text>
                                        <Text style={style.text}>{ 'воды сэкономлено'}</Text>
                                        </View>
                                    </View> : null}
                                    {kWatts ? 
                                    <View style={style.block}>
                                        <View style={[style.iconBox, {backgroundColor: '#f0932b'}]}>
                                        <Text style={style.icon}>{'\uf0e7'}</Text>
                                        </View>
                                        <View style={style.textBox}>
                                        <Text style={[style.text, {fontSize: d*0.05}]}>{kWatts + ' Квт'}</Text>
                                        <Text style={style.text}>{'электроэнергии сэкономлено'}</Text>
                                        </View>
                                    </View> : null}
                                </View>
                            </View>
                                : 
                                <View style={{marginLeft: 25, marginVertical: 25}}>
                                    <Text>{'У вас не было заказов...'}</Text>
                                </View>}
                        </View> : null}

                    {screenNum === 1 ?
                    <View>
                    {totalOrders ?
                    <View>

                        <View style={{marginLeft: 30}}>
                            <Text>{'Всего заказов:  ' + totalOrders}</Text>
                            {totalWeight ? <Text>{'Всего, кг  ' + totalWeight}</Text> : null}
                        </View>

                    {totalGlass ?
                        <View style={{margin: 5, backgroundColor: '#fff', borderRadius: d*0.03 }}>
                            <View style={style.block}>
                                <View style={[style.iconBox, {backgroundColor: '#33d9b2'}]}>
                                    
                                        <Text style={[style.icon, {fontFamily: 'knp'}]}>{1}</Text>
                                    
                                    
                                </View>
                                <View style={style.textBoxHeader}>
                                    <Text style={{ color: activeColor, fontFamily: 'custom', fontSize: d*0.045}}>{'Стеклобой'}</Text>
                                    <Text style={{fontWeight: 'bold', fontSize: d*0.045}}>{totalGlass + ' кг. '}</Text>
                                </View>
                            </View>
                            <View style={{marginLeft: 25}}>
                                {glassStat.map((item, i) => (
                                    item.type ? (
                                    <View  key={i} style={{flexDirection: 'row'}}>
                                        <View style={{  width: '80%', padding: 2}}>
                                            
                                            <Text style={{fontSize: d*0.035}}>{item.type}</Text>
                                        </View>
                                        <View style={{  width: '20%', padding: 2}}>
                                            <Text style={{fontSize: d*0.035}}>{item.total + ' кг.'}</Text>
                                        </View>
                                    </View>
                                    ) : null
                                ))}
                            </View>
                        </View> : null }

                    {totalPlastic ?
                        <View style={{margin: 5, backgroundColor: '#fff', borderRadius: d*0.03 }}>
                            <View style={style.block}>
                                <View style={[style.iconBox, {backgroundColor: '#ffb142'}]}>
                                    
                                        <Text style={[style.icon, {fontFamily: 'knp'}]}>{3}</Text>
                    
                                </View>
                                <View style={style.textBoxHeader}>
                                    <Text style={{ color: activeColor, fontFamily: 'custom', fontSize: d*0.045}}>{'Пластик'}</Text>
                                    <Text style={{fontWeight: 'bold', fontSize: d*0.045}}>{totalPlastic + ' кг. '}</Text>
                                </View>
                            </View>
                            <View style={{marginLeft: 25}}>
                                {plasticStat.map((item, i) => (
                                    item.type ? (
                                    <View  key={i} style={{flexDirection: 'row'}}>
                                        <View style={{  width: '80%', padding: 3}}>
                                            
                                            <Text style={{fontSize: d*0.035}}>{item.type}</Text>
                                        </View>
                                        <View style={{  width: '20%', padding: 3}}>
                                            <Text style={{fontSize: d*0.035}}>{item.total + ' кг.'}</Text>
                                        </View>
                                    </View>
                                    ) : null
                                ))}
                            </View>
                        </View> : null }

                    {totalPaper ?
                         <View style={{margin: 5, backgroundColor: '#fff', borderRadius: d*0.05 }}>
                         <View style={style.block}>
                             <View style={[style.iconBox, {backgroundColor: '#45aaf2'}]}>
                                 
                                     <Text style={[style.icon, {fontFamily: 'knp'}]}>{2}</Text>
                                 
                                 
                             </View>
                             <View style={style.textBoxHeader}>
                                <Text style={{ color: activeColor, fontFamily: 'custom', fontSize: d*0.045}}>{'Макулатура'}</Text>
                                <Text style={{fontWeight: 'bold', fontSize: d*0.045}}>{totalPaper + ' кг. '}</Text>
                             </View>
                         </View>
                         <View style={{marginLeft: 25}}>
                             {paperStat.map((item, i) => (
                                 item.type ? (
                                 <View  key={i} style={{flexDirection: 'row'}}>
                                     <View style={{  width: '80%', padding: 2}}>
                                         
                                         <Text style={{fontSize: d*0.035}}>{item.type}</Text>
                                     </View>
                                     <View style={{  width: '20%', padding: 2}}>
                                         <Text style={{fontSize: d*0.035}}>{item.total + ' кг.'}</Text>
                                     </View>
                                 </View>
                                 ) : null
                             ))}
                         </View> 
                        </View> : null }
                    </View>
                        : 
                    <View style={{marginLeft: 25, marginVertical: 25}}>
                        <Text>{'У вас не было заказов...'}</Text>
                    </View> 
                                }
                    </View> : null}

                    {screenNum === 2 ?

                    <View style={{marginLeft: 25, marginVertical: 25}}>
                        <Text>{'Мы не принимаем отходы'}</Text>
                    </View> : null}
           
                
                </View>
                                
                :

                <View>
                    <Text style={{marginLeft: 25, marginVertical: 25}}>
                        {'Войдите в свой профиль или сделайте заказ'}
                    </Text>
                </View>
            }
            </ScrollView>
       
            </ImageBackground>
    </View>
    
       
    )
}

export default Statistics

const style = StyleSheet.create({

    block: {
        // flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
        height: d*.22,
        // padding: d*0.05,
        // paddingLeft: d*0.02,
        marginVertical: 3,
        alignItems: 'center',
        borderRadius: d*0.03,
    },
    textBox: {
        // width: '100%',
        padding: d*0.03,
        flex: 1,
        height: d*0.18,
        // borderColor: '#eee',
        // borderWidth: 2,
        // backgroundColor: '#ddd'
    },
    text: {
        fontSize: d*0.035,
        color: activeColor,
        fontFamily: 'custom'
    },
    iconBox: {
        alignItems: 'center',
        justifyContent: 'center',
        width: d*0.18,
        height: d*0.18,
        margin: d*.02, 
        borderColor: '#eee',
        borderWidth: 2,
        backgroundColor: '#ddd',
        borderRadius: d*0.03,
        elevation: 3
    },
    icon: {
        fontSize: d*0.08,
        fontFamily: 'icons',
        color: '#fff'
    },
    textBoxHeader: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        // width: '100%',
        padding: d*0.03,
        flex: 1,
        height: d*0.18,
        // borderColor: '#eee',
        // borderWidth: 2,
        // backgroundColor: '#ddd'
    },

})
