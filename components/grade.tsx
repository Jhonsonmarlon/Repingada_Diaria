"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface GradeProps {
  tentativas: string[]
  tentativaAtual: number
  palavraSecreta: string
  shakeRow: number | null
}

export default function Grade({ tentativas, tentativaAtual, palavraSecreta, shakeRow }: GradeProps) {
  // Estado para controlar a animação de tremida
  const [isShaking, setIsShaking] = useState(false)

  // Efeito para controlar a animação de tremida
  useEffect(() => {
    if (shakeRow !== null) {
      setIsShaking(true)
      const timer = setTimeout(() => {
        setIsShaking(false)
      }, 500) // Duração da animação
      return () => clearTimeout(timer)
    }
  }, [shakeRow])

  // Função para determinar o estado de uma letra
  const getEstadoLetra = (tentativa: string, index: number, letraIndex: number) => {
    const letra = tentativa[letraIndex]

    if (!letra) return ""

    if (letra === palavraSecreta[letraIndex]) {
      return "bg-[#4caf50] text-white border-[#4caf50]" // Correta - verde
    }

    if (palavraSecreta.includes(letra)) {
      return "bg-[#8bc34a] text-white border-[#8bc34a]" // Presente - verde claro
    }

    return "bg-[#1e3a29] text-white border-[#1e3a29]" // Ausente - verde escuro
  }

  return (
    <div className="grid grid-rows-6 gap-1 w-full max-w-xs mx-auto mb-4">
      {tentativas.map((tentativa, index) => (
        <div
          key={index}
          className={cn("grid grid-cols-5 gap-1", index === shakeRow && isShaking ? "animate-shake" : "")}
        >
          {Array(5)
            .fill(0)
            .map((_, letraIndex) => (
              <div
                key={letraIndex}
                className={cn(
                  "w-full aspect-square flex items-center justify-center text-2xl font-bold rounded-lg shadow-md",
                  index < tentativaAtual
                    ? getEstadoLetra(tentativa, index, letraIndex)
                    : index === tentativaAtual && letraIndex < tentativa.length
                      ? "bg-[#388e3c] text-white"
                      : index === tentativaAtual && letraIndex === tentativa.length
                        ? "bg-transparent border-2 border-[#4caf50] border-dashed" // Caixa atual de digitação
                        : "bg-[#1e3a29]/40 text-white",
                )}
              >
                {tentativa[letraIndex] || ""}
              </div>
            ))}
        </div>
      ))}
    </div>
  )
}
