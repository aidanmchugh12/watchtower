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

    private final SimulationService simulationService = new SimulationService();

    @GetMapping("/api/hello")
    public String hello() {
        return "Hello from Watchtower!";
    }

    @PostMapping("/api/initializeScene")
    public String initializeScene(@RequestBody Station[] entity) {
        List<Station> stations = Arrays.asList(entity);

        s = new Scene(stations);

        return "yippee\n" + entity[0].id;
    }

    /* SIMULATION CONTROLLER ENDPOINTS */

    @PostMapping("/api/simulation/start")
    public String startSimulation() {
        simulationService.startSimulation();
        return "Simulation started!";
    }

    @PostMapping("/api/simulation/stop")
    public String stopSimulation() {
        simulationService.stopSimulation();
        return "Simulation stopped!";
    }

    @GetMapping("/api/simulation/status") 
    public String getSimulationStatus() {
        return simulationService.isRunning() + " " + simulationService.getTickCount();
    }

    @PostMapping("/api/simulation/reset") 
    public String resetSimulationService() {
        simulationService.resetTickCount();
        return "Ticket count reset!";
    }
    
}
