define([ "Pilot", "Ship", "UpgradeCard", "ui/UpgradeCardUI" ], function(Pilot, Ship, UpgradeCard, UpgradeCardUI)
{
    var SquadColumns = [
    {
        key: "pilot",
        label: "Pilot",
        className: "squadUIPilotName",
    },
    {
        key: "ship",
        label: "Ship",
        className: "squadUIPilotName",
    },
    {
        key: "pilotSkill",
        label: "Pilot Skill",
        className: "numberCell",
    },
    {
        key: "primaryWeapon",
        label: "Primary Weapon",
        className: "numberCell",
    },
    {
        key: "agility",
        label: "Agility",
        className: "numberCell",
    },
    {
        key: "hull",
        label: "Hull",
        className: "numberCell",
    },
    {
        key: "shield",
        label: "Shield",
        className: "numberCell",
    },
    {
        key: "squadPointCost",
        label: "Squad Points",
        className: "numberCell",
    },
    {
        key: "action",
        label: "Action",
        className: "actionCell",
    }, ];

    /*
     * Provides a user interface for a starfighter squadron.
     * 
     * @param squad Squad.
     * 
     * @param iconBase Icon base URL.
     * 
     * @param removeFunction Called after an item is removed.
     */
    var SquadUI = React.createClass(
    {
        // Factories.
        Table: React.createFactory(Reactable.Table),
        Tr: React.createFactory(Reactable.Tr),
        Td: React.createFactory(Reactable.Td),
        Tfoot: React.createFactory(Reactable.Tfoot),

        render: function()
        {
            var squad = this.props.squad;
            var self = this;

            // Assign actions.
            squad.forEach(function(token)
            {
                if (!token.removeAction)
                {
                    token.removeAction = self.createRemoveAction(token);
                }
            });

            var rows = squad.map(function(token, i)
            {
                return self.createRows(token, i);
            });
            var footer = this.Tfoot(
            {
                key: "footer",
            }, this.createTotalsRow());
            var myColumns = (this.isEditable() ? SquadColumns : SquadColumns.slice(0, SquadColumns.length - 1));

            return this.Table(
            {
                className: "squadUI",
                columns: myColumns,
            }, rows, footer);
        },

        createCell: function(key, column, value)
        {
            return this.Td(
            {
                key: key,
                className: column.className,
                column: column.key,
            }, value);
        },

        createRemoveAction: function(token)
        {
            var removeFunction = this.props.removeFunction;
            var myOnClick = function(event)
            {
                removeFunction(token);
            };
            var image = React.DOM.img(
            {
                src: iconBase + "delete.png",
            });

            return React.DOM.a(
            {
                href: "#",
                className: "removeButton",
                onClick: myOnClick,
            }, image);
        },

        createRows: function(token, i)
        {
            var answer = [];

            answer.push(this.createTokenRow(token, i));

            var upgrades = token.upgrades();
            var self = this;

            upgrades.forEach(function(upgrade, j)
            {
                answer.push(self.createUpgradeRow(upgrade, j));
            });

            return answer;
        },

        createTokenRow: function(token, i)
        {
            var cells = [];
            var createCell = this.createCell;
            var i = 0;

            var pilotProps = Pilot.properties[token.pilot()];
            var shipProps = Ship.properties[token.ship()];
            cells.push(createCell(cells.length, SquadColumns[i++], React.DOM.span(
            {
                title: pilotProps.description,
            }, pilotProps.name)));
            cells.push(createCell(cells.length, SquadColumns[i++], shipProps.name));

            var shipState = pilotProps.shipState;
            cells.push(createCell(cells.length, SquadColumns[i++], shipState.getPilotSkillValue()));
            cells.push(createCell(cells.length, SquadColumns[i++], shipState.getPrimaryWeaponValue()));
            cells.push(createCell(cells.length, SquadColumns[i++], shipState.getAgilityValue()));
            cells.push(createCell(cells.length, SquadColumns[i++], shipState.getHullValue()));
            cells.push(createCell(cells.length, SquadColumns[i++], shipState.getShieldValue()));

            cells.push(createCell(cells.length, SquadColumns[i++], pilotProps.squadPointCost));

            var actionFunction = token["removeAction"];
            cells.push(createCell(cells.length, SquadColumns[i++], actionFunction));

            return this.Tr(
            {
                key: i,
            }, cells);
        },

        createTotalsRow: function()
        {
            var squad = this.props.squad;
            var sums = {};
            var start = 2;
            var i = 0;
            sums[SquadColumns[i++].key] = "";
            sums[SquadColumns[i++].key] = "Totals";
            for (var i = start; i < SquadColumns.length; i++)
            {
                sums[SquadColumns[i].key] = 0;
            }

            squad.forEach(function(token)
            {
                var pilot = token.pilot();
                var pilotProps = Pilot.properties[pilot];
                var shipState = pilotProps.shipState;
                var values = [ shipState.getPilotSkillValue(), shipState.getPrimaryWeaponValue(),
                        shipState.getAgilityValue(), shipState.getHullValue(), shipState.getShieldValue(),
                        pilotProps.squadPointCost ];
                for (var i = start; i < SquadColumns.length; i++)
                {
                    sums[SquadColumns[i].key] += values[i - start];
                }

                var upgrades = token.upgrades();
                upgrades.forEach(function(upgrade)
                {
                    var upgradeProps = UpgradeCard.properties[upgrade];
                    var shipState = upgradeProps.shipState;

                    if (shipState)
                    {
                        var values = [ shipState.getPilotSkillValue(), shipState.getPrimaryWeaponValue(),
                                shipState.getAgilityValue(), shipState.getHullValue(), shipState.getShieldValue() ];
                        for (var i = start; i < SquadColumns.length - 2; i++)
                        {
                            sums[SquadColumns[i].key] += values[i - start];
                        }
                    }
                    sums[SquadColumns[SquadColumns.length - 2].key] += upgradeProps.squadPointCost;
                });
            });

            sums[SquadColumns[SquadColumns.length - 1].key] = "";

            var cells = [];
            var isEditable = this.isEditable();
            SquadColumns.forEach(function(column)
            {
                if (isEditable || (!isEditable && column.key !== "action"))
                {
                    cells.push(React.DOM.td(
                    {
                        key: cells.length,
                        className: "squadUISum",
                    }, sums[column.key]));
                }
            }, this);

            return React.DOM.tr({}, cells);
        },

        createUpgradeRow: function(upgrade, i)
        {
            var cells = [];
            var createCell = this.createCell;
            var i = 0;

            var upgradeProps = UpgradeCard.properties[upgrade];
            if (!upgradeProps)
            {
                LOGGER.error("Missing upgradeProps for " + upgrade);
            }
            if (!upgradeProps.type)
            {
                LOGGER.error("Missing upgradeProps.type for " + upgrade);
            }
            var image = UpgradeCardUI.createUpgradeImage(upgradeProps.type, 0);
            cells.push(this.Td(
            {
                key: cells.length,
                className: "squadUIPilotName",
                column: SquadColumns[i++].key,
            }, React.DOM.span({}, image, " ", React.DOM.span(
            {
                title: upgradeProps.description,
            }, upgradeProps.name))));

            cells.push(createCell(cells.length, SquadColumns[i++], ""));

            var shipState = upgradeProps.shipState;
            cells.push(createCell(cells.length, SquadColumns[i++], (shipState ? shipState.getPilotSkillValue() : "")));
            cells
                    .push(createCell(cells.length, SquadColumns[i++], (shipState ? shipState.getPrimaryWeaponValue()
                            : "")));
            cells.push(createCell(cells.length, SquadColumns[i++], (shipState ? shipState.getAgilityValue() : "")));
            cells.push(createCell(cells.length, SquadColumns[i++], (shipState ? shipState.getHullValue() : "")));
            cells.push(createCell(cells.length, SquadColumns[i++], (shipState ? shipState.getShieldValue() : "")));

            cells.push(createCell(cells.length, SquadColumns[i++], upgradeProps.squadPointCost));
            cells.push(createCell(cells.length, SquadColumns[i++], ""));

            return this.Tr(
            {
                key: i,
            }, cells);
        },

        isEditable: function()
        {
            var isEditable = this.props.isEditable;

            return (isEditable ? isEditable : false);
        },

        removeFunction: function(selected, event)
        {
            this.props.removeFunction(selected, event);
        },
    });

    return SquadUI;
});
