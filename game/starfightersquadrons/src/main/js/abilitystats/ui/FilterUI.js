define(["Event", "Phase", "abilitystats/Action", "abilitystats/DefaultFilters", "abilitystats/EntityFilter", "abilitystats/EventComparator", "abilitystats/RangeFilter"],
    function(Event, Phase, Action, DefaultFilters, EntityFilter, EventComparator, RangeFilter)
    {
        "use strict";
        var FilterUI = React.createClass(
        {
            contextTypes:
            {
                store: React.PropTypes.object.isRequired,
            },

            propTypes:
            {
                filters: React.PropTypes.object.isRequired,
            },

            getInitialState: function()
            {
                return (
                {
                    typeValues: (this.props.filters.type ? this.props.filters.type.values() : []),
                    isImplementedValues: (this.props.filters.isImplemented ? this.props.filters.isImplemented.values() : []),
                    eventValues: (this.props.filters.event ? this.props.filters.event.values() : []),
                });
            },

            render: function()
            {
                var cells = [];
                cells.push(React.DOM.td(
                {
                    key: cells.length,
                    className: "filterTable",
                }, this.createRangeTable()));
                cells.push(React.DOM.td(
                {
                    key: cells.length,
                    className: "filtersUI",
                }, this.createEntityTable()));

                var rows = [];
                rows.push(React.DOM.tr(
                {
                    key: rows.length,
                }, cells));

                rows.push(React.DOM.tr(
                {
                    key: rows.length,
                }, React.DOM.td(
                {
                    colSpan: 6,
                }, this.createButtonTable())));

                return React.DOM.table(
                {
                    className: "filtersUI",
                }, React.DOM.tbody(
                {}, rows));
            },

            createButtonTable: function()
            {
                var restoreButton = React.DOM.button(
                {
                    onClick: this.restoreActionPerformed,
                }, "Restore Defaults");
                var unfilterButton = React.DOM.button(
                {
                    onClick: this.unfilterActionPerformed,
                }, "Remove Filter");
                var filterButton = React.DOM.button(
                {
                    onClick: this.filterActionPerformed,
                }, "Apply Filter");

                var cells = [];
                cells.push(React.DOM.td(
                {
                    key: cells.length,
                }, restoreButton));
                cells.push(React.DOM.td(
                {
                    key: cells.length,
                }, unfilterButton));
                cells.push(React.DOM.td(
                {
                    key: cells.length,
                }, filterButton));
                var row = React.DOM.tr(
                {}, cells);

                return React.DOM.table(
                {}, React.DOM.tbody(
                {}, row));
            },

            createEntityTable: function()
            {
                var cells = [];

                DefaultFilters.entityColumns.forEach(function(column)
                    {
                        var values;
                        var labelFunction;
                        var clientProps = {};
                        clientProps["data-entitytype"] = column.key;

                        switch (column.key)
                        {
                            case "type":
                                values = ["DamageCard", "DamageCardV2", "Pilot", "UpgradeCard"];
                                break;
                            case "isImplemented":
                                values = [true, false];
                                labelFunction = function(value)
                                {
                                    return (value ? "true" : "false");
                                };
                                break;
                            case "event":
                                values = [];
                                this.context.store.getState().abilityData.forEach(function(abilityData)
                                {
                                    if (abilityData.event && !values.vizziniContains(abilityData.event))
                                    {
                                        values.push(abilityData.event);
                                    }
                                });
                                values.sort(EventComparator);
                                break;
                            default:
                                throw "Unknown entity column: " + column.key;
                        }

                        var oldFilter = this.context.store.getState().filters[column.key];
                        var initialValues = [];

                        if (oldFilter)
                        {
                            initialValues.vizziniAddAll(oldFilter.values());
                        }

                        var label = React.DOM.span(
                        {
                            className: "entityLabel",
                        }, column.label);
                        var checkboxPanel = React.createElement(CheckboxInputPanel,
                        {
                            values: values,
                            labelFunction: labelFunction,
                            initialValues: initialValues,
                            onChange: this.handleEntityChange,
                            panelClass: "entitiesTable",
                            clientProps: clientProps,
                        });

                        cells.push(React.DOM.td(
                        {
                            key: cells.length,
                            className: "entityFilterContainer",
                        }, label, React.DOM.div(
                        {
                            className: "entitiesContainer",
                        }, checkboxPanel)));
                    },
                    this);

                var row = React.DOM.tr(
                {}, cells);

                return React.DOM.table(
                {
                    className: "filtersUI",
                }, React.DOM.tbody(
                {}, row));
            },

            createRangeTable: function()
            {
                var rows = [];

                DefaultFilters.rangeColumns.forEach(function(column)
                {
                    var filter = this.props.filters[column.key];
                    var cells = [];
                    cells.push(React.DOM.td(
                    {
                        key: cells.length,
                    }, React.DOM.input(
                    {
                        id: column.key + "MinChecked",
                        type: "checkbox",
                        defaultChecked: (filter ? filter.isMinEnabled() : false),
                        onChange: this.handleRangeChange,
                    })));
                    cells.push(React.DOM.td(
                    {
                        key: cells.length,
                    }, React.DOM.input(
                    {
                        id: column.key + "Min",
                        type: "number",
                        className: "filterField",
                        defaultValue: (filter ? filter.minValue() : 0),
                        onChange: this.handleRangeChange,
                    })));
                    cells.push(React.DOM.td(
                    {
                        key: cells.length,
                    }, "\u2264 " + column.label + " \u2264"));
                    cells.push(React.DOM.td(
                    {
                        key: cells.length,
                    }, React.DOM.input(
                    {
                        id: column.key + "MaxChecked",
                        type: "checkbox",
                        defaultChecked: (filter ? filter.isMaxEnabled() : false),
                        onChange: this.handleRangeChange,
                    })));
                    cells.push(React.DOM.td(
                    {
                        key: cells.length,
                    }, React.DOM.input(
                    {
                        id: column.key + "Max",
                        type: "number",
                        className: "filterField",
                        defaultValue: (filter ? filter.maxValue() : 10),
                        onChange: this.handleRangeChange,
                    })));

                    rows.push(React.DOM.tr(
                    {
                        key: rows.length,
                    }, cells));
                }, this);

                return React.DOM.table(
                {
                    className: "filterTable",
                }, React.DOM.tbody(
                {}, rows));
            },

            filterActionPerformed: function(event)
            {
                LOGGER.trace("FilterUI.filterActionPerformed() start");

                var filters = {};

                DefaultFilters.entityColumns.forEach(function(column)
                {
                    var values = [];

                    switch (column.key)
                    {
                        case "type":
                            values.vizziniAddAll(this.state.typeValues);
                            break;
                        case "isImplemented":
                            values.vizziniAddAll(this.state.isImplementedValues);
                            break;
                        case "event":
                            values.vizziniAddAll(this.state.eventValues);
                            break;
                        default:
                            throw "Unknown entity column: " + column.key;
                    }

                    var filter = new EntityFilter(column.key, values);
                    filters[column.key] = filter;
                }, this);

                DefaultFilters.rangeColumns.forEach(function(column)
                {
                    var isMinEnabled = document.getElementById(column.key + "MinChecked").checked;
                    var minValue = document.getElementById(column.key + "Min").value;
                    var isMaxEnabled = document.getElementById(column.key + "MaxChecked").checked;
                    var maxValue = document.getElementById(column.key + "Max").value;

                    var filter = new RangeFilter(column.key, isMinEnabled, minValue, isMaxEnabled, maxValue);
                    filters[column.key] = filter;
                });

                this.context.store.dispatch(Action.setFilters(filters));

                LOGGER.trace("FilterUI.filterActionPerformed() end");
            },

            handleEntityChange: function(event, selected)
            {
                LOGGER.trace("FilterUI.handleEntityChange() start");

                var entityType = event.target.dataset.entitytype;
                LOGGER.debug("entityType = " + entityType);
                var values = [];
                values.vizziniAddAll(selected);

                switch (entityType)
                {
                    case "type":
                        this.setState(
                        {
                            typeValues: values,
                        });
                        break;
                    case "isImplemented":
                        this.setState(
                        {
                            isImplementedValues: values,
                        });
                        break;
                    case "event":
                        this.setState(
                        {
                            eventValues: values,
                        });
                        break;
                    default:
                        throw "Unknown entity column: " + column.key;
                }

                LOGGER.trace("FilterUI.handleEntityChange() end");
            },

            restoreActionPerformed: function(event)
            {
                LOGGER.trace("FilterUI.restoreActionPerformed() start");
                this.context.store.dispatch(Action.setDefaultFilters());
                LOGGER.trace("FilterUI.restoreActionPerformed() end");
            },

            unfilterActionPerformed: function(event)
            {
                LOGGER.trace("FilterUI.unfilterActionPerformed() start");
                this.context.store.dispatch(Action.removeFilters());
                LOGGER.trace("FilterUI.unfilterActionPerformed() end");
            },
        });

        return FilterUI;
    });
