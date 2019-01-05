document.body.style.border = "5px solid red";

// toggle log messages
function log(msg){
if (log_enabled) {
		console.log('Yo dawg check dis out: ' + msg);
	}
}
var log_enabled = true;

log("tumblr redirector");

// match pattern for the URLs to redirect
var urlpattern = "https://*";
var regpattern = "(^https?://[^.]*.media.tumblr.com/[^/]*/[^_]*_[^_]*_)([0-9]*)(.)(jpg|png)$";
let regex_parser = new RegExp(regpattern);
// redirect function
// returns an object with a property `redirectURL`
// set to the new URL
function redirect(requestDetails) {
	let oldurl= requestDetails.url;
	log(oldurl);
	let parsedurl = regex_parser.exec(oldurl);
	if (parsedurl!==null){

		//log(oldurl.match(regex_parser));
		// change the image size to 1280
		let newurl = oldurl.replace(regex_parser, "$11280$3$4");
		log("Redirecting: " + oldurl + " to " + newurl);
		return {
		redirectUrl: newurl
		};
	} else {
		log( "url didn't match the pattern");
	}
}

// add the listener,
// passing the filter argument and "blocking"
chrome.webRequest.onBeforeRequest.addListener(
  redirect,
  {urls:[urlpattern],types:["main_frame"]},
  ["blocking"]
  );
