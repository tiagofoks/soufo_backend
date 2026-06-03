-- Triggers for automatic updated_at timestamp updates

DELIMITER //

-- Users table updated_at trigger
CREATE TRIGGER IF NOT EXISTS users_update_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //

-- Hackathons table updated_at trigger
CREATE TRIGGER IF NOT EXISTS hackathons_update_timestamp
BEFORE UPDATE ON hackathons
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //

-- Teams table updated_at trigger
CREATE TRIGGER IF NOT EXISTS teams_update_timestamp
BEFORE UPDATE ON teams
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //

-- Projects table updated_at trigger
CREATE TRIGGER IF NOT EXISTS projects_update_timestamp
BEFORE UPDATE ON projects
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //

-- Audit log table for tracking changes
CREATE TABLE IF NOT EXISTS audit_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    operation VARCHAR(10) NOT NULL,
    entity_id BIGINT,
    old_values JSON,
    new_values JSON,
    changed_by VARCHAR(255),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_table_entity (table_name, entity_id),
    INDEX idx_changed_at (changed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci //

-- Audit trigger for users
CREATE TRIGGER IF NOT EXISTS users_audit_insert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (table_name, operation, entity_id, new_values, changed_by)
    VALUES ('users', 'INSERT', NEW.id, JSON_OBJECT('email', NEW.email, 'first_name', NEW.first_name), 'system');
END //

CREATE TRIGGER IF NOT EXISTS users_audit_update
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (table_name, operation, entity_id, old_values, new_values, changed_by)
    VALUES ('users', 'UPDATE', NEW.id, 
            JSON_OBJECT('email', OLD.email, 'first_name', OLD.first_name),
            JSON_OBJECT('email', NEW.email, 'first_name', NEW.first_name), 
            'system');
END //

CREATE TRIGGER IF NOT EXISTS users_audit_delete
AFTER DELETE ON users
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (table_name, operation, entity_id, old_values, changed_by)
    VALUES ('users', 'DELETE', OLD.id, JSON_OBJECT('email', OLD.email, 'first_name', OLD.first_name), 'system');
END //

-- Audit trigger for hackathons
CREATE TRIGGER IF NOT EXISTS hackathons_audit_insert
AFTER INSERT ON hackathons
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (table_name, operation, entity_id, new_values, changed_by)
    VALUES ('hackathons', 'INSERT', NEW.id, JSON_OBJECT('title', NEW.title, 'status', NEW.status), 'system');
END //

CREATE TRIGGER IF NOT EXISTS hackathons_audit_update
AFTER UPDATE ON hackathons
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (table_name, operation, entity_id, old_values, new_values, changed_by)
    VALUES ('hackathons', 'UPDATE', NEW.id,
            JSON_OBJECT('title', OLD.title, 'status', OLD.status),
            JSON_OBJECT('title', NEW.title, 'status', NEW.status),
            'system');
END //

DELIMITER ;
