/**
 * This plugin sorts selected artboards in the layer list by their left position.
 *
 * Florian Schulz Copyright 2014, MIT License
 */


@import '../inventory.js'


// sorts two objects by their left property
function sortLeft(a,b) {
    return a.left - b.left;
}


var doc;
var selection;

var onRun = function (context) {

    // old school variable
    doc = context.document;
    selection = context.selection;

    // at least two artboards need to be selected
    if (selection.count() > 1 && selection[0].className() == "MSArtboardGroup") {
        var layersMeta = [];

        for (var i = 0; i < selection.count(); i++) {
            var layer = selection[i];
            var left = layer.frame().x();
            layersMeta.push({
                layer: layer,
                left: left
            });
        }

        // sort artboards by their left position
        layersMeta.sort(sortLeft);

        // convert the array of meta objects to a flat array of artboard layers
        var layersMetaArray = [];

        for (var i = 0; i < layersMeta.length; i++) {
            layersMetaArray.push(layersMeta[i].layer);
        }

        // sort layer list
        com.getflourish.layers.sortIndices(layersMetaArray);

    } else {
        doc.showMessage("Please select at least two artboards.")
    }


}