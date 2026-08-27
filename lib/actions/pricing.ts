"use server";

export interface PricingOptions {
  distanceKm: number;
  isIntercity: boolean;
  inclutPeage?: boolean;
}

export interface PricingResult {
  tarifEstimeXOF: number;
  details: {
    baseFare: number;
    distanceFare: number;
    tollFare: number;
  };
}

const URBAIN_BASE_FARE = 1000;
const URBAIN_PRICE_PER_KM = 100;

const INTERURBAIN_BASE_FARE = 2000;
const INTERURBAIN_PRICE_PER_KM = 25; // Tarif moins élevé au km pour les longs trajets
const PEAGE_FLAT_FEE = 3000;

export async function calculateTripPrice(options: PricingOptions): Promise<PricingResult> {
  const { distanceKm, isIntercity, inclutPeage } = options;

  let baseFare = URBAIN_BASE_FARE;
  let pricePerKm = URBAIN_PRICE_PER_KM;
  let tollFare = 0;

  if (isIntercity) {
    baseFare = INTERURBAIN_BASE_FARE;
    pricePerKm = INTERURBAIN_PRICE_PER_KM;
  }

  if (inclutPeage && isIntercity) {
    // Forfait péage ajouté (ex: Ila Touba ou Autoroute Avenir)
    tollFare = PEAGE_FLAT_FEE;
  }

  const distanceFare = Math.round(distanceKm * pricePerKm);
  const total = baseFare + distanceFare + tollFare;

  return {
    tarifEstimeXOF: total,
    details: {
      baseFare,
      distanceFare,
      tollFare,
    },
  };
}

// Fonction utilitaire pour la Bottom Sheet
export async function calculateInterurbanPrice(
  departRegion: string,
  arriveeRegion: string,
  inclutPeage: boolean
): Promise<number> {
  // TODO: Remplacer par un vrai calcul de distance via Google Maps API ou OSRM/Leaflet.
  // Simulation basique pour la démonstration :
  let mockDistanceKm = 150; // ex: Dakar -> Touba
  if (departRegion === "Dakar" && arriveeRegion === "Ziguinchor") mockDistanceKm = 450;
  if (departRegion === "Dakar" && arriveeRegion === "Thiès") mockDistanceKm = 70;
  if (departRegion === "Dakar" && arriveeRegion === "Saint-Louis") mockDistanceKm = 260;
  
  const result = await calculateTripPrice({
    distanceKm: mockDistanceKm,
    isIntercity: true,
    inclutPeage,
  });

  return result.tarifEstimeXOF;
}
