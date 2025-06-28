// app/ui/home/Header.js

import { auth } from "@/auth";
import HeaderClient from "../../../components/HeaderClient";

export default async function Header() {
  const session = await auth();

  return (
    <>
      <HeaderClient session={session} />;
    </>
  );
}
