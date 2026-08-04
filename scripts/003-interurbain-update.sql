-- Mise à jour pour le support Interurbain au Sénégal

-- 1. Table des Régions / Villes clés du Sénégal
CREATE TABLE IF NOT EXISTS regions_senegal (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom_region VARCHAR(50) NOT NULL,
    chef_lieu VARCHAR(50) NOT NULL
);

-- 2. Mise à jour de la table drivers
ALTER TABLE drivers
ADD COLUMN service_area ENUM('urbain', 'interurbain', 'les_deux') DEFAULT 'urbain',
ADD COLUMN vehicle_type ENUM('berline', '7_places', 'suv', 'van') DEFAULT 'berline';

-- 3. Mise à jour de la table rides
ALTER TABLE rides
ADD COLUMN region_depart_id INT NULL,
ADD COLUMN region_arrivee_id INT NULL,
ADD COLUMN inclut_peage BOOLEAN DEFAULT FALSE,
ADD COLUMN tarif_estime DECIMAL(10, 2) NULL COMMENT 'En Francs CFA (XOF)',
ADD FOREIGN KEY (region_depart_id) REFERENCES regions_senegal(id),
ADD FOREIGN KEY (region_arrivee_id) REFERENCES regions_senegal(id);

-- Modification de la colonne base_fare et autres si on passe en XOF au lieu d'Euros/Dollars
ALTER TABLE rides MODIFY base_fare DECIMAL(10, 2) DEFAULT 1000.00;
