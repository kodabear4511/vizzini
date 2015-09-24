function _52WeekPricePercentChart(chartCanvasId, symbols)
{
    InputValidator.validateNotEmpty("chartCanvasId", chartCanvasId);
    InputValidator.validateNotEmpty("symbols", symbols);

    this.receiveData = function(keyStats)
    {
        InputValidator.validateNotNull("keyStats", keyStats);

        LOGGER.debug("keyStats = " + keyStats.getSymbol() + " "
                + keyStats.getPriceLabel() + " " + keyStats.getPriceValue());
        var symbol = keyStats.getSymbol();
        LOGGER.trace("symbol = " + symbol);
        var index = data.labels.indexOf(symbol);
        LOGGER.trace("index = " + index);

        if (index >= 0)
        {
            var percentValue = keyStats.get52WeekPricePercent();

            if (percentValue && !isNaN(percentValue))
            {
                myBarChart.datasets[0].bars[index].value = percentValue;
                myBarChart.update();
            }
        }
    }

    var defaultData = [];

    for (var i = 0; i < symbols.length; i++)
    {
        defaultData.push(0);
    }

    var ctx = document.getElementById(chartCanvasId).getContext("2d");
    var data =
    {
        labels: symbols,
        datasets: [
        {
            fillColor: "red",
            data: defaultData
        } ]
    };
    var options =
    {
        // Boolean - If we want to override with a hard coded scale
        scaleOverride: true,
        // Number - The number of steps in a hard coded scale
        scaleSteps: 10,
        // Number - The value jump in the hard coded scale
        scaleStepWidth: 10,
        // Number - The scale starting value
        scaleStartValue: 0,

        // Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines: true,
        // String - Colour of the grid lines
        scaleGridLineColor: "rgba(0,0,0,0.8)",
        // Number - Width of the grid lines
        scaleGridLineWidth: 1,
        // Boolean - Whether to show horizontal lines (except X axis)
        scaleShowHorizontalLines: true,
        // Boolean - Whether to show vertical lines (except Y axis)
        scaleShowVerticalLines: false,
    };

    var myBarChart = new Chart(ctx).Bar(data, options);
}