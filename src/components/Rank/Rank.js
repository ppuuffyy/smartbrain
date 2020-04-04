import React from 'react';



const Rank = ({name,entries}) => {
    //console.log('the entries is = ', entries);
    return (
        <div className='ma3 mt0'>
            <div className='white f3'>
                {`${name}, your current entry count is ...`}
            </div>
            <div className='white f1'>
                {entries}
            </div>
        </div>
    )
}

export default Rank;