package watchtower.api;

import java.util.Arrays;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import watchtower.api.resourceManagment.Scene;
import watchtower.api.resourceManagment.Station;

@RestController
public class Controller {
    Scene s;

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

}
