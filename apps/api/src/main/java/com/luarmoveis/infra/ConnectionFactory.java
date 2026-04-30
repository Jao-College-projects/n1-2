package com.luarmoveis.infra;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * JDBC factory. Configure via variáveis de ambiente (Tomcat / Docker / IDE):
 * JDBC_URL, JDBC_USER, JDBC_PASSWORD
 * <p>
 * Os valores são lidos a cada conexão para respeitar o ambiente do container (Tomcat + Docker).
 */
public final class ConnectionFactory {

    static {
        try {
            Class.forName("org.postgresql.Driver");
        } catch (ClassNotFoundException e) {
            throw new ExceptionInInitializerError(e);
        }
    }

    private ConnectionFactory() {
    }

    private static String firstNonBlank(String a, String b, String c) {
        if (a != null && !a.isBlank()) return a;
        if (b != null && !b.isBlank()) return b;
        return c;
    }

    public static Connection getConnection() throws SQLException {
        String url = firstNonBlank(
                System.getenv("JDBC_URL"),
                System.getProperty("jdbc.url"),
                "jdbc:postgresql://localhost:5434/luar_java"
        );
        String user = firstNonBlank(
                System.getenv("JDBC_USER"),
                System.getProperty("jdbc.user"),
                "postgres"
        );
        String password = firstNonBlank(
                System.getenv("JDBC_PASSWORD"),
                System.getProperty("jdbc.password"),
                "postgres"
        );
        return DriverManager.getConnection(url, user, password);
    }
}
