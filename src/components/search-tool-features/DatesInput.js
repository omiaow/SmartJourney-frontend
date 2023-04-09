import React from 'react'

function DatesInput(props) {
    
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const shortWeekNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const shortMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]
    const [startDateString, setStartDateString] = React.useState("Departure")
    const [endDateString, setEndDateString] = React.useState("Return")
    const monthLimit = 12

    const pressDate = (date) => {
        if (props.startDate === undefined) {
            props.setStartDate(date)
            setStartDateString(`${shortWeekNames[date.getDay()]}, ${date.getDate()}-${shortMonthNames[date.getMonth()]}`)
        } else if (date.getDate() === props.startDate.getDate() && date.getMonth() === props.startDate.getMonth() && date.getFullYear() === props.startDate.getFullYear()) {
            props.setStartDate(undefined)
            props.setEndDate(undefined)
            setStartDateString("Departure")
            setEndDateString("Return")
        } else if (props.roundtrip && date.getTime() > props.startDate.getTime()) {
            props.setEndDate(date)
            setEndDateString(`${shortWeekNames[date.getDay()]}, ${date.getDate()}-${shortMonthNames[date.getMonth()]}`)
        } else {
            props.setStartDate(date)
            props.setEndDate(undefined)
            setStartDateString(`${shortWeekNames[date.getDay()]}, ${date.getDate()}-${shortMonthNames[date.getMonth()]}`)
            setEndDateString("Return")
        }
    }
    
    const createDay = (name, key, date) => {
        const newDate = new Date(date)
        if (name === "empty") {
            return (<div className="empty" key={key} />)
        } else if (name === "day") {
            return (<div className="day" key={key} onClick={() => pressDate(newDate)}> {newDate.getDate()} </div>)
        } else if (name === "selected") {
            return (<div className="selected" key={key} onClick={() => pressDate(newDate)}> {newDate.getDate()} </div>)
        } else {
            return (<div className={name} key={key} > {newDate.getDate()} </div>)
        }
    }

    const createMonth = (givenDate, key) => {
        const days = []
        const firstDay = new Date(givenDate.getFullYear(), givenDate.getMonth(), 1)
    
        const getWeekDay = (date) => {
            let day = date.getDay()
            if (day === 0) day = 7
            return day - 1
        }
    
        for (let i=0; i<getWeekDay(firstDay); i++) {
            days.push(createDay("empty", i))
        }
    
        const currentDate = new Date()
        const lastDay = new Date(firstDay)
        lastDay.setMonth(lastDay.getMonth() + 1)
    
        while (firstDay < lastDay) {
            if (firstDay.getDate() === currentDate.getDate() && firstDay.getMonth() === currentDate.getMonth() && firstDay.getFullYear() === currentDate.getFullYear()) {
                days.push(createDay("today", firstDay, firstDay))
            } else if (firstDay.getTime() < currentDate.getTime()) {
                days.push(createDay("passed", firstDay, firstDay))
            } else if (props.startDate !== undefined && props.startDate.getDate() === firstDay.getDate() && props.startDate.getMonth() === firstDay.getMonth() && props.startDate.getFullYear() === firstDay.getFullYear()) {
                days.push(createDay("selected", firstDay, firstDay))
            } else if (props.roundtrip && props.endDate !== undefined && props.endDate.getDate() === firstDay.getDate() && props.endDate.getMonth() === firstDay.getMonth() && props.endDate.getFullYear() === firstDay.getFullYear()) {
                days.push(createDay("selected", firstDay, firstDay))
            } else if (props.roundtrip && props.startDate !== undefined && props.endDate !== undefined && firstDay > props.startDate && firstDay < props.endDate) {
                days.push(createDay("selected", firstDay, firstDay))
            } else {
                days.push(createDay("day", firstDay, firstDay))
            }
            firstDay.setDate(firstDay.getDate() + 1)
        }
    
        return (
            <div key={key}>
                <div className="month-name">{monthNames[givenDate.getMonth()]}{givenDate.getFullYear() !== new Date().getFullYear() ? ` (${givenDate.getFullYear()})` : ''}</div>
                <div className="days">{days}</div>
            </div>
        )
    }

    const window = () => {
        const weekNames = <div className="week-names">
            <div className="weekdays">Mo</div>
            <div className="weekdays">Tu</div>
            <div className="weekdays">We</div>
            <div className="weekdays">Th</div>
            <div className="weekdays">Fr</div>
            <div className="weekends">Sa</div>
            <div className="weekends">Su</div>
        </div>
    
        const date = new Date()
        const calendar = []
        for (let i=0; i<monthLimit; i++) {
            calendar.push(createMonth(date, i))
            date.setMonth(date.getMonth() + 1)
        }
    
        return <div className='input-background'>
            <div className='input'>
                <div className='exit' onClick={() => props.setDateFocus(false)}>+</div>
                <div className='input-name'>Vacation dates</div>
                {weekNames}
                <div className="month-box">{calendar}</div>
                <div className='button' onClick={() => {
                    if ((props.startDate && props.endDate) || (!props.roundtrip && props.startDate)) {
                        props.setDateFocus(false)
                        props.startSearch()
                    }
                }}>search</div>
            </div>
        </div>
    }

    return <>
        <div className='dates' onClick={() => props.setDateFocus(true)}>
            <div className='name'>dates</div>
            <p>{props.roundtrip ? `${startDateString} - ${endDateString}` : startDateString}</p>
        </div> 
        {props.dateFocus ? window() : ''}
    </>
}

export default DatesInput