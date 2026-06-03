package com.soufo.api.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.sql.DataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseInitializer.class);
    private final DataSource dataSource;

    public DatabaseInitializer(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void run(String... args) throws Exception {
        try {
            executeTriggers();
            logger.info("Database triggers initialized successfully");
        } catch (Exception e) {
            logger.warn("Could not execute triggers on startup (this is non-critical): {}", e.getMessage());
        }
    }

    private void executeTriggers() throws Exception {
        String triggersScript = readTriggersFile();
        if (triggersScript == null || triggersScript.trim().isEmpty()) {
            logger.info("No triggers found to execute");
            return;
        }

        String normalized = triggersScript
                .replaceAll("(?m)^DELIMITER .*?$", "")
                .replaceAll("(?m)^--.*?$", "")
                .trim();

        String[] statements = normalized.split("(?m)\\s*//\\s*(\\r?\\n|$)");

        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement()) {

            for (String sql : statements) {
                String trimmed = sql.trim();
                if (trimmed.isEmpty()) {
                    continue;
                }

                String triggerName = extractTriggerName(trimmed);
                String triggerTable = extractTriggerTable(trimmed);

                if (triggerName != null && triggerExists(conn, triggerName)) {
                    logger.debug("Skipping existing trigger: {}", triggerName);
                    continue;
                }

                if (trimmed.contains("SET NEW.updated_at") && triggerTable != null && !tableHasColumn(conn, triggerTable, "updated_at")) {
                    logger.debug("Skipping trigger for missing updated_at column on table {}", triggerTable);
                    continue;
                }

                try {
                    stmt.execute(trimmed);
                    logger.debug("Executed trigger: {}", trimmed.substring(0, Math.min(50, trimmed.length())));
                } catch (Exception e) {
                    logger.debug("Trigger execution note: {}", e.getMessage());
                }
            }
        }
    }

    private boolean triggerExists(Connection conn, String triggerName) {
        String schema = null;
        try {
            schema = conn.getCatalog();
            String sql = "SELECT TRIGGER_NAME FROM information_schema.TRIGGERS WHERE TRIGGER_SCHEMA = ? AND TRIGGER_NAME = ?";
            try (PreparedStatement ps = conn.prepareStatement(sql)) {
                ps.setString(1, schema);
                ps.setString(2, triggerName);
                try (ResultSet rs = ps.executeQuery()) {
                    return rs.next();
                }
            }
        } catch (Exception e) {
            logger.debug("Trigger existence check failed for {}: {}", triggerName, e.getMessage());
            return false;
        }
    }

    private boolean tableHasColumn(Connection conn, String tableName, String columnName) {
        try (ResultSet rs = conn.getMetaData().getColumns(conn.getCatalog(), null, tableName, columnName)) {
            return rs.next();
        } catch (Exception e) {
            logger.debug("Column existence check failed for {}.{}: {}", tableName, columnName, e.getMessage());
            return false;
        }
    }

    private String extractTriggerName(String sql) {
        Pattern pattern = Pattern.compile("(?i)CREATE\\s+TRIGGER\\s+([`\\w]+)");
        Matcher matcher = pattern.matcher(sql);
        if (matcher.find()) {
            return matcher.group(1).replace("`", "");
        }
        return null;
    }

    private String extractTriggerTable(String sql) {
        Pattern pattern = Pattern.compile("(?i)ON\\s+([`\\w]+)");
        Matcher matcher = pattern.matcher(sql);
        if (matcher.find()) {
            return matcher.group(1).replace("`", "");
        }
        return null;
    }

    private String readTriggersFile() throws IOException {
        try {
            ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
            String content = new String(classLoader.getResourceAsStream("triggers.sql").readAllBytes());
            return content;
        } catch (Exception e) {
            logger.warn("Could not read triggers.sql file: {}", e.getMessage());
            return null;
        }
    }
}
