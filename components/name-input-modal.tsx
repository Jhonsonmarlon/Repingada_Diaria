"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface NameInputModalProps {
  onClose: () => void
  onSave: (name: string) => void
  gameTime: number
  tentativas: number
}

export default function NameInputModal({ onClose, onSave, gameTime, tentativas }: NameInputModalProps) {
  const [name, setName] = useState("")
  const modalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Foca no input quando o modal abre
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Adiciona event listener para fechar o modal com Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "Enter" && name.trim()) {
        handleSave()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [onClose, name])

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim())
    }
  }

  // Formatar tempo em minutos e segundos
  const formatTime = (timeInMs: number) => {
    const totalSeconds = Math.floor(timeInMs / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={(e) => {
        // Fecha o modal ao clicar fora dele
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
          onClose()
        }
      }}
    >
      <div ref={modalRef} className="bg-[#1e3a29] text-white p-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Parabéns!</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-4">
          <p>
            Você acertou a palavra em {tentativas} {tentativas === 1 ? "tentativa" : "tentativas"} com o tempo de{" "}
            {formatTime(gameTime)}!
          </p>

          <div className="space-y-2">
            <label htmlFor="player-name" className="block text-sm font-medium">
              Digite seu nome para o ranking:
            </label>
            <Input
              id="player-name"
              ref={inputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              className="bg-[#2d5a3c] border-[#2d5a3c] focus-visible:ring-[#4caf50]"
              maxLength={20}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose} className="border-[#4caf50] text-white hover:bg-[#4caf50]/20">
            Pular
          </Button>
          <Button
            onClick={handleSave}
            disabled={!name.trim()}
            className="bg-[#4caf50] hover:bg-[#388e3c] disabled:opacity-50"
          >
            Salvar
          </Button>
        </div>
      </div>
    </div>
  )
}
