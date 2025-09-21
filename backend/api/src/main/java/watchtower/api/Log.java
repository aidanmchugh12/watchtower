package watchtower.api;

import java.util.ArrayList;
import java.util.List;

public class Log {
    private static final List<String> logs = new ArrayList<>();

    public static synchronized void log(String s) {
        logs.add(s);
    }

    public static synchronized List<String> getLogs() {
        return new ArrayList<>(logs);
    }
}
