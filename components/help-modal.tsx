"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface HelpModalProps {
  onClose: () => void
}

export default function HelpModal({ onClose }: HelpModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Adiciona event listener para fechar o modal com Esc
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
      <div ref={modalRef} className="bg-[#1e3a29] text-white p-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Como Jogar</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-4">
          <p>Adivinhe a palavra do dia em 6 tentativas. Cada tentativa deve ser uma palavra válida de 5 letras.</p>

          <p>Após cada tentativa, as cores das letras mudarão para mostrar o quão perto você está da resposta.</p>

          <div className="space-y-2 mt-4">
            <h3 className="font-bold">Exemplos</h3>

            <div className="flex gap-1 mt-2">
              <div className="w-10 h-10 flex items-center justify-center text-xl font-bold bg-[#4caf50] text-white rounded-lg shadow-md">
                T
              </div>
              <div className="w-10 h-10 flex items-center justify-center text-xl font-bold bg-[#1e3a29] text-white rounded-lg shadow-md">
                R
              </div>
              <div className="w-10 h-10 flex items-center justify-center text-xl font-bold bg-[#1e3a29] text-white rounded-lg shadow-md">
                O
              </div>
              <div className="w-10 h-10 flex items-center justify-center text-xl font-bold bg-[#1e3a29] text-white rounded-lg shadow-md">
                C
              </div>
              <div className="w-10 h-10 flex items-center justify-center text-xl font-bold bg-[#1e3a29] text-white rounded-lg shadow-md">
                A
              </div>
            </div>
            <p>A letra T está na palavra e na posição correta.</p>

            <div className="flex gap-1 mt-2">
              <div className="w-10 h-10 flex items-center justify-center text-xl font-bold bg-[#1e3a29] text-white rounded-lg shadow-md">
                P
              </div>
              <div className="w-10 h-10 flex items-center justify-center text-xl font-bold bg-[#8bc34a] text-white rounded-lg shadow-md">
                I
              </div>
              <div className="w-10 h-10 flex items-center justify-center text-xl font-bold bg-[#1e3a29] text-white rounded-lg shadow-md">
                L
              </div>
              <div className="w-10 h-10 flex items-center justify-center text-xl font-bold bg-[#1e3a29] text-white rounded-lg shadow-md">
                H
              </div>
              <div className="w-10 h-10 flex items-center justify-center text-xl font-bold bg-[#1e3a29] text-white rounded-lg shadow-md">
                A
              </div>
            </div>
            <p>A letra I está na palavra, mas na posição errada.</p>

            <div className="flex gap-1 mt-2">
              <div className="w-10 h-10 flex items-center justify-center text-xl font-bold bg-[#1e3a29] text-white rounded-lg shadow-md">
                V
              </div>
              <div className="w-10 h-10 flex items-center justify-center text-xl font-bold bg-[#1e3a29] text-white rounded-lg shadow-md">
                E
              </div>
              <div className="w-10 h-10 flex items-center justify-center text-xl font-bold bg-[#1e3a29] text-white rounded-lg shadow-md">
                R
              </div>
              <div className="w-10 h-10 flex items-center justify-center text-xl font-bold bg-[#1e3a29] text-white rounded-lg shadow-m">
                D
              </div>
              <div className="w-10 h-10 flex items-center justify-center text-xl font-bold bg-[#1e3a29] text-white rounded-lg shadow-md">
                E
              </div>
            </div>
            <p>Nenhuma das letras está na palavra.</p>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button variant="outline" onClick={onClose} className="border-[#4caf50] text-white hover:bg-[#4caf50]/20">
            Fechar
          </Button>
        </div>
      </div>
    </div>
  )
}
