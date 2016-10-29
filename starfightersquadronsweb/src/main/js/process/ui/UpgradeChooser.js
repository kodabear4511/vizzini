define(["UpgradeCard", "process/ui/UpgradeCardUI", "process/ui/UpgradeTypeUI"],
    function(UpgradeCard, UpgradeCardUI, UpgradeTypeUI)
    {
        "use strict";
        var UpgradeChooser = React.createClass(
        {
            getInitialState: function()
            {
                return (
                {
                    selected: undefined
                });
            },

            render: function()
            {
                var pilot = this.props.pilot;
                var upgradeType = this.props.upgradeType;
                var upgrades = UpgradeCard.valuesByPilotAndType(pilot, upgradeType);
                upgrades.unshift("*none*");

                var rows = [];

                var image = React.createElement(UpgradeTypeUI,
                {
                    upgradeTypeKey: upgradeType,
                });
                var labelFunction = function(value)
                {
                    var upgradeProps = UpgradeCard.properties[value];
                    return (upgradeProps ? upgradeProps.name + " [" + upgradeProps.squadPointCost + "]" : value);
                };
                var select = React.createElement(Select,
                {
                    key: 1,
                    values: upgrades,
                    labelFunction: labelFunction,
                    initialSelectedValue: this.state.selected,
                    onChange: this.upgradeCardChanged,
                    clientProps:
                    {
                        "data-index": this.props.index
                    }
                });
                rows.push(React.DOM.tr(
                {
                    key: rows.length,
                }, React.DOM.td(
                {}, image, select)));

                var selected = this.state.selected;
                var upgradeCardUI = " ";
                if (selected)
                {
                    upgradeCardUI = React.createElement(UpgradeCardUI,
                    {
                        upgradeCard: selected
                    });
                }
                var cell = React.DOM.td(
                {
                    id: this.createId()
                }, upgradeCardUI);
                rows.push(React.DOM.tr(
                {
                    key: rows.length,
                }, cell));

                return React.DOM.table(
                {
                    className: "upgradeChooser"
                }, React.DOM.tbody(
                {}, rows));
            },

            createId: function()
            {
                var pilot = this.props.pilot;
                var upgradeType = this.props.upgradeType;
                var index = this.props.index;

                return pilot + upgradeType + index;
            },

            getSelected: function()
            {
                return this.state.selected;
            },

            upgradeCardChanged: function(event)
            {
                var upgradeCard = event.currentTarget.value;
                LOGGER.debug("UpgradeChooser.upgradeCardChanged() upgradeCard = " + upgradeCard);

                if (upgradeCard == "*none*")
                {
                    upgradeCard = undefined;
                }

                this.setState(
                {
                    selected: upgradeCard
                });

                this.props.onChangeFunction(event);
            },
        });

        return UpgradeChooser;
    });