package com.soufo.api.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.Statement;
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
                try {
                    stmt.execute(trimmed);
                    logger.debug("Executed trigger: {}", trimmed.substring(0, Math.min(50, trimmed.length())));
                } catch (Exception e) {
                    logger.debug("Trigger execution note: {}", e.getMessage());
                }
            }
        }
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
