// file: components/Popover.js

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChatDemo } from "./Brailinho"
import { RealtimeBrailinho } from "./RealtimeBrailinho" // Importe o novo componente

export function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {/* O nome do botão pode mudar para refletir as duas opções */}
        <Button variant="outline">Assistente Brailinho</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 md:w-[400px] md:ml-40">
        {/* Você pode usar um sistema de abas aqui para alternar entre texto e voz,
          ou simplesmente colocar um acima do outro.
        */}
        <div className="space-y-4">
           {/* Seção de Voz */}
          <RealtimeBrailinho />

          <hr/>

           {/* Seção de Texto (Opcional, pode manter ou remover) */}
          <details>
             <summary className="cursor-pointer text-sm font-medium text-center">Abrir chat de texto</summary>
             <ChatDemo />
          </details>
        </div>
      </PopoverContent>
    </Popover>
  )
}