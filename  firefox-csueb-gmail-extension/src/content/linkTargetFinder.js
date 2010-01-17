var linkTargetFinder = function () {
	//var prefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
	return {
		init : function () {
			gBrowser.addEventListener("load", function () {
				var autoRun = prefManager.getBoolPref("extensions.linktargetfinder.autorun");
				if (autoRun) {
					linkTargetFinder.run();
				}
			}, false);
		},

		run : function () {
			
			var xhttp = new XMLHttpRequest();
			xhttp.open("GET", "http://www-test.csueastbay.edu/wsapps/util/directory/query.php", true);
			xhttp.onreadystatechange = function() {
			if (xhttp.readyState === 4) {  // Makes sure the document is ready to parse.
				if (xhttp.status === 200) {  // Makes sure it's found the file.
					//allText = xhttp.responseText;
					xmlDoc = xhttp.responseXML;
					//alert(allText);
			alert("HEY");
					//parser=new DOMParser();
					//xmlDoc=parser.parseFromString(allText,"text/xml");
					if (xmlDoc.getElementsByTagName("status")[0].childNodes[0].nodeValue == 'true')
						alert("Good response!");
					else
						alert("Damn! Something sucked!");
					
					//lines = txtFile.responseText.split("\n"); // Will separate each line into an array
					}
				}
			}
			xhttp.send(null);
			
		}
	};
}();
//window.addEventListener("load", linkTargetFinder.init, false);


function test_fnc(){
	textXML = "<?xml version=\"1.0\"?><result><status>true</status><phone>5108857408</phone><location>WA 700</location></result>";
	parser=new DOMParser();
	xmlDoc=parser.parseFromString(textXML,"text/xml");
	if (xmlDoc.getElementsByTagName("status")[0].childNodes[0].nodeValue == 'true')
		alert("Good response!");
	else
		alert("Damn! Something sucked!");

}