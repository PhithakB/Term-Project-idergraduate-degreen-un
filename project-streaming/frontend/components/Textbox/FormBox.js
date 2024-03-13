import React from 'react'
import styles from './styles.module.scss'

function FormBox(props){
    return(
        <>
            <div className={styles.formBox}>
                <h2>{props.title}</h2>
                <div className={styles.content}>
                    {props.children}
                </div>
            </div>
        </>
    )
}

export default FormBox