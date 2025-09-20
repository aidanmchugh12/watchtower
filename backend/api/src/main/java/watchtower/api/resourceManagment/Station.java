package watchtower.api.resourceManagment;

import java.util.ArrayList;

public class Station extends Location {
    private String type;

    public Station(double lat, double lon, String type, int id) {
        super.lat = lat;
        super.lon = lon;
        super.id = type + String.format("%07d", id);
        this.type = type;
    }

    public String getType() {
        return type;
    }
    
}
