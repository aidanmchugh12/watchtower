package watchtower.api.resourceManagment;

import java.util.ArrayList;

public class Disaster extends Location {
    private String type;
    private int severity;

    public Disaster(double lat, double lon, String type, int id, int severity) {
        super.lat = lat;
        super.lon = lon;
        super.id = type + String.format("%07d", id);
        this.type = type;
        this.severity = severity;
    }

    public int increaseSeverityLevel() {
        severity++;
        return severity;
    }

    public int decreaseSeverityLevel() {
        severity--;
        if (severity == 0) {
            // maybe get rid of the disaster?
        }
        return severity;
    }

    public int getSeverityLevel() {
        return severity;
    }

}
