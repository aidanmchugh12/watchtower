package watchtower.api;

import java.util.List;

import watchtower.api.resourceManagment.Unit;

public class ApiClasses {
    public static class DisasterBody {
        double lat;
        double lon;
        String type;
        int severity;
        int duration;

        public DisasterBody(double lat, double lon, String type, int severity, int duration) {
            this.lat = lat;
            this.lon = lon;
            this.type = type;
            this.severity = severity;
            this.duration = duration;
        }
    }

    public static class AlgorithmicAllocation {
        List<Unit> units;
        String destId;

        public AlgorithmicAllocation(List<Unit> units, String destId) {
            this.units = units;
            this.destId = destId;
        }
    }

    public static class StationAllocation {
        String stationId;
        int num;
        String destId;

        public StationAllocation(String stationId, int num, String destId) {
            this.stationId = stationId;
            this.num = num;
            this.destId = destId;
        }
    }

    public static class UnitAllocation {
        String unitId;
        String destId;

        public UnitAllocation(String unitId, String destId) {
            this.unitId = unitId;
            this.destId = destId;
        }
    }

    public static class ResourceSummary {
        public int fireTrucksAvailable;
        public int policeCarsAvailable;
        public int ambulancesAvailable;
        public int fireTrucksEnRoute;
        public int policeCarsEnRoute;
        public int ambulancesEnRoute;
        public int fireTrucksAtScene;
        public int policeCarsAtScene;
        public int ambulancesAtScene;

        public ResourceSummary() {
            fireTrucksAvailable = 0;
            policeCarsAvailable = 0;
            ambulancesAvailable = 0;
            fireTrucksEnRoute = 0;
            policeCarsEnRoute = 0;
            ambulancesEnRoute = 0;
            fireTrucksAtScene = 0;
            policeCarsAtScene = 0;
            ambulancesAtScene = 0;
        }
    }
}
