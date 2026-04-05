"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...")
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages)
    } else {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const visiblePages = getVisiblePages()

  return (
    <div className="flex items-center justify-center gap-2 mt-12 animate-fade-in-up">
      {/* Botón anterior */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
          currentPage === 1
            ? "bg-zinc-950 text-stone-600 cursor-not-allowed border border-stone-800"
            : "bg-zinc-900 text-stone-300 hover:bg-stone-800 hover:text-amber-500 border border-stone-700 shadow-md hover:shadow-lg transform hover:scale-105"
        }`}
      >
        <ChevronLeft size={16} />
        <span className="hidden sm:inline">Anterior</span>
      </button>

      {/* Números de página */}
      <div className="flex items-center gap-1">
        {visiblePages.map((page, index) => (
          <div key={index}>
            {page === "..." ? (
              <span className="px-3 py-2 text-gray-400">...</span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                className={`w-10 h-10 rounded-xl font-medium transition-all duration-300 ${
                  currentPage === page
                    ? "bg-gradient-to-r from-red-900 to-red-800 text-amber-50 shadow-lg animate-pulse-glow"
                    : "bg-zinc-900 text-stone-300 hover:bg-stone-800 hover:text-amber-500 border border-stone-700 shadow-md hover:shadow-lg transform hover:scale-110"
                }`}
              >
                {page}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Botón siguiente */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
          currentPage === totalPages
            ? "bg-zinc-950 text-stone-600 cursor-not-allowed border border-stone-800"
            : "bg-zinc-900 text-stone-300 hover:bg-stone-800 hover:text-amber-500 border border-stone-700 shadow-md hover:shadow-lg transform hover:scale-105"
        }`}
      >
        <span className="hidden sm:inline">Siguiente</span>
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
