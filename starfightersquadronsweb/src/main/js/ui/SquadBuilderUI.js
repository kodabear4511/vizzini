/*
 * Provides a user interface to build a squad.
 * 
 * @param initialTeam Initial team.
 */
define([ "Pilot", "ShipTeam", "SimpleAgent", "SquadBuilder", "Team", "Token", "UpgradeCard", "UpgradeType",
        "ui/PilotChooser", "ui/SquadUI", "ui/UpgradeChooser" ], function(Pilot, ShipTeam, SimpleAgent, SquadBuilder,
        Team, Token, UpgradeCard, UpgradeType, PilotChooser, SquadUI, UpgradeChooser)
{
    var SquadBuilderUI = React.createClass(
    {
        getInitialState: function()
        {
            LOGGER.trace("SquadBuilderUI.getInitialState()");

            var team = this.props.team;

            // Default to first ship, first pilot.
            var shipTeam = ShipTeam.valuesByTeam(team)[0];
            var pilot = Pilot.valuesByShipTeam(shipTeam)[0];
            var token = this.createToken(team, pilot);

            return (
            {
                pilot: pilot,
                token: token,
                upgrades: [],
                squad: []
            });
        },

        componentWillReceiveProps: function(nextProps)
        {
            LOGGER.trace("SquadBuilderUI.componentWillReceiveProps()");

            var oldTeam = this.props.team;
            var newTeam = nextProps.team;

            if (oldTeam != newTeam)
            {
                // Team changed.
                LOGGER.debug("oldTeam = " + oldTeam);
                LOGGER.debug("newTeam = " + newTeam);
                var shipTeam = ShipTeam.valuesByTeam(newTeam)[0];
                var pilot = Pilot.valuesByShipTeam(shipTeam)[0];
                var token = this.createToken(newTeam, pilot);
                LOGGER.debug("new state = " + pilot + ", " + token);
                this.setState(
                {
                    pilot: pilot,
                    token: token,
                    upgrades: [],
                    squad: []
                });
            }
        },

        render: function()
        {
            LOGGER.trace("SquadBuilderUI.render()");

            var team = this.props.team;
            var rows = [];

            var pilotChooser = React.createElement(PilotChooser,
            {
                team: team,
                onChangeFunction: this.pilotChanged
            });
            var cell0 = React.DOM.td(
            {
                key: 0,
                className: "pilotChooserCell",
            }, pilotChooser);
            var upgradesUI = this.createUpgradesUI();
            var cell1 = React.DOM.td(
            {
                key: 1,
                className: "upgradesUICell",
            }, upgradesUI);
            rows.push(React.DOM.tr(
            {
                key: 0,
            }, cell0, cell1));

            var addButton = React.DOM.input(
            {
                type: "button",
                value: "Add",
                onClick: this.addActionPerformed
            });
            var cell2 = React.DOM.td(
            {
                className: "squadBuilderAdd",
                colSpan: 2,
            }, addButton);
            rows.push(React.DOM.tr(
            {
                key: 2,
            }, cell2));

            var squadPanel = React.createElement(SquadUI,
            {
                squad: this.state.squad,
                removeFunction: this.removeActionPerformed,
                isEditable: true,
            });
            var cell3 = React.DOM.td(
            {
                id: "squadPanel",
                colSpan: 2,
            }, squadPanel);
            rows.push(React.DOM.tr(
            {
                key: 3,
            }, cell3));

            return React.DOM.table(
            {
                className: "squadBuilderUI"
            }, React.DOM.tbody({}, rows));
        },

        addActionPerformed: function(event)
        {
            LOGGER.trace("add clicked");
            var token = this.createToken(this.props.team, this.state.pilot);

            // Add upgrade cards.
            var myUpgrades = this.state.upgrades;
            var tokenUpgrades = token.upgradeKeys();

            myUpgrades.forEach(function(upgrade)
            {
                if (upgrade)
                {
                    tokenUpgrades.push(upgrade);
                }
            });

            var squad = this.state.squad;
            squad.push(token);
            this.setState(
            {
                squad: squad
            });

            if (this.props.onChange)
            {
                this.props.onChange(squad);
            }
        },

        createToken: function(team, pilot)
        {
            InputValidator.validateNotNull("team", team);
            InputValidator.validateNotNull("pilot", pilot);

            var agentName = Team.properties[team].name + " Agent";
            var agent = new SimpleAgent(agentName, team);

            return new Token(pilot, agent);
        },

        createUpgradesUI: function()
        {
            var pilot = this.state.pilot;
            var upgradeTypes = this.state.token.upgradeTypeKeys();

            var rows = [];

            var self = this;
            upgradeTypes.forEach(function(upgradeType, i)
            {
                var element = React.createElement(UpgradeChooser,
                {
                    pilot: pilot,
                    upgradeType: upgradeType,
                    index: i,
                    onChangeFunction: self.upgradeChanged
                });
                rows.push(React.DOM.tr(
                {
                    key: pilot + upgradeType + rows.length
                }, React.DOM.td(
                {
                    className: "squadBuilderUpgradeCell"
                }, element)));
            });

            return React.DOM.table(
            {
                className: "squadBuilderUpgradesUI"
            }, React.DOM.tbody({}, rows));
        },

        pilotChanged: function(event, pilot)
        {
            LOGGER.debug("new pilot = " + pilot);
            var team = this.props.team;
            var token = this.createToken(team, pilot);

            // Add upgrade cards.
            var myUpgrades = this.state.upgrades;
            var tokenUpgrades = token.upgradeKeys();

            myUpgrades.forEach(function(upgrade)
            {
                if (upgrade)
                {
                    tokenUpgrades.push(upgrade);
                }
            });

            this.setState(
            {
                pilot: pilot,
                token: token,
                upgrades: []
            });
        },

        removeActionPerformed: function(selected, event)
        {
            var squad = this.state.squad;
            var index = squad.indexOf(selected);

            if (index >= 0)
            {
                squad.splice(index, 1);

                this.setState(
                {
                    squad: squad
                });

                if (this.props.onChange)
                {
                    this.props.onChange(squad);
                }
            }
        },

        upgradeChanged: function(event)
        {
            var upgradeCard = event.currentTarget.value;
            LOGGER.debug("SquadBuilderUI.upgradeChanged() new upgradeCard = " + upgradeCard);
            var index = event.currentTarget.dataset.index;
            var upgrades = this.state.upgrades;

            upgrades[index] = (upgradeCard == "*none*") ? undefined : upgradeCard;
            LOGGER.debug("upgrades.length = " + upgrades.length);

            var token = this.createToken(this.props.team, this.state.pilot);

            // Add upgrade cards.
            var tokenUpgrades = token.upgradeKeys();

            upgrades.forEach(function(upgrade, i)
            {
                if (upgrade)
                {
                    var tokenUpgradeTypes = token.upgradeTypeKeys();
                    var tokenUpgradeCount = tokenUpgradeTypes.length;
                    LOGGER.debug(i + " tokenUpgradeCount = " + tokenUpgradeCount);
                    var upgradeType = UpgradeCard.properties[upgrade].type;

                    if (i < tokenUpgradeCount && upgradeType === tokenUpgradeTypes[i])
                    {
                        tokenUpgrades.push(upgrade);
                    }
                    else
                    {
                        upgrades[i] = undefined;
                    }
                }
            });

            var tokenUpgradeCount = token.upgradeTypeKeys().length;
            LOGGER.debug("tokenUpgradeCount = " + tokenUpgradeCount);

            this.setState(
            {
                token: token,
                upgrades: upgrades,
            });
        },
    });

    return SquadBuilderUI;
});
