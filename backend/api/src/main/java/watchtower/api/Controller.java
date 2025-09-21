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
        List<Station> stations = Arrays.asList(entity);

        s = new Scene(stations);

        return "yippee\n" + entity[0].id;
    }

}
