import React from 'react'
import styles from './styles.module.scss'

const STYLES = [styles.layoutA, styles.layoutB]

function Layout(props){

    const checkStyle = (props.styles === "layoutB") ? STYLES[1] : STYLES[0]

    return(
        <>
            <section className={checkStyle}>
                {props.children}
            </section>
        </>
    )
}

export default Layout