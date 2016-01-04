/*
 * Provides a display panel of a ship's maneuvers.
 * 
 * @param token Token.
 * @param isPilotNameShown Flag indicating whether to show the pilot name.
 * @param imageUtils Image utilities.
 * @param callback Callback function.
 */
define([ "Bearing", "Maneuver" ], function(Bearing, Maneuver)
{
    var ManeuverChooser = React.createClass(
    {
        findManeuver: function(maneuvers, bearing, speed)
        {
            var answer;

            for (var i = 0; i < maneuvers.length; i++)
            {
                var maneuver = maneuvers[i];
                var properties = Maneuver.properties[maneuver];

                if (properties.bearing === bearing && properties.speed === speed)
                {
                    answer = maneuver;
                    break;
                }
            }

            return answer;
        },

        getInitialState: function()
        {
            return (
            {
                element: undefined,
                maneuver: undefined
            });
        },

        getMaximumSpeed: function(maneuvers)
        {
            var answer = -10000;

            for (var i = 0; i < maneuvers.length; i++)
            {
                var maneuver = maneuvers[i];
                var speed = Maneuver.properties[maneuver].speed;
                answer = Math.max(speed, answer);
            }

            return answer;
        },

        getMinimumSpeed: function(maneuvers)
        {
            var answer = 10000;

            for (var i = 0; i < maneuvers.length; i++)
            {
                var maneuver = maneuvers[i];
                var speed = Maneuver.properties[maneuver].speed;
                answer = Math.min(speed, answer);
            }

            return answer;
        },

        getSelectedManeuver: function()
        {
            return this.state.maneuver;
        },

        getToken: function()
        {
            return this.props.token;
        },

        render: function()
        {
            var token = this.props.token;
            var isPilotNameShown = (this.props.isPilotNameShown === undefined ? true : this.props.isPilotNameShown);
            var imageUtils = this.props.imageUtils;
            var pilotName = token.pilotName();
            var shipName = token.shipName();
            var maneuvers = token.maneuverKeys();
            var minSpeed = this.getMinimumSpeed(maneuvers);
            var maxSpeed = this.getMaximumSpeed(maneuvers);
            var bearingValues = Bearing.values();
            var bearings = maneuvers.map(function(maneuver)
            {
                return Maneuver.properties[maneuver].bearing;
            });
            var self = this;

            var myHtml = [];

            if (isPilotNameShown && pilotName)
            {
                var cell = React.DOM.td(
                {
                    colSpan: bearingValues.length + 1
                }, pilotName);
                myHtml.push(React.DOM.tr(
                {
                    key: myHtml.length,
                    id: "pilotName"
                }, cell));
            }

            if (shipName)
            {
                var cell = React.DOM.td(
                {
                    colSpan: bearingValues.length + 1
                }, shipName);
                myHtml.push(React.DOM.tr(
                {
                    key: myHtml.length,
                    id: "shipName"
                }, cell));
            }

            for (var speed = maxSpeed; speed >= minSpeed; speed--)
            {
                var cells = [];
                cells.push(React.DOM.td(
                {
                    key: cells.length,
                    className: "maneuverCell"
                }, speed));

                if (speed === 0)
                {
                    var maneuver = Maneuver.STATIONARY_0_HARD;
                    var difficulty = Maneuver.properties[maneuver].difficulty;
                    var iconSrc = this.createManeuverIconSource(undefined, difficulty);
                    cells.push(React.DOM.td(
                    {
                        key: cells.length,
                        className: "maneuverCell"
                    }, " "));
                    cells.push(React.DOM.td(
                    {
                        key: cells.length,
                        className: "maneuverCell"
                    }, " "));
                    var image = React.DOM.img(
                    {
                        src: iconSrc
                    });
                    cells.push(React.DOM.td(
                    {
                        key: cells.length,
                        className: "maneuverCell",
                        onClick: self.selectionChanged,
                        "data-token": token,
                        "data-maneuver": maneuver
                    }, image));
                    cells.push(React.DOM.td(
                    {
                        key: cells.length,
                        className: "maneuverCell"
                    }, " "));
                    cells.push(React.DOM.td(
                    {
                        key: cells.length,
                        className: "maneuverCell"
                    }, " "));
                }
                else
                {
                    for (var i = 0; i < bearingValues.length; i++)
                    {
                        var bearing = bearingValues[i];

                        if (bearings.vizziniContains(bearing))
                        {
                            var maneuver = this.findManeuver(maneuvers, bearing, speed);

                            if (maneuver)
                            {
                                var difficulty = Maneuver.properties[maneuver].difficulty;
                                var iconSrc = this.createManeuverIconSource(bearing, difficulty);
                                var image = React.DOM.img(
                                {
                                    src: iconSrc
                                });
                                cells.push(React.DOM.td(
                                {
                                    key: cells.length,
                                    className: "maneuverCell",
                                    onClick: self.selectionChanged,
                                    "data-token": token,
                                    "data-maneuver": maneuver
                                }, image));
                            }
                            else
                            {
                                cells.push(React.DOM.td(
                                {
                                    key: cells.length,
                                    className: "maneuverCell"
                                }, " "));
                            }
                        }
                    }
                }

                myHtml.push(React.DOM.tr(
                {
                    key: myHtml.length
                }, cells));
            }

            return React.DOM.table(
            {
                className: "maneuverTable"
            }, myHtml);
        },

        /**
         * @param bearing
         *            Bearing.
         * @param difficulty
         *            Difficulty.
         * 
         * @return a new image icon.
         */
        createManeuverIconSource: function(bearing, difficulty)
        {
            var answer;

            if (bearing)
            {
                var bearingName = bearing.replace(/L/g, "_l");
                bearingName = bearingName.replace(/R/g, "_r");
                bearingName = bearingName.replace("kTurn", "koiogran_turn");
                answer = imageBase + "maneuver/" + bearingName + "_" + difficulty + "16.png";
            }
            else
            {
                answer = imageBase + "maneuver/stationary_" + difficulty + "16.png";
            }

            return answer;
        },

        selectionChanged: function(event)
        {
            var oldElement = this.state.element;

            if (oldElement)
            {
                HtmlUtilities.removeClass(oldElement, "highlight");
            }

            var element = event.currentTarget;
            var token = element.dataset.token;
            var maneuver = element.dataset.maneuver;
            LOGGER.debug("selectionChanged() maneuver = " + maneuver);
            this.setState(
            {
                element: element,
                maneuver: maneuver
            });
            HtmlUtilities.addClass(element, "highlight");

            var callback = this.props.callback;

            if (callback)
            {
                callback(token, maneuver);
            }
        },
    });

    return ManeuverChooser;
});
