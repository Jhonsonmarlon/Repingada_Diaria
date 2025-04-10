"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X } from "lucide-react"

interface RankingEntry {
  name: string
  time: number
  date: string
}

interface RankingModalProps {
  onClose: () => void
}

export default function RankingModal({ onClose }: RankingModalProps) {
  const [dailyRanking, setDailyRanking] = useState<RankingEntry[]>([])
  const [allTimeRanking, setAllTimeRanking] = useState<RankingEntry[]>([])
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

  useEffect(() => {
    // Carregar rankings do localStorage
    const loadRankings = () => {
      try {
        const savedRankings = localStorage.getItem("repingada_rankings")
        if (savedRankings) {
          const parsedRankings = JSON.parse(savedRankings) as RankingEntry[]

          // Filtrar ranking diário (apenas entradas de hoje)
          const today = new Date().toISOString().split("T")[0]
          const todayRankings = parsedRankings.filter((entry) => entry.date.startsWith(today))

          // Ordenar por tempo (menor para maior)
          const sortedDailyRankings = [...todayRankings].sort((a, b) => a.time - b.time).slice(0, 5)
          const sortedAllTimeRankings = [...parsedRankings].sort((a, b) => a.time - b.time).slice(0, 5)

          setDailyRanking(sortedDailyRankings)
          setAllTimeRanking(sortedAllTimeRankings)
        }
      } catch (error) {
        console.error("Erro ao carregar rankings:", error)
      }
    }

    loadRankings()
  }, [])

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
          <h2 className="text-xl font-bold">Ranking</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 bg-[#2d5a3c]">
            <TabsTrigger value="daily" className="data-[state=active]:bg-[#4caf50]">
              Diário
            </TabsTrigger>
            <TabsTrigger value="alltime" className="data-[state=active]:bg-[#4caf50]">
              Geral
            </TabsTrigger>
          </TabsList>

          <TabsContent value="daily">
            {dailyRanking.length > 0 ? (
              <div className="space-y-2">
                <div className="grid grid-cols-12 font-bold border-b border-white/20 pb-2">
                  <div className="col-span-1">#</div>
                  <div className="col-span-8">Nome</div>
                  <div className="col-span-3 text-right">Tempo</div>
                </div>
                {dailyRanking.map((entry, index) => (
                  <div key={index} className="grid grid-cols-12 py-2 border-b border-white/10">
                    <div className="col-span-1">{index + 1}</div>
                    <div className="col-span-8 truncate">{entry.name}</div>
                    <div className="col-span-3 text-right">{formatTime(entry.time)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-white/60">Nenhum registro hoje</p>
            )}
          </TabsContent>

          <TabsContent value="alltime">
            {allTimeRanking.length > 0 ? (
              <div className="space-y-2">
                <div className="grid grid-cols-12 font-bold border-b border-white/20 pb-2">
                  <div className="col-span-1">#</div>
                  <div className="col-span-8">Nome</div>
                  <div className="col-span-3 text-right">Tempo</div>
                </div>
                {allTimeRanking.map((entry, index) => (
                  <div key={index} className="grid grid-cols-12 py-2 border-b border-white/10">
                    <div className="col-span-1">{index + 1}</div>
                    <div className="col-span-8 truncate">{entry.name}</div>
                    <div className="col-span-3 text-right">{formatTime(entry.time)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-white/60">Nenhum registro</p>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose} className="border-[#4caf50] text-white hover:bg-[#4caf50]/20">
            Fechar
          </Button>
        </div>
      </div>
    </div>
  )
}
