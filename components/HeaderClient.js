// ui/home/Header.js

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
  Menu,
  ChevronRight
} from 'lucide-react'
import Image from 'next/image';
import { PopoverDemo } from '@/components/Popover';
import Link from 'next/link';
import { signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation';

export default function HeaderClient({ session}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNavOpen, setIsNavOpen] = useState(false)
  const profileRef = useRef(null)
  const navRef = useRef(null)
  const pathname = usePathname()

  // Fecha o menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        !event.target.closest('#profile-button')
      ) {
        setIsProfileOpen(false)
      }
      if (
        navRef.current &&
        !navRef.current.contains(event.target) &&
        !event.target.closest('#nav-button')
      ) {
        setIsNavOpen(false)
      }
    }

    if (isProfileOpen || isNavOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProfileOpen, isNavOpen])

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  // Função para verificar se um link está ativo
  const isActiveLink = (href) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  // Menu para usuários não logados
  const guestMenuItems = [
    { label: 'Início', href: '/', icon: Home },
    { label: 'Como funciona', href: '/como-funciona', icon: Info },
    { label: 'Sou especialista', href: '/cadastro/medico', icon: UserCheck },
    { label: 'Procurar especialista', href: '/procurar-especialista', icon: Search },
    { label: 'Login', href: '/login', icon: LogIn }
  ]

  // Menu para usuários logados
  const userMenuItems = [
    { label: 'Início', href: '/', icon: Home },
    { label: 'Como funciona', href: '/como-funciona', icon: Info },
    { label: 'Consultas', href: '/consultas', icon: Calendar },
    { label: 'Procurar especialista', href: '/procurar-especialista', icon: Search }
  ]

  const currentMenuItems = session ? userMenuItems : guestMenuItems

  return (
    <header className="relative">
      {/* Overlay para a sidebar */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-40 ${
          isNavOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      <div className="header h-18 bg-white flex justify-between items-center shadow-sm px-4 md:px-8 font-['Urbanist-semibold']">
        {/* Logo e Popover */}
        <div className="flex-shrink-0 flex flex-row items-center gap-4">
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
            {currentMenuItems.map((item) => {
              const isActive = isActiveLink(item.href)
              
              return (
                <li
                  key={item.label}
                  className={`relative flex items-center gap-2 ${
                    isActive ? 'text-[#338DEF]' : 'text-[#3C3C3C]'
                  } hover:text-[#338DEF] transition-colors duration-200`}
                >
                  {isActive && (
                    <span className="w-2 h-2 bg-[#338DEF] rounded-full"></span>
                  )}
                  <Link href={item.href} className="block">
                    {item.label}
                  </Link>
                </li>
              )
            })}

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
          id="nav-button"
          onClick={() => setIsNavOpen(true)}
          className="md:hidden focus:outline-none"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar de navegação mobile */}
      <aside
        ref={navRef}
        className={`fixed top-0 right-0 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          isNavOpen ? 'translate-x-0' : 'translate-x-full'
        } w-80`}
      >
        <div className="flex items-center justify-between px-6 py-6 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Navegação</h2>
          <button 
            onClick={() => setIsNavOpen(false)} 
            className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-6 px-6">
          <ul className="space-y-2">
            {currentMenuItems.map((item) => {
              const IconComponent = item.icon
              const isActive = isActiveLink(item.href)
              
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-[#338DEF] text-white shadow-md' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setIsNavOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <IconComponent size={20} />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {isActive && (
                      <ChevronRight size={20} className="text-white" />
                    )}
                  </Link>
                </li>
              )
            })}

            {/* Opções para usuários logados no mobile */}
            {session && (
              <>
                <li>
                  <Link
                    href="/perfil"
                    className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActiveLink('/perfil') 
                        ? 'bg-[#338DEF] text-white shadow-md' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setIsNavOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <User size={20} />
                      <span className="font-medium">Meu Perfil</span>
                    </div>
                    {isActiveLink('/perfil') && (
                      <ChevronRight size={20} className="text-white" />
                    )}
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <LogOut size={20} />
                      <span className="font-medium">Sair</span>
                    </div>
                  </button>
                </li>
              </>
            )}

            {/* Botão "Cadastre-se" mobile para usuários não logados */}
            {!session && (
              <li className="mt-6">
                <Link
                  href="/cadastro/paciente"
                  className="flex items-center justify-center space-x-2 rounded-lg w-full h-12 bg-[#338DEF] text-white hover:bg-blue-600 transition-all duration-200 cursor-pointer font-medium text-sm shadow-md hover:shadow-lg active:scale-95"
                  onClick={() => setIsNavOpen(false)}
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
