// file: components/Popover.js

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"


export function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {/* O nome do botão pode mudar para refletir as duas opções */}
        <Button variant="outline">Assistente Brailinho</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 md:w-[400px] md:ml-40">
        <div className="space-y-4">
        </div>
      </PopoverContent>
    </Popover>
  )
}