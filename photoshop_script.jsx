// Function to create a new document with the specified settings
function createNewDocument(width, height, resolution, name) {
    return app.documents.add(
        width,                    // Width in pixels
        height,                   // Height in pixels
        resolution,               // Resolution in pixels/inch
        name,                     // Document name
        NewDocumentMode.RGB,      // RGB Color Mode
        DocumentFill.WHITE,       // Background fill (white)
        1,                        // Number of artboards (1 by default)
        BitsPerChannelType.EIGHT  // 8-bit Depth
    );
}

// Helper function to convert charID to typeID
function c2id(s) {
    return charIDToTypeID(s);
}

// Function to create a text box with left justification
function createTextBox(doc, content, fontSize, font, colorHex, boxWidth, boxHeight, posX, posY) {
    var textLayer = doc.artLayers.add();
    textLayer.kind = LayerKind.TEXT;
    var textItem = textLayer.textItem;

    // Set the text layer to be paragraph text (text box)
    textItem.kind = TextType.PARAGRAPHTEXT;

    // Define the bounds of the text box (width and height in inches)
    textItem.width = new UnitValue(boxWidth, "in");
    textItem.height = new UnitValue(boxHeight, "in");

    // Set the text properties: font and size
    textItem.font = font;  // Set the font to Arial (or any other specified font)
    textItem.size = new UnitValue(fontSize, "pt");  // Set the font size to specified size

    // Convert hex color to RGB and set it
    var r = parseInt(colorHex.substring(0, 2), 16);
    var g = parseInt(colorHex.substring(2, 4), 16);
    var b = parseInt(colorHex.substring(4, 6), 16);
    var color = new SolidColor();
    color.rgb.red = r;
    color.rgb.green = g;
    color.rgb.blue = b;
    textItem.color = color;

    // Set the position of the text box
    textItem.position = [new UnitValue(posX, "in"), new UnitValue(posY, "in")];

    // Set the text content
    textItem.contents = content;

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
}

// Set the document settings directly in pixels
var docWidthPixels = 2700;  // Width in pixels
var docHeightPixels = 3600; // Height in pixels
var resolution = 300;       // Resolution in pixels/inch
var fontSize = 12;          // Font size in points
var font = "ArialMT";       // Font type
var fontColorHex = "000000"; // Text color in hex
var textBoxWidth = 7;       // Text box width in inches
var textBoxHeight = 4;      // Text box height in inches
var textBoxX = 1;           // X position in inches
var textBoxY = 1;           // Y position in inches

// Set up file reading, ensuring the correct path
var scriptFolder = new Folder($.fileName).parent;
var inputFolder = new Folder(scriptFolder + '/output_paragraphs');
var files = inputFolder.getFiles('*.txt');

// Check if there are files in the folder
if (files.length === 0) {
    alert("No text files found in the output_paragraphs folder.");
} else {
    // Loop through each file and create a Photoshop document
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        
        // Read the contents of the file
        var fileRef = new File(file);
        fileRef.open('r');
        var fileContent = fileRef.read();
        fileRef.close();
        
        // Create a new document using the predefined settings
        var doc = createNewDocument(docWidthPixels, docHeightPixels, resolution, "Document_" + (i + 1));
        
        // Create a text box with left justification and the specified position
        createTextBox(doc, fileContent, fontSize, font, fontColorHex, textBoxWidth, textBoxHeight, textBoxX, textBoxY);

        // Save the document as PSD
        var saveFile = new File(inputFolder + "/Document_" + (i + 1) + ".psd");
        var saveOptions = new PhotoshopSaveOptions();
        doc.saveAs(saveFile, saveOptions, true, Extension.LOWERCASE);
        
        // Close the document
        doc.close(SaveOptions.DONOTSAVECHANGES);
    }
    alert("Documents created successfully.");
}
