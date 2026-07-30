import { useState, useEffect, useRef } from 'react'
import Form from '/components/Form'
import MemoryCard from '/components/MemoryCard'
import AssistiveTechInfo from '/components/AssistiveTechInfo'
import GameOver from '/components/GameOver'
import ErrorCard from '/components/ErrorCard'
import NameModal from '/components/NameModal'

const LEADERBOARD_KEY = 'memoryGameLeaderboard'

function getLeaderboard() {
    try {
        return JSON.parse(localStorage.getItem(LEADERBOARD_KEY)) || []
    } catch {
        return []
    }
}

function saveLeaderboard(entries) {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries))
}

export default function App() {
    const initialFormData = { category: "animals-and-nature", number: 10 }

    const [isFirstRender, setIsFirstRender] = useState(true)
    const [formData, setFormData] = useState(initialFormData)
    const [isGameOn, setIsGameOn] = useState(false)
    const [emojisData, setEmojisData] = useState([])
    const [selectedCards, setSelectedCards] = useState([])
    const [matchedCards, setMatchedCards] = useState([])
    const [areAllCardsMatched, setAreAllCardsMatched] = useState(false)
    const [isError, setIsError] = useState(false)

    // Modal state
    const [showNameModal, setShowNameModal] = useState(false)
    const [playerName, setPlayerName] = useState("")

    // Silent timer (never shown during gameplay)
    const [elapsedTime, setElapsedTime] = useState(0)
    const timerRef = useRef(null)

    // Leaderboard
    const [leaderboard, setLeaderboard] = useState(getLeaderboard())

    // Match check
    useEffect(() => {
        if (selectedCards.length === 2 && selectedCards[0].name === selectedCards[1].name) {
            setMatchedCards(prevMatchedCards => [...prevMatchedCards, ...selectedCards])
        }
    }, [selectedCards])

    // Win check
    useEffect(() => {
        if (emojisData.length && matchedCards.length === emojisData.length) {
            clearInterval(timerRef.current)
            setAreAllCardsMatched(true)

            const newEntry = { name: playerName || "Player", time: elapsedTime }
            const updated = [...getLeaderboard(), newEntry]
                .sort((a, b) => a.time - b.time)
                .slice(0, 10)
            saveLeaderboard(updated)
            setLeaderboard(updated)
        }
    }, [matchedCards])

    function handleFormChange(e) {
        setFormData(prevFormData => ({ ...prevFormData, [e.target.name]: e.target.value }))
    }

    function handleNameChange(e) {
        setPlayerName(e.target.value)
    }

    // Step 1: "Start Game" clicked → show name modal
    function handleStartClick(e) {
        e.preventDefault()
        setShowNameModal(true)
    }

    // Step 2: Modal confirmed → fetch data and launch game
    async function handleModalConfirm() {
        setShowNameModal(false)

        try {
            const response = await fetch(`https://emojihub.yurace.pro/api/all/category/${formData.category}`)

            if (!response.ok) {
                throw new Error("Could not fetch data from API")
            }

            const data = await response.json()
            const dataSlice = await getDataSlice(data)
            const emojisArray = await getEmojisArray(dataSlice)

            setEmojisData(emojisArray)
            setIsGameOn(true)

            // Start silent background timer
            setElapsedTime(0)
            clearInterval(timerRef.current)
            timerRef.current = setInterval(() => {
                setElapsedTime(prev => prev + 1)
            }, 1000)

        } catch (err) {
            console.error(err)
            setIsError(true)
        } finally {
            setIsFirstRender(false)
        }
    }

    function handleModalCancel() {
        setShowNameModal(false)
    }

    async function getDataSlice(data) {
        const randomIndices = getRandomIndices(data)
        const dataSlice = randomIndices.reduce((array, index) => {
            array.push(data[index])
            return array
        }, [])
        return dataSlice
    }

    function getRandomIndices(data) {
        const randomIndicesArray = []
        for (let i = 0; i < (formData.number / 2); i++) {
            const randomNum = Math.floor(Math.random() * data.length)
            if (!randomIndicesArray.includes(randomNum)) {
                randomIndicesArray.push(randomNum)
            } else {
                i--
            }
        }
        return randomIndicesArray
    }

    async function getEmojisArray(data) {
        const pairedEmojisArray = [...data, ...data]
        for (let i = pairedEmojisArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            const temp = pairedEmojisArray[i]
            pairedEmojisArray[i] = pairedEmojisArray[j]
            pairedEmojisArray[j] = temp
        }
        return pairedEmojisArray
    }

    function turnCard(name, index) {
        if (selectedCards.length < 2) {
            setSelectedCards(prevSelectedCards => [...prevSelectedCards, { name, index }])
        } else if (selectedCards.length === 2) {
            setSelectedCards([{ name, index }])
        }
    }

    function resetGame() {
        clearInterval(timerRef.current)
        setIsGameOn(false)
        setSelectedCards([])
        setMatchedCards([])
        setAreAllCardsMatched(false)
        setElapsedTime(0)
        setPlayerName("")
    }

    function resetError() {
        setIsError(false)
    }

    return (
        <main>
            <h1>Memory Game</h1>

            {/* Name popup modal */}
            {showNameModal &&
                <NameModal
                    playerName={playerName}
                    onChange={handleNameChange}
                    onConfirm={handleModalConfirm}
                    onCancel={handleModalCancel}
                />
            }

            {/* Setup form */}
            {!isGameOn && !isError &&
                <Form
                    handleSubmit={handleStartClick}
                    handleChange={handleFormChange}
                    isFirstRender={isFirstRender}
                />
            }

            {/* Game in progress — NO timer shown */}
            {isGameOn && !areAllCardsMatched &&
                <AssistiveTechInfo emojisData={emojisData} matchedCards={matchedCards} />
            }

            {/* Game over + leaderboard */}
            {areAllCardsMatched &&
                <GameOver
                    handleClick={resetGame}
                    playerName={playerName}
                    timeTaken={elapsedTime}
                    leaderboard={leaderboard}
                />
            }

            {/* Cards */}
            {isGameOn &&
                <MemoryCard
                    handleClick={turnCard}
                    data={emojisData}
                    selectedCards={selectedCards}
                    matchedCards={matchedCards}
                />
            }

            {isError && <ErrorCard handleClick={resetError} />}
        </main>
    )
}