import React from 'react'
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import ReactCreditCards from 'react-credit-cards-2';


const Cardsdesign = ({ expiry, name, number }) => {
    return (
        <>
                <ReactCreditCards
                    expiry={expiry}
                    name={name}
                    number={number}
                />
        </>
    )
}

export default Cardsdesign