/*
 * Provides a user interface to build a squad.
 * 
 * @param initialTeam Initial team.
 */
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
        var upgradesUI = this.createUpgradesUI();
        var addButton = React.DOM.input(
        {
            type: "button",
            value: "Add",
            onClick: this.addActionPerformed
        });

        var rows = [];

        var element0 = React.createElement(PilotChooser,
        {
            team: team,
            onChangeFunction: this.pilotChanged
        });
        rows.push(React.DOM.tr(
        {
            key: 0
        }, React.DOM.td({}, element0)));

        rows.push(React.DOM.tr(
        {
            key: 1
        }, React.DOM.td({}, upgradesUI)));

        rows.push(React.DOM.tr(
        {
            key: 2,
            className: "squadBuilderAdd"
        }, React.DOM.td({}, addButton)));

        var squadPanel = React.createElement(SquadUI,
        {
            squad: this.state.squad,
            removeFunction: this.removeActionPerformed
        });
        rows.push(React.DOM.tr(
        {
            key: 3
        }, React.DOM.td(
        {
            id: "squadPanel"
        }, squadPanel)));

        return React.DOM.table(
        {
            className: "squadBuilderUI"
        }, rows);
    },

    addActionPerformed: function(event)
    {
        LOGGER.trace("add clicked");
        var token = this.createToken(this.props.team, this.state.pilot);

        // Add upgrade cards.
        var myUpgrades = this.state.upgrades;
        var tokenUpgrades = token.getUpgrades();

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
    },

    createToken: function(team, pilot)
    {
        InputValidator.validateNotNull("team", team);
        InputValidator.validateNotNull("pilot", pilot);

        var agentName = Team.properties[team].name + " Agent";
        var squadBuilder = (team === Team.IMPERIAL) ? CoreSetImperialSquadBuilder : CoreSetRebelSquadBuilder;
        var agent = new SimpleAgent(agentName, team, squadBuilder);

        return new Token(pilot, agent);
    },

    createUpgradesUI: function()
    {
        var pilot = this.state.pilot;
        var upgradeTypes = Pilot.properties[pilot].upgradeTypes;
        var cells = [];

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
            cells.push(React.DOM.td(
            {
                key: pilot + upgradeType + cells.length,
                className: "squadBuilderUpgradeCell"
            }, element));
        });

        return React.DOM.table(
        {
            className: "squadBuilderUpgradesUI"
        }, React.DOM.tr({}, cells));
    },

    pilotChanged: function(event, pilot)
    {
        LOGGER.debug("new pilot = " + pilot);
        var team = this.props.team;
        var token = this.createToken(team, pilot);
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
        }
    },

    upgradeChanged: function(event)
    {
        var upgradeCard = event.currentTarget.value;
        LOGGER.debug("new upgradeCard = " + upgradeCard);
        var index = event.currentTarget.dataset.index;
        var upgrades = this.state.upgrades;

        upgrades[index] = (upgradeCard == "*none*") ? undefined : upgradeCard;
        this.setState(
        {
            upgrades: upgrades
        });
    },
});
