var linkTargetFinder = function () {
	//var prefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
	var popup_timer;
	
	return {
		init : function () {
			/*gBrowser.addEventListener("load", function () {
				var autoRun = prefManager.getBoolPref("extensions.linktargetfinder.autorun");
				if (autoRun) {
					linkTargetFinder.run();
				}
			}, false);*/
			gBrowser.addEventListener("load", function () {
															
				if (content.document.getElementById("canvas_frame")){
					//alert("canvas");
					var froms = content.document.getElementById("canvas_frame").contentDocument.getElementsByClassName("zF");	
					var froms2 = content.document.getElementById("canvas_frame").contentDocument.getElementsByClassName("yP");	
					if (froms) {
						for (i=0; i<froms.length; i++){
							froms[i].addEventListener("mouseover", function() {popup_timer = setTimeout("linkTargetFinder.fireTool()",1400);}, false);
							froms[i].addEventListener("mouseout", function() {clearTimeout(popup_timer);}, false);
						}
					}
					else
						alert("Couldn't find any forms");
						
					if (froms2) {
						for (i=0; i<froms2.length; i++){
							froms2[i].addEventListener("mouseover", function() {popup_timer = setTimeout("linkTargetFinder.fireTool()",1400);}, false);
							froms2[i].addEventListener("mouseout", function() {clearTimeout(popup_timer);}, false);
						}
					}
					else
						alert("Couldn't find any forms2");
				}
				else{
					//setTimeout("linkTargetFinder.initialize()",4000);
				
					//alert("Couldn't find any canvas");
				}

			}, false);
		},

		run : function () {
			var container_td = content.document.getElementById("canvas_frame").contentDocument.getElementsByClassName("tB")[0].parentNode;
			var container_div = content.document.createElement('div');
			container_div.setAttribute('id','container_div');
			container_div.setAttribute('class','tB');
			container_td.appendChild(container_div);// Starting loading image
			
			var loadingImage = content.document.createElement('img');
			loadingImage.setAttribute('src','chrome://csuebgmail/skin/ajax-loader.gif');
			loadingImage.setAttribute('id','loading-image');
			loadingImage.setAttribute('style','margin: 15px 0 10px 65px;');
			container_div.appendChild(loadingImage);
			
			var xhttp = new XMLHttpRequest();
			xhttp.open("GET", "http://www-test.csueastbay.edu/wsapps/util/directory/query.php", true);
			xhttp.onreadystatechange = function() {
			if (xhttp.readyState === 4) {  // Makes sure the document is ready to parse.
				//console.log("XHTTP Status:" + xhttp.status);
				
				if (xhttp.status === 200) {  // Makes sure it's found the file.
					//textXML = "<result><status>true</status><phone>5108857408</phone><location>WA 700</location></result>";
					//var xmlDoc = new XML(textXML); 
					
					var allText = xhttp.responseText;
					allText = allText.replace(/^<\?xml\s+version\s*=\s*(["'])[^\1]+\1[^?]*\?>/, "");
					var xmlDoc = new XML(allText);

					//console.log("XML return:" + xmlDoc.status);
					
					//parser=new DOMParser();
					//xmlDoc=parser.parseFromString(allText,"text/xml");
					if (xmlDoc.status == 'true'){
						container_div.removeChild(loadingImage);// Remove loading image
						container_div.innerHTML = "<p>Phone: "+ xmlDoc.phone + "<br/>Location: " + xmlDoc.location + "</p>";
					}
					else
						alert("Damn! Something sucked!");
					
					}
				}
			}
			xhttp.send(null);
			
		},
		
		fireTool : function () {
			linkTargetFinder.run();
		},
		

	
	};
}();

/*var popup_timer;
function fireTool() {
	linkTargetFinder.run();
}
	
window.onload = function() {
	var froms = document.getElementById("canvas_frame").contentDocument.getElementsByClassName("zF");

	for (i=0; i<froms.length; i++){
		froms[i].addEventListener("mouseover", function() {console.log("mouseover");popup_timer = setTimeout("fireTool()",1400);}, false);
		froms[i].addEventListener("mouseout", function() {console.log("mouseout");clearTimeout(popup_timer);}, false);
	}
}*/

window.addEventListener("load", linkTargetFinder.init, false);


/*function test_fnc(){
	textXML = "<?xml version=\"1.0\"?><result><status>true</status><phone>5108857408</phone><location>WA 700</location></result>";
	parser=new DOMParser();
	xmlDoc=parser.parseFromString(textXML,"text/xml");
	if (xmlDoc.getElementsByTagName("status")[0].childNodes[0].nodeValue == 'true')
		alert("Good response!");
	else
		alert("Damn! Something sucked!");

}*/