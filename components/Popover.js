import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ChatDemo } from "./Brailinho"

export function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Assistente Brailinho</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 md:w-100 md:ml-40">

        <ChatDemo />


      </PopoverContent>
    </Popover>
  )
}
