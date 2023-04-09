import airportsImport from './airports.json'
import currenciesImport from './currencies.json'

export const airports = airportsImport
export const currencies = currenciesImport

export const getLocationByCode = (code) => {
    let i=0
    while (i<airports.length && airports[i].air !== code) i++
    if (i<airports.length && airports[i].air === code) return airports[i]
    return undefined
}

export const getCurrencyByCode = (code) => {
    let i=0
    while (i<currencies.length && currencies[i].code !== code) i++
    if (i<currencies.length && currencies[i].code === code) return currencies[i]
    return undefined
}

export const collectFlights = async (params, setFlights, setError, setProgress, locationLink) => {
    
    const createFlights = (data) => {
        const startDate = new Date(data.startDate)
        const endDate = new Date(data.endDate)
    
        const locationsForTickets = []
        data.locations.forEach((item) => {
            locationsForTickets.push({
                origin: item,
                tickets: []
            })
        })
    
        const flights = []
        while (startDate <= endDate) {
            flights.push({
                day: startDate.toISOString().split('T')[0],
                locations: JSON.parse(JSON.stringify(locationsForTickets))
            })
            startDate.setDate(startDate.getDate() + 1)
        }
    
        return flights
    }

    const addTickets = (tickets, flights) => {
        tickets.forEach((item) => {
            let i=0
            while (i < flights.length && flights[i].day !== item.date.split('T')[0]) i++
            if (i < flights.length && flights[i].day === item.date.split('T')[0]) {
                let j=0
                while (j < flights[i].locations.length && flights[i].locations[j].origin !== item.origin) j++
                if (j < flights[i].locations.length) flights[i].locations[j].tickets.push(item)
            }
        })
    }

    let startDate = params.startDate
    let endDate = params.endDate

    if (!endDate) {
        startDate = new Date(params.startDate)
        startDate.setDate(startDate.getDate() - 15)
        startDate = startDate.toISOString().split('T')[0]
        endDate = new Date(params.startDate)
        endDate.setDate(endDate.getDate() + 15)
        endDate = endDate.toISOString().split('T')[0]
    }

    const locations = [params.origin, ...params.destinations.split(' ')]
    const flights = createFlights({
        locations: locations,
        startDate: startDate,
        endDate: endDate
    })
    let countResponse = 0
    const totalRequest = locations.length * (locations.length - 1)

    for (let i=0; i<locations.length; i++) {
        for (let j=0; j<locations.length; j++) {
            if (i !== j) {
                const url = `https://weak-cyan-tuna-boot.cyclic.app/one-way/${locations[i]}/${locations[j]}/${startDate}/${endDate}/${params.currency}`
                const result = await fetch(url)
                const response = await result.json()
          
                if (!result.ok) {
                    setError('Error occured!')
                    return
                }
                
                if (locationLink !== window.location.href) return

                addTickets(response, flights)
                setFlights(flights)
                countResponse++
                setProgress({ percentage: Math.round(100/totalRequest*countResponse), location: getLocationByCode(locations[i]).loc })
            }
        }
    }
}

export const sortPrices = (list) => {
    if (list !== undefined && list.length < 2) return list
    else if(list === undefined || (list !== undefined && list.length === 0)) return list
  
    const pivotID = Math.floor(Math.random() * list.length)
    const pivot = list[pivotID]
  
    if(pivot === undefined){
        list.splice(pivotID, 1)
        return sortPrices(list)
    }
  
    let left = []
    let equal = []
    let right = []
  
    for (let element of list) {
        const exists = (element !== undefined)
        if (exists && element.price > pivot.price) right.push(element)
        else if (exists && element.price < pivot.price) left.push(element)
        else if (exists) equal.push(element)
    }
  
    return sortPrices(left)
        .concat(equal)
        .concat(sortPrices(right))
}

