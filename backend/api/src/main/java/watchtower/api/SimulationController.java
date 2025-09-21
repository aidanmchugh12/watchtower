package watchtower.api;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import watchtower.api.resourceManagment.Scene;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/simulation")
public class SimulationController {

    private final SimulationService simulationService;

    public SimulationController(SimulationService simulationService) {
        this.simulationService = simulationService;
    }

    private SseEmitter emitter;


    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @CrossOrigin(origins = "http://localhost:5173")
    public SseEmitter streamSimulation() {
        emitter = new SseEmitter(Long.MAX_VALUE);

        new Thread(() -> {
            try {
                while (!Thread.currentThread().isInterrupted() && simulationService.isRunning()) {
                    emitter.send(Scene.getInstance());
                    Thread.sleep(1000);
                }
                emitter.complete();
            } catch (IOException | InterruptedException e) {
                emitter.completeWithError(e);
            }
        }).start();

        return emitter;
    }

    /** Start the simulation */
    @PostMapping("/start")
    public String startSimulation() {
        simulationService.startSimulation();
        return "Simulation started!";
    }

    /** Stop the simulation */
    @PostMapping("/stop")
    public String stopSimulation() {
        simulationService.stopSimulation();
        return "Simulation stopped!";
    }

    /** Reset tick counter */
    @PostMapping("/reset")
    public String resetSimulation() {
        simulationService.resetTickCount();
        return "Tick count reset!";
    }
}
