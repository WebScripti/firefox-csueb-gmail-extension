var campusEmail = function () {
	//var prefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
	var show_popup_timer;
	var keep_popup_timer;
	
	var fire_tries = 0;
	var cur_email;
	var last_email;
	var email;
	var container_p;
	var xmlDoc;
	var xhttp;
	
	var canvas_frame;
	var container_td;
	var container_div;
	var container_p;
	var top_div;
	
	var registered = false;
	
	var initial_start = false;
	
	return {
		init : function () {
			//gBrowser.addEventListener("load", campusEmail.browserCheck, false);
			gBrowser.addEventListener("load", function () {
				if (content.window.location.toString().indexOf('https://mail.google.com/a/csueastbay.edu/') != -1 && content.document.getElementById("canvas_frame")){				
					canvas_frame = content.document.getElementById("canvas_frame").contentDocument;
					
					canvas_frame.body.removeEventListener('DOMNodeInserted', campusEmail.nodeInserted, false);
					canvas_frame.body.addEventListener('DOMNodeInserted', campusEmail.nodeInserted, false);
					
					// Assign my pretty stylesheet to main iframe
					var otherhead = canvas_frame.getElementsByTagName("head")[0];
					var link = canvas_frame.createElement("link");
					link.setAttribute("rel", "stylesheet");
					link.setAttribute("type", "text/css");
					link.setAttribute("href", "chrome://campusemail/skin/skin.css");
					otherhead.appendChild(link);
				}
				else{
					//setTimeout("campusEmail.initialize()",4000);
				}

			}, false);
		},

		run : function () {
			canvas_frame = content.document.getElementById("canvas_frame").contentDocument;
			top_div = canvas_frame.getElementsByClassName("tq")[0];
			container_td = canvas_frame.getElementsByClassName("tB")[0].parentNode;
			
			// If container is already there, clean elements
			campusEmail.powerCleanContainer();
			
			//if (email != last_email) {
				local_part = email.substr(0,email.indexOf('@csueastbay.edu'));
				//last_email = email;
				
				if (canvas_frame.getElementById('cg_container_div')){
					container_div = canvas_frame.getElementById('cg_container_div');
					//campusEmail.cleanContainer();
				}
				else {
					container_div = content.document.createElement('div');
					container_div.setAttribute('id','cg_container_div');
					container_div.setAttribute('class','tB');
					container_td.appendChild(container_div);// Starting loading image
				}
					
				var loadingImage = content.document.createElement('img');
				loadingImage.setAttribute('src','chrome://campusemail/skin/ajax-loader.gif');
				loadingImage.setAttribute('name','cg_loading_img');
				loadingImage.setAttribute('style','margin: 15px 0 10px 65px;');
				container_div.appendChild(loadingImage);
				
				//xhttp = new XMLHttpRequest();
				
				if (!xhttp)
					xhttp = new XMLHttpRequest();
				else if (xhttp.readyState != 0){
					debug('cancel request');
					xhttp.abort();
				}
				
				
				//debug(email);debug('connect');
				xhttp.open("GET", "http://adhayweb13.csueastbay.edu/wsapps/util/directory/query.php?email=" + local_part, true);
				
				xhttp.onreadystatechange = function() {	
					if (xhttp.readyState === 4) {  // Makes sure the document is ready to parse.
						canvas_frame = content.document.getElementById("canvas_frame").contentDocument;
						if (canvas_frame) {
							top_div = canvas_frame.getElementsByClassName("tq")[0];
							cont_div = canvas_frame.getElementsByClassName("tB")[0];
						}
						
						if (xhttp.status === 200 && top_div && cont_div) {  // Makes sure it's found the file.		
							var allText = xhttp.responseText;
							allText = allText.replace(/^<\?xml\s+version\s*=\s*(["'])[^\1]+\1[^?]*\?>/, "");
							try {
								container_div.removeChild(loadingImage);// Remove loading image
							}
							catch (err){
								//debug("e 0:"+err);
								//debug(err.description);
							}
							container_p = content.document.createElement('p');
							
							try {
								xmlDoc = new XML(allText);
							}
							catch(err){
								//debug("e 1:"+err);
								//debug(err.description);
								container_p.innerHTML += "&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;- Error -";
							}
							//debug('got response');
							//debug('here:'+xmlDoc.query);
									
							//campusEmail.cleanContainer();
							//var mytext = content.document.createTextNode("text");
							if (xmlDoc && xmlDoc.status == 'ok'){
								if (xmlDoc.results.*.length() == 1){
									container_p.innerHTML = campusEmail.displayResult(xmlDoc.results.result);
								}
								else {
									var cg_nav = content.document.createElement('div');
									cg_nav.setAttribute('id','cg_nav');
									//cg_nav.setAttribute('class','tB');
									
									var cg_gt_lt_cont = content.document.createElement('div');
									cg_gt_lt_cont.setAttribute('class','mA');
									
									var cg_gt = content.document.createElement('div');
									cg_gt.setAttribute('id','cg_gt');
									campusEmail.activateLink(cg_gt);
									cg_gt.innerHTML = "&gt;";
									
									var cg_lt = content.document.createElement('div');
									cg_lt.setAttribute('id','cg_lt');
									campusEmail.deactivateLink(cg_lt);
									cg_lt.innerHTML = "&lt;";
									
									cg_nav_content = content.document.createElement('div');
									campusEmail.printResults(cg_nav_content,1);
									
									cg_gt_lt_cont.appendChild(cg_gt);
									cg_gt_lt_cont.appendChild(cg_lt);
									cg_nav.appendChild(cg_gt_lt_cont);
									cg_nav.appendChild(cg_nav_content);
									
									
									container_p.innerHTML = campusEmail.displayResult(xmlDoc.results.result[0]);
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
							}// end if xmlDoc && xmlDoc.status == 'ok'
							else if (xmlDoc && xmlDoc.status == 'fail') {
								if (xmlDoc.error.code == '2')
									container_p.innerHTML += "&#160;&#160;&#160;&#160;&#160;- No result found -";
							}
							else {
								//debug("Damn! Something sucked!");
							}
												
						}// end if xhttp.status === 200
						else {
							//container_p.innerHTML += "&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;- Error -";
						}
						//debug('finally');
						try {
							if (cont_div) {
								 cur_email = cont_div.innerHTML.replace(/<(?:.|\s)*?>/g, "");
								 if (cur_email.indexOf(xmlDoc.query) > -1) {
									//debug('inside');
									campusEmail.powerCleanContainer();
									if (cg_nav)
										container_div.appendChild(cg_nav);
									container_div.appendChild(container_p);
									last_email = cur_email;
									//cur_email = email;
								}
							}
						}
						catch (err){
								debug("e 3:"+err);
								debug(err.description);
						}
						
					}// end if xhttp.readyState === 4
				}// end xhttp.function
				xhttp.send(null);
			/*}// end if cont_div.innerHTML.replace(/<(?:.|\s)*?>/g, "") != email
			else {
				//cur_email = email;
			}*/

		},
		
		nodeInserted : function () {
			if (this.getElementsByClassName("tB")[0]){
				cont_div = this.getElementsByClassName("tB")[0];
				cont_div.addEventListener('DOMSubtreeModified', campusEmail.treeModified, false);
				this.removeEventListener('DOMNodeInserted', campusEmail.nodeInserted, false);
			}
		},
		
		treeModified : function () {
			if (this) {
				debug('new call');
				email = this.innerHTML.replace(/<(?:.|\s)*?>/g, "");
				if (xhttp)
					debug('HTTP:'+xhttp.readyState);
				else
				debug('no HTTP');
				if (email == last_email && xhttp.readyState!=1 && xhttp.readyState!=2 && xhttp.readyState!=3) {
				}
				else if (email.indexOf('@csueastbay.edu') > 0)
					campusEmail.run();
				else {	
					campusEmail.powerCleanContainer();
					last_email = '';
					//cur_email = email;
				}
			}
		},
		
		cleanContainer : function () {
			if (canvas_frame.getElementById('cg_container_div') && email != cur_email)
				canvas_frame.getElementById('cg_container_div').innerHTML = "";
		},
		
		powerCleanContainer : function () {
			if (canvas_frame.getElementById('cg_container_div'))
				canvas_frame.getElementById('cg_container_div').innerHTML = "";
				
			//last_email = '';
		},
		
		/*removeContainer : function () {
			if (container_div = canvas_frame.getElementById('cg_container_div')){
				container_div.parentNode.removeChild(container_div);
				//last_email = "";
			}
		},*/
		
		displayResult : function (result) {
			//cur_email = email;
			var resultContent = '';
			if (result.phone.length()){
				var phone = result.phone.toString();
				resultContent += "Phone: " + phone.substring(0,3) + "-" + phone.substring(3,6) + "-" + phone.substring(6) + "<br/>";
			}
			if (result.cellular.length())
				resultContent += "Cellular: " + result.cellular + "<br/>";
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
			cg_div.addEventListener('mouseover', campusEmail.linkOver, false);
			cg_div.addEventListener('mouseout', campusEmail.linkOut, false);
			cg_div.addEventListener('click', campusEmail.changeResult, false);
		},
		
		deactivateLink : function (cg_div) {
			cg_div.setAttribute('class','mt');
			cg_div.removeEventListener('mouseover',campusEmail.linkOver,false);
			cg_div.removeEventListener('mouseout',campusEmail.linkOut,false);
			cg_div.removeEventListener('click',campusEmail.changeResult,false);
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
			var cur_res = Number(canvas_frame.getElementById("cg_cur_res").innerHTML);
			var results_length = xmlDoc.results.*.length();
			var target_res;
			if (this.innerHTML == "&gt;"){
				target_res = cur_res + 1;
				if (cur_res == 1)
					campusEmail.activateLink(this.nextSibling); // Activate previous link
				if (target_res == results_length)
					campusEmail.deactivateLink(this); // Deactivate next link
			}
			else {
				target_res = cur_res - 1;
				if (cur_res == results_length)
					campusEmail.activateLink(this.previousSibling);
				if (target_res == 1)
					campusEmail.deactivateLink(this);
			}
			container_p.innerHTML = campusEmail.displayResult(xmlDoc.results.result[target_res-1]);
			campusEmail.printResults(cg_nav_content,target_res);
		},
	
	};
}();
window.addEventListener("load", campusEmail.init, false);

function debug(aMsg) {
	setTimeout(function() { throw new Error("[debug] " + aMsg); }, 0);
}