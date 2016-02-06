define([ "Quaternion", "Vector", "ship/Conduit", "ship/Power", "ship/Sensor", "ship/Storage" ], function(Quaternion,
        Vector, Conduit, Power, Sensor, Storage)
{
    "use strict";
    function ObserverSatellite(name, environment)
    {
        InputValidator.validateNotNull("name", name);
        InputValidator.validateNotNull("environment", environment);

        // Power.
        var power = new Power.RTG("RTG", environment, name, Vector.ZERO, Quaternion.ZERO, 2);

        // Sensor.
        var sensor = new Sensor.Camera("Camera", environment, name, Vector.X_AXIS, Quaternion.ZERO, 1);

        var devices = [];
        devices.push(power);
        devices.push(sensor);

        var conduit = new Conduit(name, power.produceType(), power, sensor);
        power.addProduceConduit(conduit);
        sensor.addConsumeConduit(conduit);

        return new Ship(name, devices);
    }

    function ReferenceShip(name, environment)
    {
        InputValidator.validateNotNull("name", name);
        InputValidator.validateNotNull("environment", environment);

        var length = 0.040; // 40 m
        var width = 0.030; // 30 m
        var height = 0.010; // 10 m

        var forward = Vector.X_AXIS.multiply(length / 2.0);
        var aft = Vector.X_AXIS.multiply(-length / 2.0);
        var port = Vector.Y_AXIS.multiply(width / 2.0);
        var starboard = Vector.Y_AXIS.multiply(-width / 2.0);
        var dorsal = Vector.Z_AXIS.multiply(height / 2.0);
        var ventral = Vector.Z_AXIS.multiply(-height / 2.0);

        var forwardQ = Quaternion.ZERO;
        var aftQ = Quaternion.newInstance(180.0, Vector.Z_AXIS);
        var portQ = Quaternion.newInstance(90.0, Vector.Z_AXIS);
        var starboardQ = Quaternion.newInstance(-90.0, Vector.Z_AXIS);
        var dorsalQ = Quaternion.newInstance(90.0, Vector.X_AXIS);
        var ventralQ = Quaternion.newInstance(-90.0, Vector.X_AXIS);

        // Fuel.
        var storage = new Storage.FuelTank("1", environment, name, Vector.X_AXIS.multiply(-length / 4.0),
                Quaternion.ZERO, 10000);

        // Power.
        var power = new Power.FusionReactor("1", environment, name, Vector.ZERO, Quaternion.ZERO, 1, 200);

        // Sensors.
        var forwardSensor = new Sensor.Camera("ForwardCamera", environment, name, forward, forwardQ, 1);
        var aftSensor = new Sensor.Camera("AftCamera", environment, name, aft, aftQ, 1);
        var portSensor = new Sensor.Camera("PortCamera", environment, name, port, portQ, 1);
        var starboardSensor = new Sensor.Camera("StarboardCamera", environment, name, starboard, starboardQ, 1);
        var dorsalSensor = new Sensor.Camera("DorsalCamera", environment, name, dorsal, dorsalQ, 1);
        var ventralSensor = new Sensor.Camera("VentralCamera", environment, name, ventral, ventralQ, 1);

        var devices = [];
        devices.push(storage);
        devices.push(power);
        devices.push(forwardSensor);
        devices.push(aftSensor);
        devices.push(portSensor);
        devices.push(starboardSensor);
        devices.push(dorsalSensor);
        devices.push(ventralSensor);

        // Storage to power.
        connect("1", storage, power);

        // Power to sensors.
        connect("2", power, forwardSensor);
        connect("3", power, aftSensor);
        connect("4", power, portSensor);
        connect("5", power, starboardSensor);
        connect("6", power, dorsalSensor);
        connect("7", power, ventralSensor);

        return new Ship(name, devices);

        function connect(name, producer, consumer)
        {
            var conduit = new Conduit(name, producer.produceType(), producer, consumer);
            producer.addProduceConduit(conduit);
            consumer.addConsumeConduit(conduit);
        }
    }

    function Ship(name, devices)
    {
        InputValidator.validateNotNull("name", name);
        InputValidator.validateNotNull("devices", devices);

        this.name = function()
        {
            return name;
        };

        this.device = function(deviceKey)
        {
            InputValidator.validateNotNull("deviceKey", deviceKey);

            var answer;

            for (var i = 0; i < devices.length; i++)
            {
                var device = devices[i];

                if (device.name() === deviceKey)
                {
                    answer = device;
                    break;
                }
            }
            return answer;
        };

        this.devices = function()
        {
            return devices.slice();
        };
    }

    Ship.prototype.mass = function()
    {
        var answer = 1.0e+03;

        // FIXME: add up the mass of all the devices

        return answer;
    };

    Ship.prototype.tick = function()
    {
        this.devices().forEach(function(device)
        {
            device.tick();
        });
    };

    return (
    {
        ObserverSatellite: ObserverSatellite,
        ReferenceShip: ReferenceShip,
        Ship: Ship
    });
});