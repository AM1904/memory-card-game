import { useEffect, useRef } from 'react'
import RegularButton from './RegularButton'
import Leaderboard from './Leaderboard'

export default function GameOver({ handleReset, handlePlayAgain, playerName, timeTaken, leaderboard }) {
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
                🎉 You Matched All Cards in <strong>{formatTime(timeTaken)}</strong>!
            </p>
            <Leaderboard entries={leaderboard} />
            <div className="game-over__actions">
                <RegularButton handleClick={handlePlayAgain}>
                    Play Again
                </RegularButton>
                <button
                    className="btn btn--outline"
                    onClick={handleReset}
                >
                    Reset Game
                </button>
            </div>
        </div>
    )
}