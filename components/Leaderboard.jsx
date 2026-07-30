export default function Leaderboard({ entries }) {
    if (!entries || entries.length === 0) return null

    function formatTime(seconds) {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return m > 0
            ? `${m}m ${s.toString().padStart(2, '0')}s`
            : `${s}s`
    }

    return (
        <div className="leaderboard">
            <h2 className="leaderboard__title">Leaderboard</h2>
            <table className="leaderboard__table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Player</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    {entries.map((entry, i) => (
                        <tr key={i} className={i === 0 ? 'leaderboard__row--top' : ''}>
                            <td className="leaderboard__rank">{i + 1}</td>
                            <td className="leaderboard__name">{entry.name}</td>
                            <td className="leaderboard__time">{formatTime(entry.time)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
