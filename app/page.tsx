"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { palavras } from "@/data/palavras"
import Teclado from "@/components/teclado"
import Grade from "@/components/grade"
import Header from "@/components/header"
import Modal from "@/components/modal"
import RankingModal from "@/components/ranking-modal"
import HelpModal from "@/components/help-modal"
import SettingsModal from "@/components/settings-modal"
import NameInputModal from "@/components/name-input-modal"

export default function Home() {
  const [palavraSecreta, setPalavraSecreta] = useState("")
  const [tentativas, setTentativas] = useState<string[]>(Array(6).fill(""))
  const [tentativaAtual, setTentativaAtual] = useState(0)
  const [letrasDigitadas, setLetrasDigitadas] = useState("")
  const [estadoLetras, setEstadoLetras] = useState<Record<string, string>>({})
  const [gameOver, setGameOver] = useState(false)
  const [ganhou, setGanhou] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showRankingModal, setShowRankingModal] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showNameInputModal, setShowNameInputModal] = useState(false)
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
  })
  const [shakeRow, setShakeRow] = useState<number | null>(null)

  // Cronômetro
  const [startTime, setStartTime] = useState<number | null>(null)
  const [endTime, setEndTime] = useState<number | null>(null)
  const [gameTime, setGameTime] = useState(0)
  const gameStarted = useRef(false)

  // Inicializa o jogo com uma palavra aleatória
  useEffect(() => {
    const palavraAleatoria = palavras[Math.floor(Math.random() * palavras.length)]
    setPalavraSecreta(palavraAleatoria.toUpperCase())
  }, [])

  // Inicia o cronômetro na primeira interação
  const startTimer = useCallback(() => {
    if (!gameStarted.current) {
      setStartTime(Date.now())
      gameStarted.current = true
    }
  }, [])

  // Atualiza o tempo de jogo quando termina
  useEffect(() => {
    if (startTime && endTime) {
      setGameTime(endTime - startTime)
    }
  }, [startTime, endTime])

  // Salva o ranking no localStorage
  const saveToRanking = useCallback(
    (playerName: string) => {
      try {
        const entry = {
          name: playerName,
          time: gameTime,
          date: new Date().toISOString(),
          tentativas: tentativaAtual + 1,
        }

        // Carregar rankings existentes ou criar novo array
        const existingRankings = localStorage.getItem("repingada_rankings")
        const rankings = existingRankings ? JSON.parse(existingRankings) : []

        // Adicionar nova entrada e salvar
        rankings.push(entry)
        localStorage.setItem("repingada_rankings", JSON.stringify(rankings))

        // Fechar modal de nome e mostrar ranking
        setShowNameInputModal(false)
        setShowRankingModal(true)
      } catch (error) {
        console.error("Erro ao salvar ranking:", error)
      }
    },
    [gameTime, tentativaAtual],
  )

  // Verifica a tentativa atual
  const verificarTentativa = useCallback(() => {
    // Inicia o cronômetro na primeira tentativa
    startTimer()

    const tentativaAtualStr = tentativas[tentativaAtual]

    if (tentativaAtualStr.length !== 5) {
      setModalContent({
        title: "Palavra incompleta",
        message: "A palavra deve ter 5 letras!",
      })
      setShowModal(true)
      return
    }

    if (!palavras.includes(tentativaAtualStr.toLowerCase())) {
      // Ativa a animação de tremida
      setShakeRow(tentativaAtual)

      setModalContent({
        title: "Palavra inválida",
        message: "Esta palavra não está na lista!",
      })
      setShowModal(true)
      return
    }

    // Atualiza o estado das letras no teclado
    const novoEstadoLetras = { ...estadoLetras }

    // Primeiro, marca todas as letras como ausentes
    for (let i = 0; i < 5; i++) {
      const letra = tentativaAtualStr[i]
      if (!novoEstadoLetras[letra]) {
        novoEstadoLetras[letra] = "ausente"
      }
    }

    // Depois, verifica as letras presentes na posição correta
    for (let i = 0; i < 5; i++) {
      const letra = tentativaAtualStr[i]
      if (letra === palavraSecreta[i]) {
        novoEstadoLetras[letra] = "correta"
      }
    }

    // Por fim, verifica as letras presentes mas na posição errada
    for (let i = 0; i < 5; i++) {
      const letra = tentativaAtualStr[i]
      if (letra !== palavraSecreta[i] && palavraSecreta.includes(letra) && novoEstadoLetras[letra] !== "correta") {
        novoEstadoLetras[letra] = "presente"
      }
    }

    setEstadoLetras(novoEstadoLetras)

    // Verifica se ganhou
    if (tentativaAtualStr === palavraSecreta) {
      setGanhou(true)
      setGameOver(true)
      setEndTime(Date.now())
      setShowNameInputModal(true)
      return
    }

    // Verifica se perdeu
    if (tentativaAtual === 5) {
      setGameOver(true)
      setEndTime(Date.now())
      setModalContent({
        title: "Fim de jogo",
        message: `A palavra era ${palavraSecreta}. Tente novamente!`,
      })
      setShowModal(true)
      return
    }

    // Avança para a próxima tentativa
    setTentativaAtual(tentativaAtual + 1)
    setLetrasDigitadas("")
  }, [tentativas, tentativaAtual, palavraSecreta, estadoLetras, startTimer])

  // Manipula a entrada de letras
  const handleKeyPress = useCallback(
    (key: string) => {
      if (gameOver) return

      // Se algum modal estiver aberto, não processa teclas
      if (showModal || showHelpModal || showRankingModal || showSettingsModal || showNameInputModal) {
        return
      }

      // Inicia o cronômetro na primeira interação com o teclado
      startTimer()

      if (key === "ENTER") {
        verificarTentativa()
        return
      }

      if (key === "BACKSPACE") {
        if (letrasDigitadas.length > 0) {
          const novasTentativas = [...tentativas]
          novasTentativas[tentativaAtual] = letrasDigitadas.slice(0, -1)
          setTentativas(novasTentativas)
          setLetrasDigitadas(letrasDigitadas.slice(0, -1))
        }
        return
      }

      // Adiciona a letra se ainda não tiver 5 letras
      if (letrasDigitadas.length < 5 && /^[A-Z]$/.test(key)) {
        const novasTentativas = [...tentativas]
        const novaTentativa = letrasDigitadas + key
        novasTentativas[tentativaAtual] = novaTentativa
        setTentativas(novasTentativas)
        setLetrasDigitadas(novaTentativa)
      }
    },
    [
      gameOver,
      letrasDigitadas,
      tentativas,
      tentativaAtual,
      verificarTentativa,
      startTimer,
      showModal,
      showHelpModal,
      showRankingModal,
      showSettingsModal,
      showNameInputModal,
    ],
  )

  // Manipula eventos de teclado físico
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Se algum modal estiver aberto, não processa teclas para o jogo
      if (showModal || showHelpModal || showRankingModal || showSettingsModal || showNameInputModal) {
        return
      }

      if (e.key === "Enter") {
        handleKeyPress("ENTER")
      } else if (e.key === "Backspace") {
        handleKeyPress("BACKSPACE")
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleKeyPress(e.key.toUpperCase())
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyPress, showModal, showHelpModal, showRankingModal, showSettingsModal, showNameInputModal])

  // Reinicia o jogo
  const reiniciarJogo = () => {
    const palavraAleatoria = palavras[Math.floor(Math.random() * palavras.length)]
    setPalavraSecreta(palavraAleatoria.toUpperCase())
    setTentativas(Array(6).fill(""))
    setTentativaAtual(0)
    setLetrasDigitadas("")
    setEstadoLetras({})
    setGameOver(false)
    setGanhou(false)
    setStartTime(null)
    setEndTime(null)
    setGameTime(0)
    gameStarted.current = false
    setShakeRow(null)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 bg-[#2e7d32]">
      <div className="w-full max-w-md flex flex-col items-center gap-4">
        <Header
          onReiniciar={reiniciarJogo}
          onShowRanking={() => setShowRankingModal(true)}
          onShowHelp={() => setShowHelpModal(true)}
          onShowSettings={() => setShowSettingsModal(true)}
        />

        <Grade
          tentativas={tentativas}
          tentativaAtual={tentativaAtual}
          palavraSecreta={palavraSecreta}
          shakeRow={shakeRow}
        />

        <Teclado onKeyPress={handleKeyPress} estadoLetras={estadoLetras} />

        {showModal && (
          <Modal
            title={modalContent.title}
            message={modalContent.message}
            onClose={() => setShowModal(false)}
            onReiniciar={gameOver ? reiniciarJogo : undefined}
          />
        )}

        {showRankingModal && <RankingModal onClose={() => setShowRankingModal(false)} />}

        {showHelpModal && <HelpModal onClose={() => setShowHelpModal(false)} />}

        {showSettingsModal && <SettingsModal onClose={() => setShowSettingsModal(false)} />}

        {showNameInputModal && (
          <NameInputModal
            onClose={() => setShowNameInputModal(false)}
            onSave={saveToRanking}
            gameTime={gameTime}
            tentativas={tentativaAtual + 1}
          />
        )}
      </div>
    </main>
  )
}
