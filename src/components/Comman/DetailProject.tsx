import { Bug, ClipboardList } from "lucide-react";

import {
    Command,
    // CommandEmpty,
    CommandGroup,
    // CommandInput,
    CommandItem,
    CommandList,
    // CommandSeparator,
    // CommandShortcut,
} from "@/components/ui/command"

export function DetailProject() {
    return (
        <Command className="rounded-lg border shadow-md md:min-w-[40px] overflow-auto">
            <p className="p-4 w-full bg-transparent outline-none text-sm break-words">
                cxxnckjnxjkcnkjxnckjnxkjcnxknxkjcnjkxcxcjnckjxncxkcxnjksdnknsdkjsdsdnjkndskjsdnkdnskjdsnjkdskj
            </p>
            <CommandList>
                <CommandGroup>
                    <CommandItem className="flex justify-between items-center w-full bg-white" style={{ backgroundColor: 'white' }}>
                        <div className="flex items-center space-x-2">
                            <ClipboardList />
                            <span>24-12-2024</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Bug />
                            <span>Bug</span>
                        </div>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </Command>
    )
}
