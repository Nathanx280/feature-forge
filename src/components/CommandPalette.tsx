import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { COMMANDS } from "@/lib/commands";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const groups = ["Navigate", "AI", "Notes", "Dev"] as const;

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No commands found.</CommandEmpty>
        {groups.map((g, i) => {
          const items = COMMANDS.filter((c) => c.group === g);
          if (!items.length) return null;
          return (
            <div key={g}>
              {i > 0 && <CommandSeparator />}
              <CommandGroup heading={g}>
                {items.map((cmd) => (
                  <CommandItem
                    key={cmd.id}
                    onSelect={async () => {
                      setOpen(false);
                      await cmd.run({ navigate: (to) => navigate({ to }) });
                    }}
                  >
                    <span className="font-medium">{cmd.label}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{cmd.description}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </div>
          );
        })}
      </CommandList>
    </CommandDialog>
  );
}
