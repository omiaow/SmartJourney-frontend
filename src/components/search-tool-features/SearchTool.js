import React from 'react'
import '../../styles/search-tool.css'
import { currencies } from '../../data/state'
import OriginInput from './OriginInput'
import DestinationInput from './DestinationInput'
import DatesInput from './DatesInput'
import { useNavigate } from "react-router-dom"

function SearchTool() {

    const [origin, setOrigin] = React.useState(undefined)
    const [originFocus, setOriginFocus] = React.useState(false)
    const [destinations, setDestinations] = React.useState([])
    const [destinationFocus, setDestinationFocus] = React.useState(false)

    const [startDate, setStartDate] = React.useState(undefined)
    const [endDate, setEndDate] = React.useState(undefined)
    const [dateFocus, setDateFocus] = React.useState(false)
    
    const [roundtrip, setRoundtrip] = React.useState(false)
    const [currency, setCurrency] = React.useState('USD')
    const [currencyFocus, setCurrencyFocus] = React.useState(false)
    const history = useNavigate()

    const startSearch = () => {
        if (origin && destinations.length > 0 && startDate) {
            let checkDestination = true
            let destinationsString = ''
            destinations.forEach((item) => {
                if (item.air === origin.air) checkDestination = false
                destinationsString += `${item.air}+`
            })
            destinationsString = destinationsString.slice(0, -1)

            let startDateString = new Date(startDate)
            startDateString.setDate(startDateString.getDate() + 1)
            startDateString = startDateString.toISOString().split('T')[0]

            if (checkDestination && roundtrip && endDate) {
                let endDateString = new Date(endDate)
                endDateString.setDate(endDateString.getDate() + 1)
                endDateString = endDateString.toISOString().split('T')[0]
                history({
                    pathname: "/search",
                    search: `?origin=${origin.air}&destinations=${destinationsString}&startDate=${startDateString}&endDate=${endDateString}&currency=${currency}`
                })
            } else if (checkDestination && !roundtrip) {
                history({
                    pathname: "/search",
                    search: `?origin=${origin.air}&destinations=${destinationsString}&startDate=${startDateString}&currency=${currency}`
                })
            }
        }
    }

    const currencySettings = () => {
        const currencyJsx = []
        currencies.forEach((item, i) => {
            currencyJsx.push(<div className='currency' key={i} onClick={() => {
                setCurrency(item.code)
                setCurrencyFocus(false)
            }}>{item.code} - {item.title}</div>)
        })
        return <div className='input-background'>
            <div className='input'>
                <div className='exit' onClick={() => setCurrencyFocus(false)}>+</div>
                <div className='input-name'>Currency</div>
                <div className='list'>{currencyJsx}</div>
            </div>
        </div>
    }

    return (
        <div className='search-tool'>
            {currencyFocus ? currencySettings() : ''}
            <h1>SmartJourney</h1>
            <div className='flight-option'>
                <span className={!roundtrip ? 'active-option' : 'option'} onClick={() => setRoundtrip(false)}>One way</span>
                <span className={roundtrip ? 'active-option' : 'option'} onClick={() => setRoundtrip(true)}>Roundtrip</span>
                <span className='option' onClick={() => setCurrencyFocus(true)}>Currency ({currency})</span>
            </div>

            <OriginInput origin={origin} setOrigin={setOrigin}
                            focus={originFocus} setFocus={setOriginFocus} setDestinationFocus={setDestinationFocus}/>
            <DestinationInput destinations={destinations} setDestinations={setDestinations}
                                focus={destinationFocus} setFocus={setDestinationFocus} setDateFocus={setDateFocus}/>
            <DatesInput startDate={startDate} setStartDate={setStartDate} startSearch={startSearch}
                            endDate={endDate} setEndDate={setEndDate} roundtrip={roundtrip}
                            dateFocus={dateFocus} setDateFocus={setDateFocus}/>
            
            <div className='button' onClick={() => startSearch()}>search</div>
        </div>
    )
}

export default SearchTool
