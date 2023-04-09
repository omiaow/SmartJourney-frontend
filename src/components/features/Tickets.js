import React from 'react'
import '../../styles/tickets.css'
import { getLocationByCode } from '../../data/state'
import unknown from '../../styles/images/unknown.png'

function Tickets(props) {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const shortWeekNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    const [overflow, setOverflow] = React.useState(false)

    const moveLeft = () => {
        document.querySelector('#tickets').scrollLeft -= 450;
    }
    
    const moveRight = () => {
        document.querySelector('#tickets').scrollLeft += 450;
    }

    const remove = (id) => {
        const newTickets = []
        for (let i=0; i<id; i++) newTickets.push(props.tickets[i])
        props.setTickets(newTickets)
        if (document.querySelector('#period')) document.querySelector('#period').scrollTo(0, 0)
    }

    const getTotal = (tickets) => {
        let total = 0
        tickets.forEach(ticket => {
            total += ticket.price
        })
        return total
    }

    const jsxTickets = []
    props.tickets.forEach((ticket, i) => {
        let date = new Date(ticket.date.split('T')[0])
        jsxTickets.push(
            <div className="ticket" key={i}>
                {props.setTickets ? <div className="close" onClick={() => remove(i)}>+</div> : ''}
                <div className="border">
                    <div className="description">from:</div>
                    <div className="data-words">{getLocationByCode(ticket.origin).loc} ({ticket.originAirport})</div>
                    <div className="description">to:</div>
                    <div className="data-words">{getLocationByCode(ticket.destination).loc} ({ticket.destinationAirport})</div>
                    <div className="description">date:</div>
                    <div className="data-words">{date.getDate()} {monthNames[date.getMonth()]}, {date.getFullYear()} ({shortWeekNames[date.getDay()]})</div>
                    <div className="description">time:</div>
                    <div className="data-words">{ticket.date.slice(11, -9)}</div>
                    <div className="description">transfers:</div>
                    <div className="data-words">{ticket.transit} stop{(ticket.transit !== 1) && 's'}</div>
                    <div className="description">duration:</div>
                    <div className="data-words">{parseInt(ticket.duration/60).toString().padStart(2, '0')}:{(ticket.duration%60).toString().padStart(2, '0')} hours</div>
                    <div className="description">flight number:</div>
                    <div className="data-words">{ticket.flight}</div>
                    <div className="description">price:</div>
                    <div className="price">{ticket.price} {props.currency}</div>
                    <hr/>
                    <img alt="Airline" src={(ticket.airline.length > 0) ? `https://pics.avs.io/150/50/${ticket.airline}.png` : unknown}/>
                </div>
            </div>
        )
    })
    
    return <div className="tickets">
        <div className="count">Total: {getTotal(props.tickets)}{props.currency}</div>
        <div className={overflow ? "left" : "empty"} onClick={() => moveLeft()}/>
        <div className={overflow ? "right" : ""} onClick={() => moveRight()}/>
        <div className="list" id="tickets"
            ref={ref => {
                if (ref && ref.scrollWidth > ref.clientWidth && window.innerWidth >= 1000) {
                    setOverflow(true)
                } else {
                    setOverflow(false)
                }
            }}
        >{ jsxTickets }</div>
    </div>
}

export default Tickets