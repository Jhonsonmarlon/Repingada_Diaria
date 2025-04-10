"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { X, Github, Linkedin, Globe, Instagram, BookOpen } from "lucide-react"
import Image from "next/image"

interface SettingsModalProps {
  onClose: () => void
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
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

  const socialLinks = [
    {
      name: "GitHub",
      url: "https://github.com/Jhonsonmarlon",
      icon: <Github className="h-5 w-5" />,
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/jhonson-marlon-244908152/",
      icon: <Linkedin className="h-5 w-5" />,
    },
    {
      name: "Portfolio",
      url: "https://jhonsondev.com/",
      icon: <Globe className="h-5 w-5" />,
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/jhonson_marlon/",
      icon: <Instagram className="h-5 w-5" />,
    },
    {
      name: "Lattes",
      url: "http://lattes.cnpq.br/5744713347931747",
      icon: <BookOpen className="h-5 w-5" />,
    },
  ]

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
          <h2 className="text-xl font-bold">Sobre o Desenvolvedor</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#4caf50]">
            <Image src="/perfil.jpg" alt="Jhonson Marlon" fill className="object-cover" />
          </div>

          <h3 className="text-lg font-bold">Jhonson Marlon</h3>
          <p className="text-sm text-center text-white/80 mb-2">Desenvolvedor e criador do jogo REPINGADA DIÁRIA</p>

          <div className="grid grid-cols-1 gap-2 w-full">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 rounded-md bg-[#2d5a3c] hover:bg-[#3a7049] transition-colors"
              >
                {link.icon}
                <span>{link.name}</span>
              </a>
            ))}
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
