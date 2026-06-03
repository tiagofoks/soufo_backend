-- Initial seed data for roles
INSERT IGNORE INTO roles (id, name, description) VALUES 
(1, 'ADMIN', 'Administrator with full access'),
(2, 'USER', 'Regular user'),
(3, 'ORGANIZER', 'Hackathon organizer'),
(4, 'JUDGE', 'Hackathon judge');
