package watchtower.api.resourceManagment;

import java.util.ArrayList;

public class Station extends Location {
    private String type;

    public Station(double lat, double lon, String type) {
        this.lat = lat;
        this.lon = lon;
        this.type = type;
    }

    public String getType() {
        return type;
    }
    
}
