
// toggle log messages
function log(msg){
if (log_enabled) {
		console.log('Tumblr Redirector: ' + msg);
	}
}
var log_enabled = true;

log("Tumblr Redirector is on.");

// match pattern for the URLs to redirect
var pattern = "<all_urls>"
var regparser = new RegExp("(^https?://[^.]*.media.tumblr.com/[^/]*/[^_]*_[^_]*_)([0-9]*)(.)(jpg|png)$");


// redirect callback function
// returns an object with a property `redirectURL`
// set to the new URL
function redirect(details) {
	let oldurl = details.url;
	let newurl = oldurl;
	
	// Ignore endless redirects to the same url
	var data = justRedirected[newurl];

	var threshold = 1000; // time in milliseconds to block same redirets
	if(!data || ((new Date().getTime()-data.timestamp) > threshold)) { 
		justRedirected[newurl] = { timestamp : new Date().getTime(), count: 1};
	} else {
		justRedirected[newurl] = data;
		if (data.count >= redirectThreshold) {
			log('Ignoring ' + newurl + ' because we have redirected it ' + data.count + ' times in the last ' + threshold + 'ms');
			return {};
		}
		data.count++;
	}
	ignoreNextRequest[newurl] = new Date().getTime();
	
	// change the URL of the picture to 1280 size
	let parsedurl = regparser.exec(oldurl);
	if (parsedurl!==null){
		newurl=oldurl.replace(regparser, "$11280$3$4");
	}
	log("results of pattern mathing: "+ parsedurl);
	log("Redirecting: " + oldurl);
	
	return {
    redirectUrl: newurl
  };
}

//Cache of urls that have just been redirected to. They will not be redirected again, to
//stop recursive redirects, and endless redirect chains.
//Key is url, value is timestamp of redirect.
var ignoreNextRequest = {

};

//url => { timestamp:ms, count:1...n};
var justRedirected = {

};
var redirectThreshold = 1; // how many repeat redirects to the same URL allowed

// this is the main listener function that handles redirects
// see https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/webRequest/onBeforeRequest
chrome.webRequest.onBeforeRequest.addListener(
  redirect,
  {urls:[pattern],types:["main_frame"]},
  ["blocking"]
);