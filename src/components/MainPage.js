import React from 'react'
import '../styles/main-page.css'
import Footer from './Footer'

function MainPage() {
    return <div className='wrapper'>
        <div className='main-page'>
            <div className='intro'>
                <div className='textplace'>
                    <div className='section'>
                        <div className='icon-1'/>
                        <h2>Cheapest flights</h2>
                        <p>Search flights for any date interval and track the cheapest prices for whole dates.</p>
                    </div>
                    <div className='section'>
                        <div className='icon-2'/>
                        <h2>Multi-city searching</h2>
                        <p>Search flights for multiple cities specifying only destinations and vacation dates.</p>
                    </div>
                    <div className='section'>
                        <div className='icon-3'/>
                        <h2>Find cheapest trip</h2>
                        <p>Generate a flight trip selecting manualy or see the combination of cheapest trips.</p>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
    </div>
}

export default MainPage