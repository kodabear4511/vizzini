/*
 * Provides a user interface for an upgrade card.
 * 
 * @param upgradeCard Upgrade card.
 */
define([ "UpgradeCard", "UpgradeType" ], function(UpgradeCard, UpgradeType)
{
    var UpgradeCardUI = React.createClass(
    {
        render: function()
        {
            var upgradeCard = this.props.upgradeCard;
            var upgradeProps = UpgradeCard.properties[upgradeCard];

            var rows = [];

            var cell00 = React.DOM.td(
            {
                colSpan: 2
            }, UpgradeCard.getName(upgradeCard));
            rows.push(React.DOM.tr(
            {
                key: 0,
                className: "upgradeCardUIName"
            }, cell00));

            var cell10 = React.DOM.td(
            {
                colSpan: 2
            }, upgradeProps.description);
            rows.push(React.DOM.tr(
            {
                key: 1
            }, cell10));

            var cell20 = React.DOM.td(
            {
                key: 0,
                className: "upgradeCardUIImage"
            }, UpgradeCardUI.createUpgradeImage(upgradeProps.type));
            var cell21 = React.DOM.td(
            {
                key: 1,
                className: "upgradeCardUISquadPoints",
                title: "Squad Point cost"
            }, upgradeProps.squadPointCost);
            rows.push(React.DOM.tr(
            {
                key: 2
            }, [ cell20, cell21 ]));

            return React.DOM.table(
            {
                className: "upgradeCardUI"
            }, rows);
        },
    });

    UpgradeCardUI.createUpgradeImage = function(upgradeType, key)
    {
        InputValidator.validateNotNull("upgradeType", upgradeType);

        var typeName0 = UpgradeType.properties[upgradeType].displayName;
        var typeName = typeName0.replace(" ", "");
        var fileString = imageBase + "upgrade/" + typeName + "24.png";
        var myKey = (key ? key : 0);

        return React.DOM.img(
        {
            key: myKey,
            className: "upgradeCardUIImage",
            src: fileString,
            title: typeName0
        });
    }

    return UpgradeCardUI;
});
