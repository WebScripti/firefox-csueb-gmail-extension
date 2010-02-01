var linkTargetFinder = function () {
	//var prefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
	var show_popup_timer;
	var keep_popup_timer;
	
	var fire_tries = 0;
	//var last_email;
	var container_p;
	var xmlDoc;
	
	var canvas_frame;
	var container_td;
	var container_div;
	var container_p;
	var top_div;
	
	var registered = false;
	
	return {
		init : function () {
			gBrowser.addEventListener("load", function () {
				
				
				if (content.document.getElementById("canvas_frame")){
					if (!canvas_frame)
						canvas_frame = content.document.getElementById("canvas_frame").contentDocument;
					
					// Assign my pretty stylesheet to main iframe
					var otherhead = canvas_frame.getElementsByTagName("head")[0];
					var link = canvas_frame.createElement("link");
					link.setAttribute("rel", "stylesheet");
					link.setAttribute("type", "text/css");
					link.setAttribute("href", "chrome://csuebgmail/skin/skin.css");
					otherhead.appendChild(link);

					var span_zF = canvas_frame.getElementsByClassName("zF");	
					var span_yP = canvas_frame.getElementsByClassName("yP");	
					if (span_zF) {
						for (i=0; i<span_zF.length; i++){
							//span_zF[i].addEventListener("mouseover", function() {popup_timer = setTimeout(linkTargetFinder.fireTool,1004,this);}, false);
							//span_zF[i].addEventListener("mouseout", function() {clearTimeout(popup_timer);}, false);
							span_zF[i].addEventListener("mouseover", linkTargetFinder.nameMouseOver, false);
							span_zF[i].addEventListener("mouseover", linkTargetFinder.clearTriggerRemover, false);
							span_zF[i].addEventListener("mouseout", linkTargetFinder.nameMouseOut, false);
							span_zF[i].addEventListener("mouseout", linkTargetFinder.triggerRemover, false);
						}
					}
					if (span_yP) {
						for (i=0; i<span_yP.length; i++){
							//span_yP[i].addEventListener("mouseover", function() {popup_timer = setTimeout(linkTargetFinder.fireTool,1004,this);}, false);
							//span_yP[i].addEventListener("mouseout", function() {clearTimeout(popup_timer);}, false);
							span_yP[i].addEventListener("mouseover", linkTargetFinder.nameMouseOver, false);
							span_yP[i].addEventListener("mouseover", linkTargetFinder.clearTriggerRemover, false);
							span_yP[i].addEventListener("mouseout", linkTargetFinder.nameMouseOut, false);
							span_yP[i].addEventListener("mouseout", linkTargetFinder.triggerRemover, false);
						}
					}
					
					
					

				}
				else{
					//setTimeout("linkTargetFinder.initialize()",4000);
				}

			}, false);
		},

		run : function (cont_span) {
			if (!canvas_frame)
				canvas_frame = content.document.getElementById("canvas_frame").contentDocument;
			if (!top_div)
				top_div = canvas_frame.getElementsByClassName("tq")[0];
			var email = cont_span.getAttribute('email');
			if (!container_td)
				container_td = canvas_frame.getElementsByClassName("tB")[0].parentNode;
			
			// If container is already there, clean elements
			if (container_div = canvas_frame.getElementById('cg_container_div')){
				container_div.parentNode.removeChild(container_div);
				//last_email = "";
			}

			// Add listeners to remove content box
			if (!registered) {
				top_div.addEventListener("mouseover", linkTargetFinder.clearTriggerRemover, false);
				top_div.addEventListener("mouseout", linkTargetFinder.triggerRemover, false);
				top_div.addEventListener("DOMSubtreeModified", function() {debug('DOMSubtreeModified')}, false);
				top_div.addEventListener("DOMNodeInserted", function () {debug('DOMNodeInserted')}, false);
				top_div.addEventListener("DOMNodeRemoved", function () {debug('DOMNodeRemoved')}, false);
				top_div.addEventListener("DOMFocusIn", function () {debug('DOMFocusIn')}, false);
				top_div.addEventListener("DOMFocusOut", function () {debug('DOMFocusOut')}, false);
				top_div.addEventListener("DOMActivate", function () {debug('DOMActivate')}, false);
				
				
				
				
				registered = true;
			}
			
			

			// If container is already there, clean elements
			/*if (container_div && email != last_email) {
				container_div.parentNode.removeChild(container_div);
				last_email = "";
			}*/
			
			
			if (email.indexOf('@csueastbay.edu') > 0) {
				//last_email = email;
		
				container_div = content.document.createElement('div');
				container_div.setAttribute('id','cg_container_div');
				container_div.setAttribute('class','tB');
				container_td.appendChild(container_div);// Starting loading image
					
				var loadingImage = content.document.createElement('img');
				loadingImage.setAttribute('src','chrome://csuebgmail/skin/ajax-loader.gif');
				loadingImage.setAttribute('name','cg_loading_img');
				loadingImage.setAttribute('style','margin: 15px 0 10px 65px;');
				container_div.appendChild(loadingImage);
				
				var xhttp = new XMLHttpRequest();

				xhttp.open("GET", "http://www-test.csueastbay.edu/wsapps/util/directory/query.php?email=" + email, true);
				xhttp.onreadystatechange = function() {	
					if (xhttp.readyState === 4) {  // Makes sure the document is ready to parse.
						
						if (xhttp.status === 200) {  // Makes sure it's found the file.					
							var allText = xhttp.responseText;
							allText = allText.replace(/^<\?xml\s+version\s*=\s*(["'])[^\1]+\1[^?]*\?>/, "");
							container_div.removeChild(loadingImage);// Remove loading image
							container_p = content.document.createElement('p');
							
							try {
								xmlDoc = new XML(allText);
							}
							catch(err){
								debug(err);
								debug(err.description);
								container_p.innerHTML += "&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;- Error -";
							}
									
								
							//var mytext = content.document.createTextNode("text");
							if (xmlDoc && xmlDoc.status == 'ok'){
								if (xmlDoc.results.*.length() == 1){
									container_p.innerHTML = linkTargetFinder.displayResult(xmlDoc.results.result);
								}
								else {
									var cg_nav = content.document.createElement('div');
									cg_nav.setAttribute('id','cg_nav');
									//cg_nav.setAttribute('class','tB');
									
									var cg_gt_lt_cont = content.document.createElement('div');
									cg_gt_lt_cont.setAttribute('class','mA');
									
									var cg_gt = content.document.createElement('div');
									cg_gt.setAttribute('id','cg_gt');
									linkTargetFinder.activateLink(cg_gt);
									cg_gt.innerHTML = "&gt;";
									
									var cg_lt = content.document.createElement('div');
									cg_lt.setAttribute('id','cg_lt');
									linkTargetFinder.deactivateLink(cg_lt);
									cg_lt.innerHTML = "&lt;";
									
									cg_nav_content = content.document.createElement('div');
									//cg_nav_content.setAttribute('class','tB');
									//cg_nav_content.innerHTML = 'Results: <span style="color: #0f3b86" id="cg_cur_res">1</span>';
									linkTargetFinder.printResults(cg_nav_content,1);
									
									cg_gt_lt_cont.appendChild(cg_gt);
									cg_gt_lt_cont.appendChild(cg_lt);
									cg_nav.appendChild(cg_gt_lt_cont);
									cg_nav.appendChild(cg_nav_content);
									container_div.appendChild(cg_nav);
									
									container_p.innerHTML = linkTargetFinder.displayResult(xmlDoc.results.result[0]);
									/*<div class="tB" id="cg_nav">
										<div class="mA">
											<div class="ms" id="cg_gt" onmouseover="this.className = 'mu';" onmouseout="this.className = 'ms';">
											&gt;
											</div>
											<div class="mt" id="cg_lt">
											&lt;
											</div>
										 </div>
										 <div id="cg_nav_content">
											Results: <span style="color: #0f3b86">1</span> 2
										 </div>
									 </div>*/
									
									
									
									
								}
							}
							else if (xmlDoc && xmlDoc.status == 'fail') {
								if (xmlDoc.error.code == '2')
									container_p.innerHTML += "&#160;&#160;&#160;&#160;&#160;- No result found -";
							}
							else {
								debug("Damn! Something sucked!");
							}

							container_div.appendChild(container_p);
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
				if (fire_tries++ < 15)
					setTimeout(linkTargetFinder.fireTool,50,obj);
			}
		},
		
		nameMouseOver : function () {
			show_popup_timer = setTimeout(linkTargetFinder.fireTool,1004,this);		
		},
		
		nameMouseOut : function () {
			clearTimeout(show_popup_timer);		
		},
		
		triggerRemover : function () {
			//popup_timer = setTimeout(linkTargetFinder.containerRemove,0);
			keep_popup_timer = setTimeout(linkTargetFinder.containerRemove,200);
		},
		clearTriggerRemover : function () {
			//clearTimeout(popup_timer);
			clearTimeout(keep_popup_timer);
		},
		
		containerRemove : function () {
			//var container_td = content.document.getElementById("canvas_frame").contentDocument.getElementsByClassName("tB")[0].parentNode;
			//var container_div = content.document.getElementById("canvas_frame").contentDocument.getElementById('cg_container_div');
			//var top_div = content.document.getElementById("canvas_frame").contentDocument.getElementsByClassName("tq")[0];
			
			if (container_div && container_div.parentNode==container_td){
				container_td.removeChild(container_div);
				//top_div.removeEventListener('mouseout',linkTargetFinder.triggerRemover,false);
				//top_div.removeEventListener('mouseover',linkTargetFinder.clearTriggerRemover,false);
			}
		},
		
		displayResult : function (result) {
			var resultContent = '';
			if (result.phone.length()){
				var phone = result.phone.toString();
				resultContent += "Phone: " + phone.substring(0,3) + "-" + phone.substring(3,6) + "-" + phone.substring(6) + "<br/>";
			}
			if (result.cellular.length())
				resultContent += result.cellular + "<br/>";
			if (result.location.length())
				resultContent += "Location: " + result.location + "<br/>";
			if (result.title.length())
				resultContent += "Title: " + result.title + "<br/>";
			if (result.note.length())
				resultContent += "Note: " + result.note + "<br/>";
				
			return resultContent;
		},
		
		linkOver : function () {
			this.className = 'mu';
		},
		
		linkOut : function () {
			this.className = 'ms';
		},
		
		activateLink : function (cg_div) {
			cg_div.setAttribute('class','ms');
			cg_div.addEventListener('mouseover', linkTargetFinder.linkOver, false);
			cg_div.addEventListener('mouseout', linkTargetFinder.linkOut, false);
			cg_div.addEventListener('click', linkTargetFinder.changeResult, false);
		},
		
		deactivateLink : function (cg_div) {
			cg_div.setAttribute('class','mt');
			cg_div.removeEventListener('mouseover',linkTargetFinder.linkOver,false);
			cg_div.removeEventListener('mouseout',linkTargetFinder.linkOut,false);
			cg_div.removeEventListener('click',linkTargetFinder.changeResult,false);
		},
		
		printResults : function (cg_div, cur_res) {
			cg_div.innerHTML = 'Results: ';
			for (var i=1; i<=xmlDoc.results.*.length(); i++){
				if (i == cur_res)
					cg_div.innerHTML += '<span style="color: #0f3b86" id="cg_cur_res">' + i + '</span>';
				else
					cg_div.innerHTML += i;
				cg_div.innerHTML += ' ';
			}
		},
		
		changeResult : function () {
			//var canvas_frame = content.document.getElementById("canvas_frame").contentDocument;
			var cur_res = Number(canvas_frame.getElementById("cg_cur_res").innerHTML);
			var results_length = xmlDoc.results.*.length();
			var target_res;
			if (this.innerHTML == "&gt;"){
				target_res = cur_res + 1;
				if (cur_res == 1)
					linkTargetFinder.activateLink(this.nextSibling); // Activate previous link
				if (target_res == results_length)
					linkTargetFinder.deactivateLink(this); // Deactivate next link
			}
			else {
				target_res = cur_res - 1;
				if (cur_res == results_length)
					linkTargetFinder.activateLink(this.previousSibling);
				if (target_res == 1)
					linkTargetFinder.deactivateLink(this);
			}
			container_p.innerHTML = linkTargetFinder.displayResult(xmlDoc.results.result[target_res-1]);
			linkTargetFinder.printResults(cg_nav_content,target_res);
		},
	
	};
}();
window.addEventListener("load", linkTargetFinder.init, false);

function debug(aMsg) {
	setTimeout(function() { throw new Error("[debug] " + aMsg); }, 0);
}