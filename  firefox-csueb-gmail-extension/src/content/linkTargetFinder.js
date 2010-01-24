var linkTargetFinder = function () {
	//var prefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
	var popup_timer;
	var fire_tries = 0;
	var last_email;
	
	return {
		init : function () {
			gBrowser.addEventListener("load", function () {
															
				if (content.document.getElementById("canvas_frame")){
					var span_zF = content.document.getElementById("canvas_frame").contentDocument.getElementsByClassName("zF");	
					var span_yP = content.document.getElementById("canvas_frame").contentDocument.getElementsByClassName("yP");	
					if (span_zF) {
						for (i=0; i<span_zF.length; i++){
							span_zF[i].addEventListener("mouseover", function() {popup_timer = setTimeout(linkTargetFinder.fireTool,1004,this);}, false);
							span_zF[i].addEventListener("mouseout", function() {clearTimeout(popup_timer);}, false);
						}
					}
					if (span_yP) {
						for (i=0; i<span_yP.length; i++){
							span_yP[i].addEventListener("mouseover", function() {popup_timer = setTimeout(linkTargetFinder.fireTool,1004,this);}, false);
							span_yP[i].addEventListener("mouseout", function() {clearTimeout(popup_timer);}, false);
						}
					}
					
					
					

				}
				else{
					//setTimeout("linkTargetFinder.initialize()",4000);
				}

			}, false);
		},

		run : function (cont_span) {
			
			var email = cont_span.getAttribute('email');
			var container_td = content.document.getElementById("canvas_frame").contentDocument.getElementsByClassName("tB")[0].parentNode;
			var container_div = content.document.getElementById("canvas_frame").contentDocument.getElementById('cg_container_div');
			
			// Add listeners to remove content box
			//var top_div = content.document.getElementById("canvas_frame").contentDocument.getElementsByClassName("tq")[0];
			//top_div.addEventListener("mouseover", linkTargetFinder.clearTriggerRemover, false);
			//top_div.addEventListener("mouseout", linkTargetFinder.triggerRemover, false);

			// If container is already there, clean elements
			if (container_div && email != last_email) {
				container_div.parentNode.removeChild(container_div);
				last_email = "";
			}
			
			
			if (email.indexOf('@csueastbay.edu') > 0 && email != last_email) {
				last_email = email;
		
				var container_div = content.document.createElement('div');
				container_div.setAttribute('id','cg_container_div');
				container_div.setAttribute('class','tB');
				container_td.appendChild(container_div);// Starting loading image
					
				var loadingImage = content.document.createElement('img');
				loadingImage.setAttribute('src','chrome://csuebgmail/skin/ajax-loader.gif');
				loadingImage.setAttribute('name','cg_loading_img');
				loadingImage.setAttribute('style','margin: 15px 0 10px 65px;');
				container_div.appendChild(loadingImage);
				
				var xhttp = new XMLHttpRequest();

				xhttp.open("GET", "http://www-test.csueastbay.edu/wsapps/util/directory/query.php?email=cagdas.cubukcu@csueastbay.edu", true);
				xhttp.onreadystatechange = function() {	
					if (xhttp.readyState === 4) {  // Makes sure the document is ready to parse.
						
						if (xhttp.status === 200) {  // Makes sure it's found the file.
							//textXML = "<result><status>true</status><phone>5108857408</phone><location>WA 700</location></result>";
							//var xmlDoc = new XML(textXML); 
							
							var allText = xhttp.responseText;
							allText = allText.replace(/^<\?xml\s+version\s*=\s*(["'])[^\1]+\1[^?]*\?>/, "");
							var xmlDoc = new XML(allText);
							
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
			}
			
			
		
		},
		
		fireTool : function (obj) {
			if (content.document.getElementById("canvas_frame").contentDocument.getElementsByClassName("tB")[0]){
				fire_tries = 0;
				linkTargetFinder.run(obj);
			}
			else {
				if (fire_tries++ < 10)
					setTimeout(linkTargetFinder.fireTool,50,obj);
			}
		},
		
		/*triggerRemover : function () {
			popup_timer = setTimeout(linkTargetFinder.containerRemove,100);
		},
		clearTriggerRemover : function () {
			clearTimeout(popup_timer);
		},*/
		containerRemove : function () {
			var container_td = content.document.getElementById("canvas_frame").contentDocument.getElementsByClassName("tB")[0].parentNode;
			var container_div = content.document.getElementById("canvas_frame").contentDocument.getElementById('cg_container_div');
			var top_div = content.document.getElementById("canvas_frame").contentDocument.getElementsByClassName("tq")[0];
			
			if (container_td&&container_div){
				container_td.removeChild(container_div);
				top_div.removeEventListener('mouseout',linkTargetFinder.triggerRemover,false);
				top_div.removeEventListener('mouseover',linkTargetFinder.clearTriggerRemover,false);
			}
		},
		

	
	};
}();
window.addEventListener("load", linkTargetFinder.init, false);
