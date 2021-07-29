import React, { createContext, useState } from 'react'

export const EcoOfficeContext = createContext()

const EcoOfficeContextProvider = props => {

    const colors = ['#33d9b2', '#ffb142', '#45aaf2']

    const [officeConts, setOfficeConts] = useState([
        {id: 3, type: 'ПЛАСТИК', number: 0, image: 'https://firebasestorage.googleapis.com/v0/b/knoprka-e6c2e.appspot.com/o/knopka%2Fassets%2Fwaste-plastic-0.png?alt=media&token=66b0f036-936c-4f32-b542-d77c002770e5' },
        {id: 2, type: 'БУМАГА', number: 0, image: 'https://firebasestorage.googleapis.com/v0/b/knoprka-e6c2e.appspot.com/o/knopka%2Fassets%2Fwaste-paper-3.png?alt=media&token=f9ab5fd9-1a28-4fa8-87a2-5fc7fe1ae58c'},
        {id: 1, type: 'СТЕКЛО', number: 0, image: 'https://firebasestorage.googleapis.com/v0/b/knoprka-e6c2e.appspot.com/o/knopka%2Fassets%2Fwaste-glass-0.png?alt=media&token=d2bf86b0-38eb-4e34-ba38-79076b450e07'},
        {id: 4, type: 'БАТАРЕЙКИ', number: 0, image: 'https://firebasestorage.googleapis.com/v0/b/knoprka-e6c2e.appspot.com/o/knopka%2Fassets%2Fbatteries.png?alt=media&token=4c802d4c-d15e-49c1-93ee-558586b83e5e'}
    ])

    const [currentColor, setCurrentColor] = useState('#33d9b2')

    const officeContsModificator = (id, number) => {
        setOfficeConts(officeconts => {
            return officeconts.map(item => {
                if(item.id === id) item.number = number
                return item
            })
        })

        
    }

    const setColor = i => {
      setCurrentColor(colors[i])
      
        }

    return(
        <EcoOfficeContext.Provider value={{
            officeConts,
            currentColor,
            officeContsModificator,
            setColor
            }}>
            {props.children}
        </EcoOfficeContext.Provider>
    )

}

export default EcoOfficeContextProvider