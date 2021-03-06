// Wraps a layer in a square bounding box


var doc;
var selection;

function wrap (layer) {
	var parent;

	if (layer.className() == "MSLayerGroup") {
		parent = layer;
	} else {
		parent = wrapInGroup(layer);
		parent.setName(layer.name());
	}

	addSuffix(parent, targetWidth);

	var artboard = doc.currentPage().currentArtboard();

	// get initial dimensions
	var height = layer.absoluteRect().height();
	var width = layer.absoluteRect().width();
	var x = layer.absoluteRect().x();
	var y = layer.absoluteRect().y();

	// calculate target position for the bounding box
	var targetX = Math.round(x - ((targetWidth - width) / 2));
	var targetY = Math.round(y - ((targetHeight - height) / 2));

	// create the bounding box
	var box = addRectangleLayer(parent);

	box.absoluteRect().setWidth(targetWidth);
	box.absoluteRect().setHeight(targetHeight);

	box.absoluteRect().setX(targetX);
	box.absoluteRect().setY(targetY);

	box.setName("specs bounding box");

	box.style().fills().addNewStylePart();
	box.style().fill().setFillType(0);

	color = MSColor.colorWithNSColor(NSColor.colorWithHex_alpha(hex_string, 0.1));

	box.style().fill().setColor(color)

	// apply shared style
	addSharedStyle(sharedStyleName, box)

	// select the bounding box
	doc.currentPage().deselectAllLayers();
	box.setIsSelected(true);

	// send bounding box to back
	sendAction('moveToBack:');

	box.setIsLocked(true);

	parent.resizeRoot(true);
	box.setIsSelected(false);
	parent.setIsSelected(true);

}


function sendAction (commandToPerform) {
    try {
        [NSApp sendAction: commandToPerform to: nil from: doc];
    } catch (e) {
        my.log(e)
    }
}

function addRectangleLayer (target) {
	var rect = target.addLayerOfType("rectangle");
	return rect;
}

function addSharedStyle (name, reference) {
	var sharedStyles = doc.documentData().layerStyles();

	// lookup
	var found = false;
	var style;
	for (var i = 0; i < sharedStyles.objects().count(); i++) {
		if (sharedStyles.objects().objectAtIndex(i).name() == sharedStyleName) {
			found = true;
			style = sharedStyles.objects().objectAtIndex(i);
		}
	}

	if (!found) {
		style = sharedStyles.addSharedStyleWithName_firstInstance(name, reference.style());
	} else {
		reference.setStyle(style.newInstance());
	}
}

function addSuffix (layer, suffix) {
	// hasSuffix() ?
	var name = layer.name();
	layer.setName(name + "--" + suffix);
	return layer.name();
}

function wrapInGroup (layers) {
	var group = layers.parentGroup().addLayerOfType("group");
	MSLayerGroup.moveLayers_intoGroup([layers], group)
	return group;
}


function getBoundsSize () {
    // access the base unit for formatting purposes
    var persistent = [[NSThread mainThread] threadDictionary];

    if (persistent["com.getflourish.bounds"] == null) {
    	initial = 16;
    } else {
    	initial = persistent["com.getflourish.bounds"];
    }
log(persistent)
    var value = parseFloat([doc askForUserInput: "Bounding box size:" initialValue: initial]);
    persistent["com.getflourish.bounds"] = value;

  	return persistent["com.getflourish.bounds"];

}

var onRun = function (context) {

    // old school variable
    doc = context.document;
    selection = context.selection;

    var sharedStyleName = "@specs";

    // color of the bounding box
    var hex_string = "#ff0000";

    // ask user for the box size
    var targetWidth = getBoundsSize();

    var targetHeight = targetWidth;

    for (var i = 0; i < selection.count(); i++) {
        doc.currentPage().deselectAllLayers();
        wrap(selection[i]);
    }
}