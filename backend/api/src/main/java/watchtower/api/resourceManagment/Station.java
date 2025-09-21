package watchtower.api.resourceManagment;

import java.util.ArrayList;

public class Station extends Location {
    private String type;
    public final int capacity;

    public Station(double lat, double lon, String type, int capacity, int id) {
        super.lat = lat;
        super.lon = lon;
        super.id = type + String.format("%07d", id);
        super.units = new ArrayList<Unit>();
        this.capacity = capacity;
        this.type = type;
    }

    public String getType() {
        return type;
    }

}
