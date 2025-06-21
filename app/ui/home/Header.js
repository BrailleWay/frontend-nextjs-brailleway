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

  return (
    <header className="relative">
      {/* Overlay (aparece apenas quando isOpen === true) */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      />

      <div className="header h-18 bg-white flex justify-between items-center shadow-sm px-4 md:px-8 font-['Urbanist-semibold']">
        {/* Logo: w-20 no desktop, md:w-16 em <768px, sm:w-12 em <640px */}
        <div className="flex-shrink-0 flex flex-row items-center gap-10">
          <Image
            src='/home/brailleway_logo.png' width={500} height={500}
            alt=" No canto esquerdo do cabeçalho, sobre um fundo branco, está posicionada a logo da Braille Way.
A logo tem a forma de um quadrado com cantos arredondados. Esse quadrado possui um degradê suave 
que remete à brisa do mar:
começa na borda inferior direita com um tom verde-água claro , passa por um azul vivo no centro , 
e termina na parte superior com um azul mais claro e radiante .
Dentro do quadrado há um ícone de óculos escuros, simbolizando acessibilidade visual.
À direita do quadrado está o nome da marca: a palavra “Braille”, escrita em azul e em negrito, seguida logo abaixo pela palavra “Way”, 
em preto e sem negrito, formando “Braille Way”.
Logo abaixo da logo visual, está escrita a palavra “acolher” em braille, representando o valor central da marca: inclusão e acolhimento"

            className="w-20 md:w-13 sm:w-12"
          />
          <PopoverDemo />
        </div>

        {/* Menu desktop (oculto em md e sm) */}
        <nav className="hidden md:flex space-x-8 items-center">
          <ul className="flex space-x-8 items-center">
            <li className="hover:text-[#338DEF]">
              <Link href="/homepage">Início</Link>
            </li>
            <li className="hover:text-[#338DEF]">
              <Link href="#">Como funciona</Link>
            </li>
            <li className="hover:text-[#338DEF]">
              <Link href="/cadastro/medico">Sou especialista</Link>
            </li>
            <li className="hover:text-[#338DEF]">
              <Link href="#">Procurar especialista</Link>
            </li>
            <li className="hover:text-[#338DEF]">
              <Link href="/login">Login</Link>
            </li>
            <li className="rounded-full flex justify-center items-center w-37 h-14 bg-[#338DEF] text-white hover:bg-blue-600 transition-colors duration-200">
              <Link href="/cadastro/paciente">Cadastre-se</Link>
            </li>
          </ul>
        </nav>

        <button
          id="hamburger-button"
          onClick={() => setIsOpen(true)}
          className="md:hidden focus:outline-none"
        >
          <Image width={44} height={33} src='/home/sort.png' alt="Menu" className="w-6 h-6" />
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
          imagem
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
                className="flex
    items-center
    justify-center
    space-x-2
    rounded-full
    w-full
    h-12
    bg-[#338DEF]
    text-white
    hover:bg-blue-600
    transition-colors
    duration-200
    cursor-pointer
    font-medium
    text-base
    shadow-md
    hover:shadow-lg
    active:scale-95
    active:shadow-inner
    
  "
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
