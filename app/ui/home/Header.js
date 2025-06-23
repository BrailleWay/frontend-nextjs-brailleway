'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Home,
  Info,
  UserCheck,
  Search,
  LogIn,
  UserPlus,
  X,
  User,
  Calendar,
  LogOut,
  Menu
} from 'lucide-react'
import Image from 'next/image';
import { PopoverDemo } from '@/components/Popover';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const drawerRef = useRef(null)
  const profileRef = useRef(null)
  const { data: session, status } = useSession()

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
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        !event.target.closest('#profile-button')
      ) {
        setIsProfileOpen(false)
      }
    }

    if (isOpen || isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, isProfileOpen])

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const currentPage = 'Início'

  // Menu para usuários não logados
  const guestMenuItems = [
    { label: 'Início', href: '/' },
    { label: 'Como funciona', href: '/como-funciona' },
    { label: 'Sou especialista', href: '/cadastro/medico' },
    { label: 'Procurar especialista', href: '/procurar-especialista' },
    { label: 'Login', href: '/login' }
  ]

  // Menu para usuários logados
  const userMenuItems = [
    { label: 'Início', href: '/' },
    { label: 'Como funciona', href: '/como-funciona' },
    { label: 'Consultas', href: '/consultas' },
    { label: 'Procurar especialista', href: '/procurar-especialista' }
  ]

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
            {(session ? userMenuItems : guestMenuItems).map((item) => (
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

            {/* Botão para usuários não logados */}
            {!session && (
              <li>
                <Link href="/cadastro/paciente" className="flex items-center justify-center rounded-full bg-[#338DEF] text-white px-5 py-2 text-sm hover:bg-blue-600 transition-all duration-200 shadow-sm active:scale-95">
                  Cadastre-se
                </Link>
              </li>
            )}

            {/* Perfil para usuários logados */}
            {session && (
              <li className="relative">
                <button
                  id="profile-button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-[#338DEF] text-white hover:bg-blue-600 transition-all duration-200 shadow-sm active:scale-95"
                >
                  <User size={20} />
                </button>

                {/* Dropdown do perfil */}
                {isProfileOpen && (
                  <div
                    ref={profileRef}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-800">{session.user.name}</p>
                      <p className="text-xs text-gray-500">{session.user.email}</p>
                    </div>
                    <Link
                      href="/perfil"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User size={16} className="mr-2" />
                      Meu Perfil
                    </Link>
                    <Link
                      href="/consultas"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Calendar size={16} className="mr-2" />
                      Minhas Consultas
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sair
                    </button>
                  </div>
                )}
              </li>
            )}
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
          <Image
            src="/home/brailleway_logo.png"
            width={100}
            height={100}
            alt="Logo da Braille Way"
            className="w-16"
          />
          <button onClick={() => setIsOpen(false)} className="focus:outline-none">
            <X size={24} />
          </button>
        </div>

        <nav className="mt-6 px-4">
          <ul className="space-y-6 text-[#3C3C3C]">
            {(session ? userMenuItems : guestMenuItems).map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 ${
                    currentPage === item.label ? 'text-[#338DEF]' : 'text-[#3C3C3C]'
                  } hover:text-[#338DEF] transition-colors duration-200 relative`}
                  onClick={() => setIsOpen(false)}
                >
                  {/* 🔵 Bolinha lateral */}
                  {currentPage === item.label && (
                    <span className="w-2 h-2 bg-[#338DEF] rounded-full"></span>
                  )}
                  {item.label === 'Início' && <Home size={20} />}
                  {item.label === 'Como funciona' && <Info size={20} />}
                  {item.label === 'Consultas' && <Calendar size={20} />}
                  {item.label === 'Procurar especialista' && <Search size={20} />}
                  {item.label === 'Login' && <LogIn size={20} />}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}

            {/* Opções para usuários logados no mobile */}
            {session && (
              <>
                <li>
                  <Link
                    href="/perfil"
                    className="flex items-center space-x-3 text-[#3C3C3C] hover:text-[#338DEF] transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    <User size={20} />
                    <span>Meu Perfil</span>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full text-red-600 hover:text-red-700 transition-colors duration-200"
                  >
                    <LogOut size={20} />
                    <span>Sair</span>
                  </button>
                </li>
              </>
            )}

            {/* Botão "Cadastre-se" mobile para usuários não logados */}
            {!session && (
              <li>
                <Link
                  href="/cadastro/paciente"
                  className="flex items-center justify-center space-x-2 rounded-full w-full h-11 bg-[#338DEF] text-white hover:bg-blue-600 transition-colors duration-200 cursor-pointer font-medium text-sm shadow-md hover:shadow-lg active:scale-95"
                  onClick={() => setIsOpen(false)}
                >
                  <UserPlus size={20} />
                  <span>Cadastre-se</span>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </aside>
    </header>
  )
}
