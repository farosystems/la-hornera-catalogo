"use client"

import { useEffect, useState } from "react"
import TypewriterText from "./TypewriterText"

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section
      id="inicio"
      className="relative text-white pt-12 overflow-hidden h-[30vh] min-h-[250px] sm:h-[35vh] sm:min-h-[300px] flex items-center"
    >
      {/* Imagen de fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/cerveza.jpg')"
        }}
      >
        {/* Velado suave: la imagen se ve más; el texto sigue legible */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(45, 12, 12, 0.42), rgba(28, 10, 8, 0.32), rgba(55, 18, 14, 0.38))' }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10"></div>
      </div>

      {/* Fondo animado con partículas */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-10 left-10 w-4 h-4 bg-amber-600/80 rounded-full animate-float"></div>
        <div className="absolute top-32 right-20 w-6 h-6 bg-red-800/70 rounded-full animate-float delay-200"></div>
        <div className="absolute bottom-20 left-1/4 w-3 h-3 bg-amber-700/60 rounded-full animate-float delay-500"></div>
        <div className="absolute bottom-40 right-1/3 w-5 h-5 bg-red-950/80 rounded-full animate-float delay-700"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4 md:py-6">
        <div className={`text-center transition-all duration-1000 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          <h1 className="text-lg sm:text-xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 leading-tight">
            Bienvenidos a<br />
            <span className="inline-block min-w-[200px] sm:min-w-[240px] md:min-w-[350px] lg:min-w-[420px]">
              <TypewriterText />
            </span>
          </h1>
          <p
            className={`text-sm md:text-base lg:text-lg mb-3 max-w-2xl mx-auto transition-all duration-1000 delay-500 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
          >
            ESPACIO CERVECERO con los mejores planes de financiación
          </p>
        </div>

      </div>
    </section>
  )
}
