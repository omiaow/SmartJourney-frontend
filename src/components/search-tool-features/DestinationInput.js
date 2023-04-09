import React from 'react'
import { airports } from '../../data/state'

function DestinationInput(props) {

    const [value, setValue] = React.useState("")
    const [active, setActive] = React.useState(-1)
    const [options, setOptions] = React.useState([])
    const ref = React.useRef(null)
    const autocompleteLength = 7
    const destinationLimit = 5
    
    const findOptions = (givenValue) => {
        const results = []

        const checkSubstring = (givenStr, checkingStr) => {
            var splitted = givenStr.split(' ')
            var isSubstring = true
            for (var i=0; i<splitted.length; i++) {
                if (!(checkingStr.toUpperCase().includes(splitted[i].toUpperCase()))) isSubstring = false
            }
            return isSubstring
        }

        let j=0
        for (let i=0; i<airports.length; i++) {
            if (checkSubstring(givenValue, airports[i].loc) && j < autocompleteLength && givenValue.length > 0) {
                results.push(airports[i])
                j++
            } else if (j >= autocompleteLength) break
        }

        setValue(givenValue)
        setActive(-1)
        setOptions(results)
    }

    const renderOptions = () => {
        const jsxOptions = []
        options.forEach((item, i) => {
            jsxOptions.push(<div key={i} className={(i === active) ? 'active-autocomplete-tag' : 'autocomplete-tag'}
                onClick={() => choose(i)}>{item.loc}</div>)
        })
        return jsxOptions
    }

    const choose = (id) => {
        if (id > -1) {
            setActive(-1)
            setOptions([])
            setValue("")
            if (props.destinations.length < destinationLimit) {
                const destinations = [...props.destinations]
                destinations.push(options[id])
                props.setDestinations(destinations)
            }
        }
        ref.current.focus()
    }

    const remove = (id) => {
        setActive(-1)
        setOptions([])
        setValue("")
        const destinations = [...props.destinations]
        destinations.splice(id, 1)
        props.setDestinations(destinations)
        ref.current.focus()
    }

    const next = () => {
        props.setFocus(false)
        props.setDateFocus(true)
    }

    const renderTags = () => {
        const jsxDestinations = []
        props.destinations.forEach((item, i) => {
            jsxDestinations.push(<div className='tag' key={i}>
                                    <span>{item.loc.split(',')[0]}</span>
                                    <div className='close' onClick={() => remove(i)}>+</div>
                                </div>)
        })
        return <div className='collect-tag'>{ jsxDestinations }</div>
    }

    const inputScreen = () => {
        return <div className='input-background'>
            <div className='input'>
            <div className='exit' onClick={() => {
                    props.setFocus(false)
                }}>+</div>
            <div className='input-name'>Destination(s)</div>
            { renderTags() }
            <input className='destination-input'
                   type='text'
                   autoComplete='off'
                   ref={ref}
                   placeholder='up to five cities'
                   onChange={(e) => findOptions(e.target.value)}
                   value={value}
                   onKeyDown={(e) => {
                        if (e.keyCode === 38) setActive(active > -1 ? active-1 : active)
                        else if (e.keyCode === 40) setActive(active < options.length-1 ? active+1 : active)
                        else if (e.keyCode === 13) choose(active)
                        else if (e.keyCode === 9) next()
                   }}
                   autoFocus/>
            <div className='next-button' onClick={() => next()}/>
            <div className='autocomplete'>
                { renderOptions() }
            </div>
            </div>
        </div>
    }

    const placeholder = (destinations) => {
        let newPlaceholder = ""
        destinations.forEach(tag => newPlaceholder += `${tag.loc.split(',')[0]}, `)
        return newPlaceholder.slice(0, newPlaceholder.length-2)
    }

    return <>
        {props.focus ? inputScreen() : ''}
        <div className='destinations' onClick={() => props.setFocus(true)}>
            <div className='icon'/>
            <p>To {props.destinations.length > 0 ? placeholder(props.destinations) : 'From where? (city, country)'}</p>
        </div>
    </>
}

export default DestinationInput
