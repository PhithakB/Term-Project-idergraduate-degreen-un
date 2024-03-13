import React from 'react'
import styles from './styles.module.scss'

const STYLES = [styles.buttonA, styles.buttonB, styles.buttonC]

function Button(props){

    const checkStyle = (props.styles === "buttonB") ? STYLES[1] :
                        (props.styles === "buttonC") ? STYLES[2] : STYLES[0]

    return(
        <>
            <button className={checkStyle} onClick={props.onHandle}>
                {props.children}
            </button>
        </>
    )
}

export default Button