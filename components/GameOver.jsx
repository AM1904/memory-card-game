import { useEffect, useRef } from 'react'
import RegularButton from './RegularButton'

export default function GameOver({ handleClick }) {
    const divRef = useRef(null)

    useEffect(() => {
        divRef.current.focus()
    }, [])

    return (
        <div
            className="wrapper wrapper--accent"
            tabIndex={0}
            ref={divRef}
        >
            <p className="p--large">Great, You've matched all the Memory Cards.</p>
            <RegularButton handleClick={handleClick}>
                Play <A:link></A:link>gain
            </RegularButton>
        </div>
    )
}