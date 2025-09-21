package watchtower.api;

import java.util.Arrays;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import watchtower.api.resourceManagment.Disaster;
import watchtower.api.resourceManagment.Scene;
import watchtower.api.resourceManagment.Station;
import watchtower.api.resourceManagment.Unit;

@RestController
public class Controller {
    Scene s;

    private static class AlgorithmicAllocation {
        List<Unit> units;
        Disaster dest;
    }

    private static class StationAllocation {
        String stationId;
        int num;
        Disaster dest;
    }

    private static class UnitAllocation {
        String unitId;
        Disaster dest;
    }

    @GetMapping("/api/hello")
    public String hello() {
        return "Hello from Watchtower!";
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

    @PostMapping("/api/algorithmAllocation")
    public String algorithmAllocation(@RequestBody AlgorithmicAllocation entity) {
        s.allocateFromAlgorithm(entity.units, entity.dest);
        return "Successfully allocated " + Integer.toString(entity.units.size()) + " units to disaster "
                + entity.dest.getId();
    }

    @PostMapping("/api/stationAllocation")
    public String stationAllocation(@RequestBody StationAllocation entity) {
        s.allocateFromStation(entity.stationId, entity.num, entity.dest);
        return "Successfully allocated " + Integer.toString(entity.num) + " units from station " + entity.stationId
                + " to disaster "
                + entity.dest.getId();
    }

    @PostMapping("/api/unitAllocation")
    public String unitAllocation(@RequestBody UnitAllocation entity) {
        s.allocateFromMoving(entity.unitId, entity.dest);
        return "Successfully allocated unit " + entity.unitId + " to disaster "
                + entity.dest.getId();
    }

}
