// app/ui/home/Header.js

import { auth } from "@/auth";
import HeaderClient from "../../../components/HeaderClient";

export default async function Header() {
  // 1. Busca a sessão no servidor, de forma assíncrona
  const session = await auth();

  // 2. Renderiza o componente de cliente, passando a sessão como prop
  return <HeaderClient session={session} />;
}