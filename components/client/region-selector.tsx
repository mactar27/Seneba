"use client";

import * as React from "react";
import { Check, ChevronsUpDown, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RegionSenegal } from "@/lib/types";

// Exemple de données simulées en attendant l'intégration avec la BDD
const regions: Omit<RegionSenegal, "id">[] = [
  { nom_region: "Dakar", chef_lieu: "Dakar" },
  { nom_region: "Thiès", chef_lieu: "Thiès" },
  { nom_region: "Diourbel", chef_lieu: "Diourbel" },
  { nom_region: "Fatick", chef_lieu: "Fatick" },
  { nom_region: "Kaolack", chef_lieu: "Kaolack" },
  { nom_region: "Kaffrine", chef_lieu: "Kaffrine" },
  { nom_region: "Tambacounda", chef_lieu: "Tambacounda" },
  { nom_region: "Kédougou", chef_lieu: "Kédougou" },
  { nom_region: "Kolda", chef_lieu: "Kolda" },
  { nom_region: "Sédhiou", chef_lieu: "Sédhiou" },
  { nom_region: "Ziguinchor", chef_lieu: "Ziguinchor" },
  { nom_region: "Saint-Louis", chef_lieu: "Saint-Louis" },
  { nom_region: "Louga", chef_lieu: "Louga" },
  { nom_region: "Matam", chef_lieu: "Matam" },
];

interface RegionSelectorProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RegionSelector({ value, onChange, placeholder = "Sélectionner une région..." }: RegionSelectorProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? regions.find((region) => region.nom_region === value)?.nom_region
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Rechercher une région..." />
          <CommandList>
            <CommandEmpty>Aucune région trouvée.</CommandEmpty>
            <CommandGroup>
              {regions.map((region) => (
                <CommandItem
                  key={region.nom_region}
                  value={region.nom_region}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === region.nom_region ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  {region.nom_region}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
