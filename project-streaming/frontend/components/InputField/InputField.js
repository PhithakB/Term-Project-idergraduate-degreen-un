import React from 'react'
import styles from './styles.module.scss'

function InputField(props){
    return(
        <>
            <div className={styles.field}>
                <p>{props.title}</p>
                <input
                    type={props.type}
                    id={props.id}
                    defaultValue={props.value}
                    placeholder={props.placeholder}
                    onChange={props.onHandle}
                />
            </div>
        </>
    )
}

export default InputField