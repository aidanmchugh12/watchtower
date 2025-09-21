package watchtower.api;

import java.util.Arrays;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import watchtower.api.resourceManagment.Disaster;
import watchtower.api.resourceManagment.Scene;
import watchtower.api.resourceManagment.Station;
import watchtower.api.resourceManagment.Unit;

import watchtower.api.ApiClasses.*;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
public class Controller {
    Scene s;
    private int disasterCounter = 1;

    @GetMapping("/api/hello")
    public String hello() {
        return "Hello from Watchtower!";
    }

    @GetMapping("/api/scene")
    public String scene() {
        return s.toString();
    }

    @GetMapping("/api/log")
    @CrossOrigin(origins = "http://localhost:5173")
    public String log() {
        String str = "[";
        for (String l : Log.getLogs()) {
            str += "\"" + l + "\",";
        }
        if (str.length() <= 2) {
            return "[]";
        }
        str = str.substring(0, str.length() - 1) + "]";
        return str;
    }

    @GetMapping("/api/resources")
    @CrossOrigin(origins = "http://localhost:5173")
    public ResourceSummary resources() {
        ResourceSummary summary = new ResourceSummary();

        for (Station station : s.getAllStations()) {
            summary.fireTrucksAvailable += station.countUnits("f");
            summary.policeCarsAvailable += station.countUnits("p");
            summary.ambulancesAvailable += station.countUnits("a");
        }

        for (Unit u : s.getMovingUnits()) {
            switch (u.getType()) {
                case "f":
                    summary.fireTrucksEnRoute++;
                    break;
                case "p":
                    summary.policeCarsEnRoute++;
                    break;
                case "a":
                    summary.ambulancesEnRoute++;
                    break;
            }
        }

        for (Disaster disaster : s.getDisasters()) {
            summary.fireTrucksAtScene += disaster.countUnits("f");
            summary.policeCarsAtScene += disaster.countUnits("p");
            summary.ambulancesAtScene += disaster.countUnits("a");
        }

        return summary;
    }

    @PostMapping("/api/initializeScene")
    public String initializeScene(@RequestBody Station[] entity) {
        // turn it into a list to pass to the constructor
        List<Station> stations = Arrays.asList(entity);

        // count the units to validate for output
        int totalUnits = 0;
        for (Station s : stations) {
            totalUnits += s.capacity;
        }

        // construct the scene
        s = new Scene(stations);

        // return
        return "Successfully initialized scene with " + Integer.toString(stations.size()) + " stations with "
                + Integer.toString(totalUnits) + " total units of capacity.";
    }

    @PostMapping("/api/disaster")
    public String disaster(@RequestBody DisasterBody entity) {
        Disaster d = new Disaster(entity.lat, entity.lon, entity.type, disasterCounter, entity.severity,
                entity.duration);

        s.addDisaster(d);

        return "Successfully added disaster " + entity.type + " at severity " + Integer.toString(entity.severity);
    }

    @PostMapping("/api/algorithmAllocation")
    public String algorithmAllocation(@RequestBody AlgorithmicAllocation entity) {
        Disaster dest = s.getDisaster(entity.destId);
        s.allocateFromAlgorithm(entity.units, dest);
        return "Successfully allocated " + Integer.toString(entity.units.size()) + " units to disaster "
                + dest.getId();
    }

    @PostMapping("/api/stationAllocation")
    public String stationAllocation(@RequestBody StationAllocation entity) {
        Disaster dest = s.getDisaster(entity.destId);
        s.allocateFromStation(entity.stationId, entity.num, dest);
        return "Successfully allocated " + Integer.toString(entity.num) + " units from station " + entity.stationId
                + " to disaster "
                + dest.getId();
    }

    @PostMapping("/api/unitAllocation")
    public String unitAllocation(@RequestBody UnitAllocation entity) {
        Disaster dest = s.getDisaster(entity.destId);
        s.allocateFromMoving(entity.unitId, dest);
        return "Successfully allocated unit " + entity.unitId + " to disaster "
                + dest.getId();
    }
}