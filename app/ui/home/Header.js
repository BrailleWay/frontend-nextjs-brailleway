'use client'

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
import Image from 'next/image';
import { PopoverDemo } from '@/components/Popover';
import Link from 'next/link';

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

  const currentPage = 'Início'

  return (
    <header className="relative">
      {/* Overlay (aparece apenas quando isOpen === true) */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      <div className="header h-18 bg-white flex justify-between items-center shadow-sm px-4 md:px-8 font-['Urbanist-semibold']">
        {/* Logo */}
        <div className="flex-shrink-0 flex flex-row items-center gap-10">
          <Image
            src="/home/brailleway_logo.png"
            width={500}
            height={500}
            alt="Logo da Braille Way"
            className="w-20 md:w-28 sm:w-12"
          />
          <PopoverDemo />
        </div>
        {/* Menu desktop */}
        <nav className="hidden md:flex space-x-10 items-center">
          <ul className="flex space-x-10 items-center text-[#3C3C3C]">
            {[
              { label: 'Início', href: '/' },
              { label: 'Como funciona', href: '/como-funciona' },
              { label: 'Sou especialista', href: '/cadastro/medico' },
              { label: 'Procurar especialista', href: '/procurar-especialista' },
              { label: 'Login', href: '/login' }
            ].map((item) => (
              <li
                key={item.label}
                className={`relative flex items-center gap-2 ${
                  currentPage === item.label ? 'text-[#338DEF]' : 'text-[#3C3C3C]'
                } hover:text-[#338DEF] transition-colors duration-200`}
              >
                {currentPage === item.label && (
                  <span className="w-2 h-2 bg-[#338DEF] rounded-full"></span>
                )}
                <Link href={item.href} className="block">
                  {item.label}
                </Link>
              </li>
            ))}

            {/* 🔥 Botão "Cadastre-se" */}
            <li>
              <Link href="/cadastro/paciente" className="flex items-center justify-center rounded-full bg-[#338DEF] text-white px-5 py-2 text-sm hover:bg-blue-600 transition-all duration-200 shadow-sm active:scale-95">
                Cadastre-se
              </Link>
            </li>
          </ul>
        </nav>

        {/* Botão menu mobile */}
        <button
          id="hamburger-button"
          onClick={() => setIsOpen(true)}
          className="md:hidden focus:outline-none"
        >
          <Image width={44} height={33} src="/home/sort.png" alt="Menu" className="w-6 h-6" />
        </button>
      </div>

      {/* Drawer lateral (menu mobile) */}
      <aside
        ref={drawerRef}
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } w-64`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b">
          imagem
          <button onClick={() => setIsOpen(false)} className="focus:outline-none">
            <X size={24} />
          </button>
        </div>

        <nav className="mt-6 px-4">
          <ul className="space-y-6 text-[#3C3C3C]">
            {[
              { label: 'Início', icon: <Home size={20} />, href: '/' },
              { label: 'Como funciona', icon: <Info size={20} />, href: '/como-funciona' },
              { label: 'Sou psicólogo', icon: <UserCheck size={20} />, href: '/cadastro/medico' },
              { label: 'Procurar psicólogo', icon: <Search size={20} />, href: '/procurar-psicologo' },
              { label: 'Login', icon: <LogIn size={20} />, href: '/login' }
            ].map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className={`flex items-center space-x-3 ${
                    currentPage === item.label ? 'text-[#338DEF]' : 'text-[#3C3C3C]'
                  } hover:text-[#338DEF] transition-colors duration-200 relative`}
                >
                  {/* 🔵 Bolinha lateral */}
                  {currentPage === item.label && (
                    <span className="w-2 h-2 bg-[#338DEF] rounded-full"></span>
                  )}
                  {item.icon}
                  <span>{item.label}</span>
                </a>
              </li>
            ))}

            {/* 🔥 Botão "Cadastre-se" mobile */}
            <li>
              <a
                href="/cadastro/paciente"
                className="flex items-center justify-center space-x-2 rounded-full w-full h-11 bg-[#338DEF] text-white hover:bg-blue-600 transition-colors duration-200 cursor-pointer font-medium text-sm shadow-md hover:shadow-lg active:scale-95"
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
