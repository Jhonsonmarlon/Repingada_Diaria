"use client"

import { cn } from "@/lib/utils"

interface TecladoProps {
  onKeyPress: (key: string) => void
  estadoLetras: Record<string, string>
}

export default function Teclado({ onKeyPress, estadoLetras }: TecladoProps) {
  const linhas = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ]

  const getEstiloTecla = (letra: string) => {
    switch (estadoLetras[letra]) {
      case "correta":
        return "bg-[#4caf50] text-white" // Verde
      case "presente":
        return "bg-[#8bc34a] text-white" // Verde claro
      case "ausente":
        return "bg-[#1e3a29] text-white" // Verde escuro
      default:
        return "bg-[#388e3c] text-white" // Verde médio
    }
  }

  return (
    <div className="w-full max-w-md">
      {linhas.map((linha, i) => (
        <div key={i} className="flex justify-center gap-1 mb-1">
          {i === 2 && (
            <button
              onClick={() => onKeyPress("ENTER")}
              className="px-2 py-4 rounded bg-[#388e3c] text-white font-bold text-xs"
              style={{ minWidth: "65px" }}
            >
              ENTER
            </button>
          )}

          {linha.map((letra) => (
            <button
              key={letra}
              onClick={() => onKeyPress(letra)}
              className={cn("w-10 h-14 rounded font-bold", getEstiloTecla(letra))}
            >
              {letra}
            </button>
          ))}

          {i === 2 && (
            <button
              onClick={() => onKeyPress("BACKSPACE")}
              className="px-2 py-4 rounded bg-[#388e3c] text-white"
              style={{ minWidth: "45px" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto"
              >
                <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                <line x1="18" y1="9" x2="12" y2="15" />
                <line x1="12" y1="9" x2="18" y2="15" />
              </svg>
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
