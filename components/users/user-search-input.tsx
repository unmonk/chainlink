"use client"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { User } from "@clerk/nextjs/server"
import { useVirtualizer } from "@tanstack/react-virtual"
import { ColumnAliasProxyHandler } from "drizzle-orm"
import { Check, ChevronsUpDown } from "lucide-react"
import * as React from "react"
import { useDebounce } from "usehooks-ts"

type Option = {
  value: string
  label: string
}

interface VirtualizedComboboxProps {
  searchPlaceholder?: string
  width?: string
  height?: string
}

export function UserSearchInput({
  searchPlaceholder = "Search Users...",
  width = "400px",
  height = "400px",
}: VirtualizedComboboxProps) {
  const [open, setOpen] = React.useState<boolean>(false)
  const [selectedOption, setSelectedOption] = React.useState<string>("")

  const [search, setSearch] = React.useState<string>("")
  const debouncedSearch = useDebounce<string>(search, 500)

  const [options, setOptions] = React.useState<Option[]>([])
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isMounted, setIsMounted] = React.useState<boolean>(false)
  const parentRef = React.useRef(null)

  const virtualizer = useVirtualizer({
    count: options.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 5,
  })

  const virtualOptions = virtualizer.getVirtualItems()

  React.useEffect(() => {
    setIsLoading(true)
    fetch(`/api/users?query=${debouncedSearch}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.users) {
          setIsLoading(false)
          return
        }

        const userOptions: Option[] = data.users.map((user: User) => ({
          value: user.id,
          label: user.username ? user.username : user.id,
        }))
        setOptions(userOptions)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setIsLoading(false)
      })
  }, [debouncedSearch])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
          style={{
            width: width,
          }}
        >
          {selectedOption
            ? options.find(
                (option) => option.value.toLowerCase() === selectedOption
              )?.label
            : searchPlaceholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" style={{ width: width }}>
        <Command shouldFilter={false} onKeyDown={handleKeyDown}>
          <CommandInput
            onValueChange={setSearch}
            placeholder={"Search Users..."}
          />
          <CommandEmpty>No item found.</CommandEmpty>
          <CommandGroup
            ref={parentRef}
            style={{
              height: height,
              width: "100%",
              overflow: "auto",
            }}
          >
            <div
              style={{
                height: `${virtualizer.getTotalSize()}px`,
                width: "100%",
                position: "relative",
              }}
            >
              {virtualOptions.map((virtualOption) => (
                <CommandItem
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${virtualOption.size}px`,
                    transform: `translateY(${virtualOption.start}px)`,
                  }}
                  key={options[virtualOption.index].value}
                  value={options[virtualOption.index].value}
                  onSelect={(currentValue) => {
                    setSelectedOption(
                      currentValue === selectedOption ? "" : currentValue
                    )
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedOption === options[virtualOption.index].value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {options[virtualOption.index].label}
                </CommandItem>
              ))}
            </div>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
