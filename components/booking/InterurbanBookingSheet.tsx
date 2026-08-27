"use client";

import * as React from "react";
import { Drawer } from "vaul";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RegionSelector } from "@/components/client/region-selector";
import { calculateInterurbanPrice } from "@/lib/actions/pricing";
import { Car, MapPin, Navigation, Wallet } from "lucide-react";

export function InterurbanBookingSheet() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [departRegion, setDepartRegion] = React.useState<string>("");
  const [arriveeRegion, setArriveeRegion] = React.useState<string>("");
  const [includePeage, setIncludePeage] = React.useState(false);
  const [estimatedPrice, setEstimatedPrice] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(false);

  // Déclenche le calcul dès que les deux régions changent
  React.useEffect(() => {
    if (departRegion && arriveeRegion) {
      setLoading(true);
      calculateInterurbanPrice(departRegion, arriveeRegion, includePeage)
        .then((price) => setEstimatedPrice(price))
        .catch((err) => console.error("Erreur tarification:", err))
        .finally(() => setLoading(false));
    }
  }, [departRegion, arriveeRegion, includePeage]);

  return (
    <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
      <Drawer.Trigger asChild>
        <Button className="w-full py-6 text-lg font-semibold bg-green-600 hover:bg-green-700 text-white shadow-lg rounded-xl">
          <Navigation className="mr-2 h-5 w-5 animate-pulse" />
          Voyager en Région (Intercity)
        </Button>
      </Drawer.Trigger>
      
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Drawer.Content className="bg-background flex flex-col rounded-t-[24px] h-[85vh] fixed bottom-0 left-0 right-0 z-50 border-t outline-none">
          <div className="p-4 bg-background rounded-t-[24px] flex-1 max-w-md mx-auto w-full overflow-y-auto">
            {/* Barre de drag visuelle */}
            <div className="mx-auto w-12 h-1.5 rounded-full bg-muted mb-6" />
            
            <Drawer.Title className="text-xl font-bold mb-2 flex items-center gap-2">
              <Car className="text-green-600" /> Planifier un trajet interurbain
            </Drawer.Title>
            <Drawer.Description className="text-sm text-muted-foreground mb-6">
              Sélectionnez vos régions de départ et de destination au Sénégal.
            </Drawer.Description>

            <div className="space-y-6">
              {/* Point de départ */}
              <div className="space-y-2 relative">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-4 w-4 text-green-600" /> Région de Pickup
                </Label>
                <RegionSelector 
                  value={departRegion} 
                  onChange={setDepartRegion} 
                  placeholder="Ex: Dakar, Thiès..." 
                />
              </div>

              {/* Point d'arrivée */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-4 w-4 text-red-500" /> Région de Destination
                </Label>
                <RegionSelector 
                  value={arriveeRegion} 
                  onChange={setArriveeRegion} 
                  placeholder="Ex: Ziguinchor, Saint-Louis..." 
                />
              </div>

              {/* Option Autoroute à Péage */}
              <div className="flex items-center justify-between p-4 bg-muted/40 rounded-xl border">
                <div className="space-y-0.5">
                  <Label htmlFor="peage-switch" className="text-sm font-medium pointer-events-none">
                    Prendre l'Autoroute à péage
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Ila Touba / Autoroute de l'Avenir (+3 000 FCFA)
                  </p>
                </div>
                <Switch
                  id="peage-switch"
                  checked={includePeage}
                  onCheckedChange={setIncludePeage}
                />
              </div>

              {/* Box d'affichage du prix estimé */}
              {departRegion && arriveeRegion && (
                <div className="p-5 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-xl space-y-2 transition-all">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Wallet className="h-4 w-4" /> Prix estimé du trajet :
                    </span>
                    {loading ? (
                      <span className="text-xs text-muted-foreground animate-pulse">Calcul du tarif...</span>
                    ) : (
                      <span className="text-2xl font-black text-green-700 dark:text-green-400">
                        {estimatedPrice?.toLocaleString("fr-FR")} XOF
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground italic text-center pt-2 border-t border-dashed border-green-200 dark:border-green-900">
                    Tarif indicatif basé sur ~25 FCFA / km hors taxes urbaines locales.
                  </p>
                </div>
              )}
            </div>

            {/* Bouton de confirmation final */}
            <div className="mt-8">
              <Button 
                className="w-full py-6 font-bold text-base rounded-xl"
                disabled={!departRegion || !arriveeRegion || loading}
              >
                Confirm et chercher un chauffeur
              </Button>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
