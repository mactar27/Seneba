ALTER TABLE rides ADD COLUMN payment_method ENUM('cash', 'wave', 'orange_money') DEFAULT 'cash';
