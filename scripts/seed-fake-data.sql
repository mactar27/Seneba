-- Insert 1 Client
SET @client_user_id = UUID();
INSERT INTO users (id, email, password_hash, role) VALUES 
(@client_user_id, 'client@seneba.com', '$2a$10$wYQ/zW9Qe.h.N308k.n2zO2x6p5D.2hP20lA4f.sH/3o59/0H/2T6', 'client');

INSERT INTO clients (id, user_id, full_name, phone) VALUES 
(UUID(), @client_user_id, 'Test Client', '+2207700000');

-- Insert 5 Drivers
-- Driver 1
SET @d1_uid = UUID();
INSERT INTO users (id, email, password_hash, role) VALUES (@d1_uid, 'driver1@seneba.com', '$2a$10$wYQ/zW9Qe.h.N308k.n2zO2x6p5D.2hP20lA4f.sH/3o59/0H/2T6', 'driver');
INSERT INTO drivers (id, user_id, full_name, phone, is_available, is_verified, current_latitude, current_longitude) 
VALUES (UUID(), @d1_uid, 'Modou Fall', '+2207711111', TRUE, TRUE, 13.4570, -16.5780);

-- Driver 2
SET @d2_uid = UUID();
INSERT INTO users (id, email, password_hash, role) VALUES (@d2_uid, 'driver2@seneba.com', '$2a$10$wYQ/zW9Qe.h.N308k.n2zO2x6p5D.2hP20lA4f.sH/3o59/0H/2T6', 'driver');
INSERT INTO drivers (id, user_id, full_name, phone, is_available, is_verified, current_latitude, current_longitude) 
VALUES (UUID(), @d2_uid, 'Ibrahima Ndiaye', '+2207722222', TRUE, TRUE, 13.4550, -16.5750);

-- Driver 3
SET @d3_uid = UUID();
INSERT INTO users (id, email, password_hash, role) VALUES (@d3_uid, 'driver3@seneba.com', '$2a$10$wYQ/zW9Qe.h.N308k.n2zO2x6p5D.2hP20lA4f.sH/3o59/0H/2T6', 'driver');
INSERT INTO drivers (id, user_id, full_name, phone, is_available, is_verified, current_latitude, current_longitude) 
VALUES (UUID(), @d3_uid, 'Moussa Diop', '+2207733333', TRUE, TRUE, 13.4580, -16.5790);

-- Driver 4
SET @d4_uid = UUID();
INSERT INTO users (id, email, password_hash, role) VALUES (@d4_uid, 'driver4@seneba.com', '$2a$10$wYQ/zW9Qe.h.N308k.n2zO2x6p5D.2hP20lA4f.sH/3o59/0H/2T6', 'driver');
INSERT INTO drivers (id, user_id, full_name, phone, is_available, is_verified, current_latitude, current_longitude) 
VALUES (UUID(), @d4_uid, 'Ousmane Sow', '+2207744444', TRUE, TRUE, 13.4540, -16.5800);

-- Driver 5
SET @d5_uid = UUID();
INSERT INTO users (id, email, password_hash, role) VALUES (@d5_uid, 'driver5@seneba.com', '$2a$10$wYQ/zW9Qe.h.N308k.n2zO2x6p5D.2hP20lA4f.sH/3o59/0H/2T6', 'driver');
INSERT INTO drivers (id, user_id, full_name, phone, is_available, is_verified, current_latitude, current_longitude) 
VALUES (UUID(), @d5_uid, 'Amadou Ba', '+2207755555', TRUE, TRUE, 13.4590, -16.5730);
