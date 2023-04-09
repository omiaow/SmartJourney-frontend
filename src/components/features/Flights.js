import React from 'react'
import '../../styles/flights.css'
import Tickets from './Tickets'
import { getLocationByCode, sortPrices } from '../../data/state'

function Flights(props) {
    
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const weekNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const [tickets, setTickets] = React.useState([])
    const [overflow, setOverflow] = React.useState(false)

    React.useEffect(() => {
        if (props.oneWay) document.querySelector('#period').scrollLeft = 230*15
    }, [props.oneWay])

    const moveLeft = () => {
        document.querySelector('#period').scrollLeft -= 460
    }
    
    const moveRight = () => {
        document.querySelector('#period').scrollLeft += 460
    }

    const chooseTicket = (ticket) => {
        setTickets([...tickets,ticket])
        document.querySelector('#period').scrollTo(0, 0)
    }

    const closeTicket = (id) => {
        const newTickets = []
        for (let i=0; i<id; i++) newTickets.push(tickets[i])
        setTickets(newTickets)
        setTimeout(() => {
            if (document.querySelector('#period') && props.oneWay && newTickets.length === 0) document.querySelector('#period').scrollLeft = 230*15
        }, 100);
    }

    const isChosen = (ticket) => {
        for (let i=0; i<tickets.length; i++) {
            if (tickets[i].destination === ticket.destination) return true
        }
        return false
    }

    const days = []
    const origin = tickets.length > 0 ? tickets[tickets.length-1].destination : props.origin
    const startDate = tickets.length > 0 ? tickets[tickets.length-1].date.split('T')[0] : new Date(props.flights[0].day).setDate(new Date(props.flights[0].day).getDate() - 1)
    if (!(tickets.length > 0 && origin === props.origin)) {
        props.flights.forEach((day, i) => {
            const jsxTickets = []
            if (new Date(startDate) < new Date(day.day)) {
                day.locations.forEach(loc => {
                    const ticketList = sortPrices(loc.tickets)
                    if (loc.origin === origin) ticketList.forEach((ticket, j) => {
                        if (!isChosen(ticket)) {
                            jsxTickets.push(
                                <div className={ticket.transit === 0 ? 'directs' : 'transits'} key={j} onClick={() => chooseTicket(ticket)}>
                                    <div className="description">{ticket.price} {props.currencySymbol} {getLocationByCode(ticket.destination).loc.split(',')[0]}</div>
                                </div>
                            )
                        }
                    })
                })

                const date = new Date(day.day)
                days.push(
                    <div className="days" key={i}>
                        <div className="top">
                            <div className="day">{date.getDate()}</div>
                            <div className="month-weeks">
                                <div className="month">{monthNames[date.getMonth()]}</div>
                                <div className="weekday">{weekNames[date.getDay()]}</div>
                            </div>
                        </div>
                        {jsxTickets}
                    </div>
                )
            }
        })
        
        return <>
            {tickets.length > 0 ? <Tickets currency={props.currencySymbol} tickets={tickets} closeTicket={closeTicket}/> : ''}
            <div className="flights">
                <div className="location">{getLocationByCode(tickets.length > 0 ? tickets[tickets.length-1].destination : props.origin).loc.split(',')[0]} to</div>
                <div className={overflow ? "left" : "empty"} onClick={() => moveLeft()}/>
                <div className={overflow ? "right" : ""} onClick={() => moveRight()}/>
                <div className="period" id="period"
                    ref={ref => {
                        if (ref && ref.scrollWidth > ref.clientWidth && window.innerWidth >= 900) {
                            setOverflow(true)
                        } else {
                            setOverflow(false)
                        }
                    }}
                >{days}</div>
                <div className="color-description">
                    <div className="direct"/>
                    <span>direct</span>
                    <div className="transit"/>
                    <span>transit</span>
                </div>
            </div>
        </>
    }

    return <Tickets currency={props.currencySymbol} tickets={tickets} closeTicket={closeTicket}/>
}

export default Flights