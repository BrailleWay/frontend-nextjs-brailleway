// app/api/auth/[...nextauth]/route.js - Auth.js v5

import { handlers } from "@/auth"; // Importa os handlers do seu arquivo auth.js
export const { GET, POST } = handlers;