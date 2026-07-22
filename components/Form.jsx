import { useRef, useEffect } from 'react'
import RegularButton from './RegularButton'
import Select from './Select'

export default function Form({ handleSubmit, handleChange, isFirstRender }) {
    const divRef = useRef(null)

    useEffect(() => {
        !isFirstRender && divRef.current.focus()
    }, [])

    return (
        <div className="form-container" ref={divRef} tabIndex={-1}>
            <p className="p--regular">
                Select an emoji category and the number of memory cards to play the game.
            </p>
            <form className="wrapper">
                <Select handleChange={handleChange} />
                <RegularButton handleClick={handleSubmit}>
                    Start Game
                </RegularButton>
            </form>
        </div>
    )
}