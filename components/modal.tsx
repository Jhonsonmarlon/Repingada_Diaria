"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ModalProps {
  title: string
  message: string
  onClose: () => void
  onReiniciar?: () => void
}

export default function Modal({ title, message, onClose, onReiniciar }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Adiciona event listener para fechar o modal com Esc ou Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [onClose])

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
      <div ref={modalRef} className="bg-[#1e3a29] text-white p-6 rounded-lg max-w-sm w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <p className="mb-6">{message}</p>

        <div className="flex justify-end gap-2">
          {onReiniciar && (
            <Button
              onClick={() => {
                onReiniciar()
                onClose()
              }}
              className="bg-[#4caf50] hover:bg-[#388e3c]"
            >
              Jogar Novamente
            </Button>
          )}

          <Button variant="outline" onClick={onClose} className="border-white text-white hover:bg-white/10">
            Fechar
          </Button>
        </div>
      </div>
    </div>
  )
}
