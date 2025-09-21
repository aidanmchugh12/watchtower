package watchtower.api;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import watchtower.api.resourceManagment.Scene;

import java.io.IOException;

@RestController
@RequestMapping("/api/simulation")
public class SimulationController {

    private final SimulationService simulationService;

    public SimulationController(SimulationService simulationService) {
        this.simulationService = simulationService;
    }

    private SseEmitter emitter;

    private int millisDefault = 100;
    private double speedFactor = 1;

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @CrossOrigin(origins = "http://localhost:5173")
    public SseEmitter streamSimulation() {
        emitter = new SseEmitter(Long.MAX_VALUE);

        new Thread(() -> {
            try {
                while (!Thread.currentThread().isInterrupted() && simulationService.isRunning()) {
                    emitter.send(Scene.getInstance());
                    Thread.sleep(Math.round(millisDefault * speedFactor));
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
    @CrossOrigin(origins = "http://localhost:5173")
    public String startSimulation() {
        simulationService.startSimulation();
        System.out.println("start");
        return "Simulation started!";
    }

    /** Stop the simulation */
    @PostMapping("/stop")
    @CrossOrigin(origins = "http://localhost:5173")
    public String stopSimulation() {
        simulationService.stopSimulation();
        System.out.println("stop");
        return "Simulation stopped!";
    }

    /** Reset tick counter */
    @PostMapping("/reset")
    public String resetSimulation() {
        simulationService.resetTickCount();
        return "Tick count reset!";
    }

    /** Update the tick speed */
    @PostMapping("/setScale")
    @CrossOrigin(origins = "http://localhost:5173")
    public String setScale(@RequestBody String entity) {
        speedFactor = Double.parseDouble(entity);
        System.out.println(speedFactor);
        return entity;
    }

}
