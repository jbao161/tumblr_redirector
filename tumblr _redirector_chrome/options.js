function console_log(message){
 chrome.extension.getBackgroundPage().console.log(message);
}

function create_pattern(){
  let redirect_pattern = {
  url_from: document.getElementById("url_from_text").value,
  url_to: document.getElementById("url_to_text").value,
  }
  console_log("Accessing sync storage...");
  chrome.storage.sync.get({redirect_patterns:[]}, // define a key called redirect patterns and set its default value as empty array
  function(result){ // callback function. "result" is an API defined object containing all stored data. 
  // by setting a key called "redirect_patterns" it acquires an attribute "result.redirect_patterns"
  let redirect_patterns_array = result.redirect_patterns; // get a copy of the stored array. we need to add to it and then overwrite the old one.
  redirect_patterns_array.unshift(redirect_pattern); // add the new redirect pattern as an object to the front of the array
  chrome.storage.sync.set({redirect_patterns:redirect_patterns_array}, setItem()) // end chrome.storage.sync.set
  } // end chrome.storage.sync.get callback function
  ) //end chrome.storage.sync.get
}
function setItem() {
  console_log("Redirect pattern saved.");
}
function onError(error) {
  console.log(error)
}

function load_patterns(){
  console_log("Loading patterns");
  chrome.storage.sync.get({redirect_patterns:[]}, // define a key called redirect patterns and set its default value as empty array
  function(result){ // callback function. "result" is an API defined object containing all stored data. 
  // by setting a key called "redirect_patterns" it acquires an attribute "result.redirect_patterns"
  let redirect_patterns_array = result['redirect_patterns']; // get the stored array. we need to add to it and then overwrite the old one.
  
  for (saved_pattern in redirect_patterns_array){
	  show_pattern(saved_pattern);
	}
  }) // end chrome.storage.sync.get
}

function show_pattern(pattern) {
console_log("showing pattern");
console_log(pattern);
//Create an input type dynamically.
var url_from_textbox = document.createElement("input");
var url_to_textbox = document.createElement("input");

// set the text field to the saved pattern info
url_from_textbox.value = pattern['url_from'];
url_to_textbox.value = pattern['url_to'];

//Create Labels
var url_from_label = document.createElement("Label");
url_from_label.innerHTML = "URL from";     

//Assign different attributes to the element.
url_from_textbox.setAttribute("type", "text");
url_from_textbox.setAttribute("value", "");
url_from_textbox.setAttribute("name", "URL from label");
url_from_textbox.setAttribute("style", "width:200px");

url_from_label.setAttribute("style", "font-weight:normal");

var url_to_label = document.createElement("Label");
url_to_label.innerHTML = "URL to";     

//Assign different attributes to the element.
url_to_textbox.setAttribute("type", "text");
url_to_textbox.setAttribute("value", "");
url_to_textbox.setAttribute("name", "Test Name");
url_to_textbox.setAttribute("style", "width:200px");

url_to_label.setAttribute("style", "font-weight:normal");

// 'foobar' is the div id, where new fields are to be added
var redirects_container = document.getElementById("redirects_container");

//Append the element in page (in span).
redirects_container.appendChild(url_from_label);
add_linebreak(redirects_container);
redirects_container.appendChild(url_from_textbox);
add_linebreak(redirects_container);
redirects_container.appendChild(url_to_label);
add_linebreak(redirects_container);
redirects_container.appendChild(url_to_textbox);
add_linebreak(redirects_container);
add_linebreak(redirects_container);
}
function add_linebreak(container_element){
	let linebreak = document.createElement("br");
	container_element.appendChild(linebreak);
}
function eraseall(){
	chrome.storage.sync.set({redirect_patterns:[]}, function(){console_log("All patterns erased.")})
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("savebutton").addEventListener("click", create_pattern);
  document.getElementById("eraseall_button").addEventListener("click", eraseall);
  load_patterns();
});