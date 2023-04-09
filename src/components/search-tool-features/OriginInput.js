import React from 'react'
import { airports } from '../../data/state'

function OriginInput(props) {

    const [active, setActive] = React.useState(-1)
    const [options, setOptions] = React.useState([])
    const autocompleteLength = 7
    
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
            props.setOrigin(options[id])
            props.setFocus(false)
            props.setDestinationFocus(true)
        }
    }

    const inputScreen = () => {
        return <div className='input-background'>
            <div className='input'>
            <div className='exit' onClick={() => {
                    props.setFocus(false)
                }}>+</div>
            <div className='input-name'>Origin</div>
            <input className='origin-input'
                   type='text'
                   autoComplete='off'
                   placeholder={props.origin ? props.origin.loc : 'cities or countries'}
                   onChange={(e) => findOptions(e.target.value)}
                   onKeyDown={(e) => {
                        if (e.keyCode === 38) {
                            setActive(active > -1 ? active-1 : active)
                        } else if (e.keyCode === 40) {
                            setActive(active < options.length-1 ? active+1 : active)
                        } else if (e.keyCode === 13) {
                            choose(active)
                        }
                   }}
                   autoFocus/>
            <div className='autocomplete'>
                { renderOptions() }
            </div>
            </div>
        </div>
    }

    return <>
        {props.focus ? inputScreen() : ''}
        <div className='origin' onClick={() => props.setFocus(true)}>
            <div className='name'>from</div>
            <p>{props.origin ? props.origin.loc : 'From where? (city, country)'}</p>
        </div>
    </>
}

export default OriginInput
