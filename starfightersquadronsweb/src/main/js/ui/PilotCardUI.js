define([ "ShipAction", "ui/FactionUI", "ui/ShipSilhouetteUI", "ui/UpgradeTypeUI" ], function(ShipAction, FactionUI,
        ShipSilhouetteUI, UpgradeTypeUI)
{
    "use strict";
    var PilotCardUI = React.createClass(
    {
        getInitialState: function()
        {
            return (
            {
                token: this.props.initialToken
            });
        },

        componentDidMount: function()
        {
            this.state.token.bind("change", this.tokenChanged);
        },

        componentWillUnmount: function()
        {
            this.state.token.unbind("change", this.tokenChanged);
        },

        render: function()
        {
            InputValidator.validateNotNull("initialToken property", this.props.initialToken);
            InputValidator.validateNotNull("isCompact property", this.props.isCompact);

            if (this.props.isCompact)
            {
                return this.renderCompact();
            }
            else
            {
                return this.renderLarge();
            }
        },

        renderCompact: function()
        {
            var myToken = this.state.token;

            var rows = [];

            var element0 = React.createElement(PilotCardUI.NamePanel,
            {
                pilotSkillValue: myToken.pilotSkillValue(),
                pilotName: myToken.pilotName(),
                shipName: myToken.shipName(),
                team: myToken.pilot().shipTeam.teamKey,
            });
            var cell0 = React.DOM.td({}, element0);
            rows.push(React.DOM.tr(
            {
                key: 0
            }, cell0));

            var element1 = React.createElement(PilotCardUI.StatsPanel,
            {
                isCompact: true,
                primaryWeaponValue: myToken.primaryWeaponValue(),
                agilityValue: myToken.agilityValue(),
                hullValue: myToken.hullValue(),
                shieldValue: myToken.shieldValue(),
            });
            var cell1 = React.DOM.td({}, element1);
            rows.push(React.DOM.tr(
            {
                key: 1
            }, cell1));

            var element2 = React.createElement(PilotCardUI.TokensPanel,
            {
                cloakCount: myToken.cloak().count(),
                evadeCount: myToken.evade().count(),
                focusCount: myToken.focus().count(),
                ionCount: myToken.ion().count(),
                shieldCount: myToken.shield().count(),
                stressCount: myToken.stress().count(),
                weaponsDisabledCount: myToken.weaponsDisabled().count(),
                attackerTargetLocks: myToken.attackerTargetLocks(),
                defenderTargetLocks: myToken.defenderTargetLocks(),
                damageCount: myToken.damageCount(),
                criticalDamageCount: myToken.criticalDamageCount(),
            });
            var cell2 = React.DOM.td({}, element2);
            rows.push(React.DOM.tr(
            {
                key: 2
            }, cell2));

            return React.DOM.table(
            {
                className: "pilotCard"
            }, rows);
        },

        renderLarge: function()
        {
            var myToken = this.state.token;
            var pilot = myToken.pilot();
            var ship = pilot.shipTeam.ship;
            var pilotDescription = pilot.description;
            var pilotDescriptionClassName = "pilotCardUIDescription" + (pilot.isFlavorText ? " flavorText" : "");
            var pilotCost = pilot.squadPointCost;
            var prefix = myToken.toString();
            var shipActionKeys = ship.shipActionKeys;
            var upgradeTypeKeys = myToken.upgradeTypeKeys();
            var rows = [];

            var element00 = React.createElement(PilotCardUI.NamePanel,
            {
                pilotSkillValue: myToken.pilotSkillValue(),
                pilotName: myToken.pilotName(),
                shipName: myToken.shipName(),
                team: pilot.shipTeam.teamKey,
            });
            var cell00 = React.DOM.td({}, element00);
            rows.push(React.DOM.tr(
            {
                key: rows.length,
            }, cell00));

            var innerCells10 = [];
            var element100 = React.createElement(PilotCardUI.StatsPanel,
            {
                isCompact: false,
                primaryWeaponValue: myToken.primaryWeaponValue(),
                agilityValue: myToken.agilityValue(),
                hullValue: myToken.hullValue(),
                shieldValue: myToken.shieldValue(),
            });
            innerCells10.push(React.DOM.td(
            {
                key: 0,
                rowSpan: 2
            }, element100));
            innerCells10.push(React.DOM.td(
            {
                key: 1,
                className: pilotDescriptionClassName
            }, pilotDescription));

            var element101 = React.createElement(PilotCardUI.ShipActionPanel,
            {
                shipActions: shipActionKeys
            });
            var innerCell11 = React.DOM.td({}, element101);

            var innerRows1 = [];
            innerRows1.push(React.DOM.tr(
            {
                key: 0
            }, innerCells10));
            innerRows1.push(React.DOM.tr(
            {
                key: 1
            }, innerCell11));

            var innerTable1 = React.DOM.table({}, innerRows1);
            var cell10 = React.DOM.td({}, innerTable1);
            rows.push(React.DOM.tr(
            {
                key: rows.length,
            }, cell10));

            var innerCells20 = [];
            var element201 = React.createElement(PilotCardUI.UpgradePanel,
            {
                upgradeTypes: upgradeTypeKeys
            });
            innerCells20.push(React.DOM.td(
            {
                key: innerCells20.length,
                className: "pilotCardUISilhouetteCell"
            }, React.createElement(ShipSilhouetteUI,
            {
                shipKey: pilot.shipTeam.shipKey,
            })));
            innerCells20.push(React.DOM.td(
            {
                key: innerCells20.length,
                className: "pilotCardUIUpgradeCell"
            }, element201));
            innerCells20.push(React.DOM.td(
            {
                key: innerCells20.length,
                className: "pilotCardUISquadPointCost",
                title: "Squad Point cost"
            }, pilotCost));
            var innerRow2 = React.DOM.tr({}, innerCells20);
            var innerTable2 = React.DOM.table(
            {
                className: "pilotCardUIUpgradeSquadCost"
            }, innerRow2);
            var cell20 = React.DOM.td({}, innerTable2);
            rows.push(React.DOM.tr(
            {
                key: rows.length,
            }, cell20));

            var element30 = React.createElement(PilotCardUI.TokensPanel,
            {
                token: myToken,
                cloakCount: myToken.cloak().count(),
                evadeCount: myToken.evade().count(),
                focusCount: myToken.focus().count(),
                ionCount: myToken.ion().count(),
                shieldCount: myToken.shield().count(),
                stressCount: myToken.stress().count(),
                weaponsDisabledCount: myToken.weaponsDisabled().count(),
                attackerTargetLocks: myToken.attackerTargetLocks(),
                defenderTargetLocks: myToken.defenderTargetLocks(),
                damageCount: myToken.damageCount(),
                criticalDamageCount: myToken.criticalDamageCount(),
            });
            var cell30 = React.DOM.td({}, element30);
            rows.push(React.DOM.tr(
            {
                key: 3
            }, cell30));

            return React.DOM.table(
            {
                className: "pilotCard"
            }, rows);
        },

        tokenChanged: function()
        {
            LOGGER.trace(this.state.token.name() + " token change event");
            this.setState(
            {
                token: this.state.token
            });
        },
    });

    PilotCardUI.createActionImage = function(shipAction)
    {
        InputValidator.validateNotNull("shipAction", shipAction);

        var actionName0 = ShipAction.properties[shipAction].displayName;
        actionName0 = actionName0.replace(" (left)", "");
        actionName0 = actionName0.replace(" (straight)", "");
        actionName0 = actionName0.replace(" (right)", "");
        actionName0 = actionName0.replace(" (SubLight Acceleration Motor)", "");
        var actionName = actionName0.replace(" ", "");
        var fileString = imageBase + "pilotCard/" + actionName + "24.png";

        return React.DOM.img(
        {
            className: "pilotCardUIImage",
            src: fileString,
            title: actionName0,
        });
    };

    PilotCardUI.NamePanel = React.createClass(
    {
        render: function()
        {
            var cells0 = [];
            cells0.push(React.DOM.td(
            {
                key: 0,
                title: "Pilot Skill",
                className: "namePanel pilotSkillValue",
                rowSpan: 2
            }, this.props.pilotSkillValue));
            cells0.push(React.DOM.td(
            {
                key: 1,
                title: "Name",
                className: "namePanel"
            }, this.props.pilotName));
            cells0.push(React.DOM.td(
            {
                key: 2,
                className: "namePanel",
                rowSpan: 2
            }, React.createElement(FactionUI,
            {
                factionKey: this.props.team,
            })));

            var cell1 = React.DOM.td(
            {
                title: "Ship",
                className: "namePanel"
            }, this.props.shipName);

            var rows = [];
            rows.push(React.DOM.tr(
            {
                key: 0
            }, cells0));
            rows.push(React.DOM.tr(
            {
                key: 1
            }, cell1));

            return React.DOM.table(
            {
                className: "nameTable"
            }, rows);
        },
    });

    PilotCardUI.StatsPanel = React.createClass(
    {
        render: function()
        {
            var isCompact = this.props.isCompact;

            if (isCompact)
            {
                return this.renderCompact();
            }
            else
            {
                return this.renderLarge();
            }
        },

        renderCompact: function()
        {
            var cells = [];
            var image0 = React.DOM.img(
            {
                src: imageBase + "pilotCard/WeaponIcon24.png",
            });
            cells.push(React.DOM.td(
            {
                key: 0,
                className: 'primaryWeaponValue',
                title: 'Primary Weapon'
            }, image0));
            cells.push(React.DOM.td(
            {
                key: 1,
                className: 'primaryWeaponValue',
                title: 'Primary Weapon'
            }, this.props.primaryWeaponValue));

            var image1 = React.DOM.img(
            {
                src: imageBase + "pilotCard/AgilityIcon24.png",
            });
            cells.push(React.DOM.td(
            {
                key: 2,
                className: 'agilityValue',
                title: 'Agility'
            }, image1));
            cells.push(React.DOM.td(
            {
                key: 3,
                className: 'agilityValue',
                title: 'Agility'
            }, this.props.agilityValue));

            var image2 = React.DOM.img(
            {
                src: imageBase + "pilotCard/HullIcon24.png",
            });
            cells.push(React.DOM.td(
            {
                key: 4,
                className: 'hullValue',
                title: 'Hull'
            }, image2));
            cells.push(React.DOM.td(
            {
                key: 5,
                className: 'hullValue',
                title: 'Hull'
            }, this.props.hullValue));

            var image3 = React.DOM.img(
            {
                src: imageBase + "pilotCard/ShieldIcon24.png",
            });
            cells.push(React.DOM.td(
            {
                key: 6,
                className: 'shieldValue',
                title: 'Shield'
            }, image3));
            cells.push(React.DOM.td(
            {
                key: 7,
                className: 'shieldValue',
                title: 'Shield'
            }, this.props.shieldValue));

            var row = React.DOM.tr({}, cells);

            return React.DOM.table(
            {
                className: "statsTable"
            }, row);
        },

        renderLarge: function()
        {
            var rows = [];
            var cells0 = [];
            var image0 = React.DOM.img(
            {
                src: imageBase + "pilotCard/WeaponIcon24.png",
            });
            cells0.push(React.DOM.td(
            {
                key: 0,
                className: 'primaryWeaponValue',
                title: 'Primary Weapon'
            }, image0));
            cells0.push(React.DOM.td(
            {
                key: 1,
                className: 'primaryWeaponValue',
                title: 'Primary Weapon'
            }, this.props.primaryWeaponValue));
            rows.push(React.DOM.tr(
            {
                key: 0
            }, cells0));

            var cells1 = [];
            var image1 = React.DOM.img(
            {
                src: imageBase + "pilotCard/AgilityIcon24.png",
            });
            cells1.push(React.DOM.td(
            {
                key: 2,
                className: 'agilityValue',
                title: 'Agility'
            }, image1));
            cells1.push(React.DOM.td(
            {
                key: 3,
                className: 'agilityValue',
                title: 'Agility'
            }, this.props.agilityValue));
            rows.push(React.DOM.tr(
            {
                key: 1
            }, cells1));

            var cells2 = [];
            var image2 = React.DOM.img(
            {
                src: imageBase + "pilotCard/HullIcon24.png",
            });
            cells2.push(React.DOM.td(
            {
                key: 4,
                className: 'hullValue',
                title: 'Hull'
            }, image2));
            cells2.push(React.DOM.td(
            {
                key: 5,
                className: 'hullValue',
                title: 'Hull'
            }, this.props.hullValue));
            rows.push(React.DOM.tr(
            {
                key: 2
            }, cells2));

            var cells3 = [];
            var image3 = React.DOM.img(
            {
                src: imageBase + "pilotCard/ShieldIcon24.png",
            });
            cells3.push(React.DOM.td(
            {
                key: 6,
                className: 'shieldValue',
                title: 'Shield'
            }, image3));
            cells3.push(React.DOM.td(
            {
                key: 7,
                className: 'shieldValue',
                title: 'Shield'
            }, this.props.shieldValue));
            rows.push(React.DOM.tr(
            {
                key: 3
            }, cells3));

            return React.DOM.table(
            {
                className: "statsTable"
            }, rows);
        },
    });

    PilotCardUI.ShipActionPanel = React.createClass(
    {
        excludes: [ ShipAction.BARREL_ROLL_RIGHT, ShipAction.BOOST_STRAIGHT, ShipAction.BOOST_RIGHT ],

        render: function()
        {
            var shipActions = this.props.shipActions;
            var cells = [];

            for (var i = 0; i < shipActions.length; i++)
            {
                var shipAction = shipActions[i];

                if (!this.excludes.vizziniContains(shipAction))
                {
                    var img = PilotCardUI.createActionImage(shipAction);
                    cells.push(React.DOM.td(
                    {
                        key: i,
                        className: "pilotCardUIShipActionCell"
                    }, img));
                }
            }

            var row = React.DOM.tr(
            {
                className: "pilotCardUIShipActions"
            }, cells);
            return React.DOM.table(
            {
                className: "pilotCardUIShipActions"
            }, row);
        },
    });

    PilotCardUI.UpgradePanel = React.createClass(
    {
        render: function()
        {
            var upgradeTypes = this.props.upgradeTypes;
            var cells = [];

            for (var i = 0; i < upgradeTypes.length; i++)
            {
                var upgradeType = upgradeTypes[i];
                var img = React.createElement(UpgradeTypeUI,
                {
                    upgradeTypeKey: upgradeType,
                });
                cells.push(React.DOM.td(
                {
                    key: i,
                }, img));
            }

            var row = React.DOM.tr({}, cells);
            return React.DOM.table(
            {
                className: "pilotCardUIUpgrades"
            }, row);
        },
    });

    PilotCardUI.LabelToken = React.createClass(
    {
        render: function()
        {
            var divStyle =
            {
                backgroundImage: 'url(' + this.props.path + ')',
                width: this.props.width,
            };

            var paragraph = React.DOM.p(
            {
                className: this.props.numberClass
            }, this.props.label);
            return React.DOM.div(
            {
                title: this.props.title,
                className: 'labelTokenBox',
                style: divStyle
            }, paragraph);
        },
    });

    PilotCardUI.CountToken = React.createClass(
    {
        render: function()
        {
            var divStyle =
            {
                backgroundImage: 'url(' + this.props.path + ')',
                width: this.props.width,
            };

            var answer;

            if (this.props.count === 0)
            {
                answer = React.DOM.span();
            }
            else if (this.props.count == 1)
            {
                answer = React.DOM.div(
                {
                    title: this.props.title,
                    className: 'countTokenBox',
                    style: divStyle
                });
            }
            else
            {
                var paragraph = React.DOM.p(
                {
                    className: this.props.numberClass
                }, this.props.count);
                return React.DOM.div(
                {
                    title: this.props.title,
                    className: 'countTokenBox',
                    style: divStyle
                }, paragraph);
            }

            return answer;
        },
    });

    PilotCardUI.TokensPanel = React.createClass(
    {
        render: function()
        {
            var element0 = React.createElement(PilotCardUI.CountToken,
            {
                title: "Cloak",
                width: "36",
                numberClass: "countTokenText",
                path: imageBase + "token/CloakToken32.png",
                count: this.props.cloakCount
            });
            var element1 = React.createElement(PilotCardUI.CountToken,
            {
                title: "Evade",
                width: "32",
                numberClass: "countTokenText",
                path: imageBase + "token/EvadeToken32.png",
                count: this.props.evadeCount
            });
            var element2 = React.createElement(PilotCardUI.CountToken,
            {
                title: "Focus",
                width: "32",
                numberClass: "countTokenText",
                path: imageBase + "token/FocusToken32.png",
                count: this.props.focusCount
            });
            var element3 = React.createElement(PilotCardUI.CountToken,
            {
                title: "Ion",
                width: "32",
                numberClass: "countTokenText",
                path: imageBase + "token/IonToken32.png",
                count: this.props.ionCount
            });
            var element4 = React.createElement(PilotCardUI.CountToken,
            {
                title: "Shield",
                width: "32",
                numberClass: "countTokenText",
                path: imageBase + "token/ShieldToken32.png",
                count: this.props.shieldCount
            });
            var element5 = React.createElement(PilotCardUI.CountToken,
            {
                title: "Stress",
                width: "32",
                numberClass: "countTokenText",
                path: imageBase + "token/StressToken32.png",
                count: this.props.stressCount
            });
            var element6 = React.createElement(PilotCardUI.CountToken,
            {
                title: "Weapons Disabled",
                width: "32",
                numberClass: "countTokenText",
                path: imageBase + "token/WeaponsDisabledToken32.png",
                count: this.props.weaponsDisabledCount
            });
            var element7 = React.createElement(PilotCardUI.CountToken,
            {
                title: "Damage",
                width: "32",
                numberClass: "damageCount",
                path: imageBase + "pilotCard/Damage32.jpg",
                count: this.props.damageCount
            });
            var element8 = React.createElement(PilotCardUI.CountToken,
            {
                title: "Critical Damage",
                width: "32",
                numberClass: "damageCount",
                path: imageBase + "pilotCard/CriticalDamage32.jpg",
                count: this.props.criticalDamageCount
            });

            var cells = [];
            cells.push(React.DOM.td(
            {
                key: 0
            }, element0));
            cells.push(React.DOM.td(
            {
                key: 1
            }, element1));
            cells.push(React.DOM.td(
            {
                key: 2
            }, element2));
            cells.push(React.DOM.td(
            {
                key: 3
            }, element3));
            cells.push(React.DOM.td(
            {
                key: 4
            }, element4));
            cells.push(React.DOM.td(
            {
                key: 5
            }, element5));

            this.props.attackerTargetLocks.forEach(function(targetLock)
            {
                var title = "Target Lock to " + targetLock.defender().name();
                var element = React.createElement(PilotCardUI.LabelToken,
                {
                    title: title,
                    width: "38",
                    numberClass: "labelTokenText",
                    path: imageBase + "token/AttackerTargetLock32.png",
                    label: targetLock.id(),
                });
                cells.push(React.DOM.td(
                {
                    key: cells.length,
                }, element));
            });

            this.props.defenderTargetLocks.forEach(function(targetLock)
            {
                var title = "Target Lock from " + targetLock.attacker().name();
                var element = React.createElement(PilotCardUI.LabelToken,
                {
                    title: title,
                    width: "38",
                    numberClass: "labelTokenText",
                    path: imageBase + "token/DefenderTargetLock32.png",
                    label: targetLock.id(),
                });
                cells.push(React.DOM.td(
                {
                    key: cells.length,
                }, element));
            });

            cells.push(React.DOM.td(
            {
                key: cells.length,
            }, element6));
            cells.push(React.DOM.td(
            {
                key: cells.length,
            }, element7));
            cells.push(React.DOM.td(
            {
                key: cells.length,
            }, element8));

            var row = React.DOM.tr({}, cells);
            var table = React.DOM.table(
            {
                className: "tokensTable"
            }, row);
            return React.DOM.div(
            {
                className: "tokensPanel"
            }, table);
        },
    });

    return PilotCardUI;
});
