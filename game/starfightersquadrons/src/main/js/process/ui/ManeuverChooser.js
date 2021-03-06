define(["Bearing", "Maneuver"], function(Bearing, Maneuver)
{
    "use strict";
    var ManeuverChooser = React.createClass(
    {
        propTypes:
        {
            imageBase: React.PropTypes.string.isRequired,
            token: React.PropTypes.object.isRequired,

            callback: React.PropTypes.func,
            // default: true
            isPilotNameShown: React.PropTypes.bool,
        },

        getInitialState: function()
        {
            return (
            {
                element: undefined,
                maneuver: undefined
            });
        },

        render: function()
        {
            var token = this.props.token;
            var isPilotNameShown = (this.props.isPilotNameShown === undefined ? true : this.props.isPilotNameShown);
            var pilotName = token.pilotName();
            var shipName = token.shipName();
            var maneuverKeys = token.maneuverKeys();
            var minSpeed = this.getMinimumSpeed(maneuverKeys);
            var maxSpeed = this.getMaximumSpeed(maneuverKeys);
            var bearingValues = Bearing.values();
            var bearingKeys = maneuverKeys.map(function(maneuverKey)
            {
                return Maneuver.properties[maneuverKey].bearingKey;
            });
            var self = this;

            var myHtml = [];
            var cell;

            if (isPilotNameShown && pilotName)
            {
                cell = React.DOM.td(
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
                cell = React.DOM.td(
                {
                    colSpan: bearingValues.length + 1
                }, shipName);
                myHtml.push(React.DOM.tr(
                {
                    key: myHtml.length,
                    id: "shipName"
                }, cell));
            }

            var maneuverKey, difficulty, iconSrc, image;

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
                    maneuverKey = Maneuver.STATIONARY_0_HARD;
                    difficulty = Maneuver.properties[maneuverKey].difficultyKey;
                    iconSrc = this.createManeuverIconSource(undefined, difficulty);
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
                    image = React.DOM.img(
                    {
                        src: iconSrc
                    });
                    cells.push(React.DOM.td(
                    {
                        key: cells.length,
                        className: "maneuverCell",
                        onClick: self.selectionChanged,
                        "data-token": token,
                        "data-maneuver": maneuverKey
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

                        if (bearingKeys.vizziniContains(bearing))
                        {
                            maneuverKey = this.findManeuver(maneuverKeys, bearing, speed);

                            if (maneuverKey)
                            {
                                var maneuver = Maneuver.properties[maneuverKey];

                                if (maneuver.energy !== undefined)
                                {
                                    iconSrc = this.createManeuverEnergyIconSource(bearing, maneuver.energy);
                                }
                                else
                                {
                                    difficulty = maneuver.difficultyKey;
                                    iconSrc = this.createManeuverIconSource(bearing, difficulty);
                                }

                                image = React.DOM.img(
                                {
                                    src: iconSrc
                                });
                                cells.push(React.DOM.td(
                                {
                                    key: cells.length,
                                    className: "maneuverCell",
                                    onClick: self.selectionChanged,
                                    "data-token": token,
                                    "data-maneuver": maneuverKey
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
            }, React.DOM.tbody(
            {}, myHtml));
        },

        findManeuver: function(maneuverKeys, bearingKey, speed)
        {
            var answer;

            for (var i = 0; i < maneuverKeys.length; i++)
            {
                var maneuverKey = maneuverKeys[i];
                var maneuver = Maneuver.properties[maneuverKey];

                if (maneuver.bearingKey === bearingKey && maneuver.speed === speed)
                {
                    answer = maneuverKey;
                    break;
                }
            }

            return answer;
        },

        getMaximumSpeed: function(maneuverKeys)
        {
            var answer = -10000;

            for (var i = 0; i < maneuverKeys.length; i++)
            {
                var maneuverKey = maneuverKeys[i];
                var speed = Maneuver.properties[maneuverKey].speed;
                answer = Math.max(speed, answer);
            }

            return answer;
        },

        getMinimumSpeed: function(maneuverKeys)
        {
            var answer = 10000;

            for (var i = 0; i < maneuverKeys.length; i++)
            {
                var maneuverKey = maneuverKeys[i];
                var speed = Maneuver.properties[maneuverKey].speed;
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
                answer = this.props.imageBase + "maneuver/" + bearingName + "_" + difficulty + "16.png";
            }
            else
            {
                answer = this.props.imageBase + "maneuver/stationary_" + difficulty + "16.png";
            }

            return answer;
        },

        createManeuverEnergyIconSource: function(bearing, energy)
        {
            var bearingName = bearing.replace(/B/g, "_b");
            bearingName = bearingName.replace(/L/g, "_l");
            bearingName = bearingName.replace(/R/g, "_r");
            bearingName = bearingName.replace("straight", "huge_straight");

            return this.props.imageBase + "maneuver/" + bearingName + "_" + energy + ".png";
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
