// Get the current script's file path
var scriptFile = new File($.fileName);
var scriptFolder = scriptFile.path;

// Look for a .txt file in the same folder
var txtFiles = Folder(scriptFolder).getFiles("*.txt");

if (txtFiles.length > 0) {
    // Assume the first .txt file found is the one to use
    var filePath = txtFiles[0];
    filePath.open('r');
    var fileContents = filePath.read();
    filePath.close();

    // Ensure a document is open
    if (app.documents.length > 0) {
        var doc = app.activeDocument;

        // Create a new Text Layer
        var textLayer = doc.artLayers.add();
        textLayer.kind = LayerKind.TEXT;

        // Set the text of the Text Layer
        var textItem = textLayer.textItem;
        textItem.contents = fileContents;

        // Set the text layer to be paragraph text (text box)
        textItem.kind = TextType.PARAGRAPHTEXT;

        // Define the bounds of the text box (width and height in inches)
        textItem.width = new UnitValue(7, "in");
        textItem.height = new UnitValue(4, "in");

        // Set the text properties: font and size
        textItem.font = "ArialMT";           // Set the font to Arial
        textItem.size = new UnitValue(12, "pt");  // Set the font size to 12pt

        // Set the text color to black
        textItem.color = app.foregroundColor;  // This sets the text color to Photoshop's current foreground color
        app.foregroundColor.rgb.hexValue = "000000";  // Ensure foreground color is black

        // Set the position of the text box (1 inch from the top-left corner)
        textItem.position = [new UnitValue(1, "in"), new UnitValue(1, "in")];

        // Align the text to the left using Action Descriptor
        var idalign = stringIDToTypeID("align");
        var idalignmentType = stringIDToTypeID("alignmentType");
        var idjustifyLeft = stringIDToTypeID("justifyLeft");

        var desc = new ActionDescriptor();
        var ref = new ActionReference();
        ref.putEnumerated(c2id("TxLr"), c2id("Ordn"), c2id("Trgt"));
        desc.putReference(c2id("null"), ref);
        var desc2 = new ActionDescriptor();
        desc2.putEnumerated(idalignmentType, idalign, idjustifyLeft);
        desc.putObject(c2id("T   "), c2id("TxLr"), desc2);

        executeAction(c2id("setd"), desc, DialogModes.NO);
    } else {
        alert("No document is open. Please open a document and try again.");
    }
} else {
    alert("No .txt file found in the script folder.");
}

// Helper function to convert charID to typeID
function c2id(s) {
    return charIDToTypeID(s);
}
