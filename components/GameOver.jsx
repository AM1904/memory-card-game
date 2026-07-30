import { useEffect, useRef } from 'react'
import RegularButton from './RegularButton'
import Leaderboard from './Leaderboard'

export default function GameOver({ handleClick, playerName, timeTaken, leaderboard }) {
    const divRef = useRef(null)

    useEffect(() => {
        divRef.current.focus()
    }, [])

    function formatTime(seconds) {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return m > 0
            ? `${m}m ${s.toString().padStart(2, '0')}s`
            : `${s}s`
    }

    return (
        <div
            className="wrapper wrapper--accent game-over"
            tabIndex={0}
            ref={divRef}
        >
            <p className="p--large game-over__congrats">
                Well done, <span className="game-over__name">{playerName}</span>!
            </p>
            <p className="p--regular game-over__time">
                You matched all cards in <strong>{formatTime(timeTaken)}</strong>
            </p>
            <Leaderboard entries={leaderboard} />
            <RegularButton handleClick={handleClick}>
                Play Again
            </RegularButton>
        </div>
    )
}