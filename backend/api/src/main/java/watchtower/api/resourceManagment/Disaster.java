package watchtower.api.resourceManagment;

import watchtower.api.Log;

import java.util.ArrayList;

public class Disaster extends Location {
    private String type;
    private int severity;
    private int ticksLeft;

    public Disaster(double lat, double lon, String type, int id, int severity, int duration) {
        super.lat = lat;
        super.lon = lon;
        super.id = type + String.format("%07d", id);
        super.units = new ArrayList<Unit>();
        this.type = type;
        this.severity = severity;
        this.ticksLeft = duration;
    }

    public boolean tickAndCheckIfOver() {
        ticksLeft--;
        if (ticksLeft > 0 && ticksLeft % 10 == 0) {
            if (units.size() > severity * 5 && severity > 0) {
                decreaseSeverityLevel();
            } else if (units.size() == 0 && severity < 5) {
                increaseSeverityLevel();
            }
        }
        return ticksLeft <= 0;
    }

    public int increaseSeverityLevel() {
        severity++;
        Log.log("notice: disaster " + id + " has increased to severity level " + severity);
        return severity;
    }

    public int decreaseSeverityLevel() {
        severity--;
        Log.log("notice: disaster " + id + " has decreased to severity level " + severity);
        if (severity == 0) {
            // the disaster will go away soon
            ticksLeft = 5;
        }
        return severity;
    }

    public int getSeverityLevel() {
        return severity;
    }

    public String getType() {
        return type;
    }

}
