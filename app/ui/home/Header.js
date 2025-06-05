'use client';

import { useState, useEffect, useRef } from 'react'
import {
  Home,
  Info,
  UserCheck,
  Search,
  LogIn,
  UserPlus,
  X
} from 'lucide-react'



export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const drawerRef = useRef(null)

  // Fecha o menu ao clicar fora do drawer
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target) &&
        !event.target.closest('#hamburger-button')
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <header className="relative">
      {/* Overlay (aparece apenas quando isOpen === true) */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      <div className="header h-18 bg-white flex justify-between items-center shadow-sm px-4 md:px-8 font-['Urbanist-semibold']">
        {/* Logo: w-20 no desktop, md:w-16 em <768px, sm:w-12 em <640px */}
        <div className="flex-shrink-0">
          <img
            alt="Logo Brailleway"
            className="w-20 md:w-16 sm:w-12"
          />
        </div>

        {/* Menu desktop (oculto em md e sm) */}
        <nav className="hidden md:flex space-x-8 items-center">
          <ul className="flex space-x-8 items-center">
            <li className="hover:text-[#338DEF]">
              <a href="#">Início</a>
            </li>
            <li className="hover:text-[#338DEF]">
              <a href="#">Como funciona</a>
            </li>
            <li className="hover:text-[#338DEF]">
              <a href="#">Sou psicólogo</a>
            </li>
            <li className="hover:text-[#338DEF]">
              <a href="#">Procurar psicólogo</a>
            </li>
            <li className="hover:text-[#338DEF]">
              <a href="#">Login</a>
            </li>
            <li className="rounded-full flex justify-center items-center w-37 h-14 bg-[#338DEF] text-white hover:bg-blue-600 transition-colors duration-200">
              <a href="#">Cadastre-se</a>
            </li>
          </ul>
        </nav>

        <button
          id="hamburger-button"
          onClick={() => setIsOpen(true)}
          className="md:hidden focus:outline-none"
        >
          <img alt="Menu" className="w-6 h-6" />
        </button>
      </div>

      {/* Drawer lateral (aparece em md e sm) */}
      <aside
        ref={drawerRef}
        className={`
          fixed top-0 left-0 h-full bg-white shadow-lg z-50
          transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          w-64  /* ocupa ~75% da tela em mobile; ajuste se quiser maior/menor */
        `}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <img
            alt="Logo Brailleway"
            className="w-16 sm:w-14"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="focus:outline-none"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="mt-4 px-4">
          <ul className="space-y-4">
            <li>
              <a
                href="#"
                className="flex items-center space-x-3 hover:text-[#338DEF] transition-colors duration-200"
              >
                <Home size={20} />
                <span>Início</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center space-x-3 hover:text-[#338DEF] transition-colors duration-200"
              >
                <Info size={20} />
                <span>Como funciona</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center space-x-3 hover:text-[#338DEF] transition-colors duration-200"
              >
                <UserCheck size={20} />
                <span>Sou psicólogo</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center space-x-3 hover:text-[#338DEF] transition-colors duration-200"
              >
                <Search size={20} />
                <span>Procurar psicólogo</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center space-x-3 hover:text-[#338DEF] transition-colors duration-200"
              >
                <LogIn size={20} />
                <span>Login</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center justify-center space-x-2 rounded-full w-full h-12 bg-[#338DEF] text-white hover:bg-blue-600 transition-colors duration-200"
              >
                <UserPlus size={20} />
                <span>Cadastre-se</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>
    </header>
  )
}
