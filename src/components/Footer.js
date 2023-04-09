import React from 'react'

function Footer() {
    return <div className='footer'>
        <a href="mailto:omurzak.keldibek@gmail.com" target="_newtab">Our contact Email</a>
        <p>© {new Date().getFullYear()} SmartJourney - Flight Search web application</p>
    </div>
}

export default Footer