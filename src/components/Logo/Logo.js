import React from 'react';
import Tilt from 'react-tilt'
import './Logo.css';
import myLogo from './Logo.png';

const Logo = () => {
    return (
        <div className='ma3 mt0'>
            <Tilt className="Tilt br2 shadow-2" options={{ max : 55 }} style={{ height: 130, width: 130 }} >
            <div className="Tilt-inner pa3"> 
                <img style={{paddingTop: '1px', paddingLeft: '2px'}} alt='logo' src={myLogo} /> 
            </div>
            </Tilt>
        </div>
    )
}

export default Logo;