-- =============================================================
-- MIGRATION 004 (TiDB compatible) : Index spatial géolocalisation chauffeurs
-- TiDB supporte ST_Distance_Sphere et les index sur colonnes normales,
-- mais les colonnes générées de type POINT ont des contraintes.
-- On utilise ici une approche compatible : index composé + ST_Distance_Sphere
-- =============================================================

-- Étape 1 : S'assurer que les index de base existent déjà
-- (ils sont dans mysql-schema.sql, on les recrée en IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_drivers_available ON drivers(is_available);
CREATE INDEX IF NOT EXISTS idx_drivers_lat_lng ON drivers(current_latitude, current_longitude);

-- Étape 2 : Index composé pour filtrer rapidement
-- is_available + lat/lng → MySQL/TiDB peut utiliser les deux colonnes
-- pour une bounding box sans parcourir toute la table
CREATE INDEX IF NOT EXISTS idx_drivers_available_location
  ON drivers(is_available, current_latitude, current_longitude);

-- Vérification : afficher les index créés sur la table drivers
SHOW INDEX FROM drivers;
