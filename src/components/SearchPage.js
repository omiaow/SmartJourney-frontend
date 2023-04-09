import React from 'react'
import '../styles/search-page.css'
import Flights from './features/Flights'
import { useLocation } from 'react-router-dom'
import { collectFlights, getCurrencyByCode } from '../data/state'

function SearchPage() {

    const location = useLocation()
    const [query, setQuery] = React.useState("")
    const [flights, setFlights] = React.useState([])
    const [error, setError] = React.useState()
    const [origin, setOrigin] = React.useState()
    const [currency, setCurrency] = React.useState()
    const [progress, setProgress] = React.useState({ percentage: 0, location: ''})
    const [oneWay, setOneWay] = React.useState(false)

    React.useEffect(() => {
        if (query !== location.search) {
            setQuery(location.search)
            const params = Object.fromEntries(new URLSearchParams(location.search))
            setOrigin(params.origin)
            setCurrency(params.currency)
            setFlights([])
            setProgress({ percentage: 0, location: ''})
            if (!params.endDate) setOneWay(true)
            collectFlights(params, setFlights, setError, setProgress, window.location.href)
        }
    }, [location, query, setQuery])
    
    return <main>
        <div className='wrapper'>
            <div className='search-page'>
                { !error ?
                (progress.percentage >= 100 ? <Flights flights={flights} origin={origin} currencySymbol={getCurrencyByCode(currency).title} oneWay={oneWay}/> : <div className="loading">
                    <div className="loader"/>
                    <div className="progress">{progress.percentage}%</div>
                    <p className="directions">{progress.location}</p>
                </div>) : <div className="error">Sorry, something went wrong. Please, try to search other destinations.</div> }
            </div>
        </div>
    </main>
}

export default SearchPage