import { useEffect, useRef } from 'react'

export default function NameModal({ playerName, onChange, onConfirm, onCancel }) {
    const inputRef = useRef(null)

    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    function handleSubmit(e) {
        e.preventDefault()
        if (playerName.trim()) {
            onConfirm()
        }
    }

    function handleKeyDown(e) {
        if (e.key === 'Escape') onCancel()
    }

    return (
        <div className="modal-overlay" onKeyDown={handleKeyDown} role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="modal">
                <h2 id="modal-title" className="modal__title">Enter Your Name</h2>
                <p className="modal__subtitle">Your name will appear on the leaderboard.</p>
                <form onSubmit={handleSubmit} className="modal__form">
                    <input
                        ref={inputRef}
                        id="playerNameModal"
                        name="playerName"
                        type="text"
                        placeholder="e.g. Alex"
                        value={playerName}
                        onChange={onChange}
                        required
                        maxLength={24}
                        className="player-name-input modal__input"
                        autoComplete="off"
                    />
                    <div className="modal__actions">
                        <button type="button" className="btn btn--text modal__cancel" onClick={onCancel}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn--text modal__confirm"
                            disabled={!playerName.trim()}
                        >
                            Play
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
