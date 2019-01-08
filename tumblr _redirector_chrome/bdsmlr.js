
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
var blogname_regparser = new RegExp ("(^[^.]*).tumblr.com"); // capture name of blog preceding ".tumblr.com"

// callback function
// returns an object with a property `redirectURL`
// set to the new URL
function redirect(details) {
	let oldurl = details.url;
	let newurl = oldurl;
	
	// Ignore endless redirects to the same url
	let data = justRedirected[newurl];

	let threshold = 1000; // time in milliseconds to block same redirets
	if(!data || ((new Date().getTime()-data.timestamp) > threshold)) { 
		justRedirected[newurl] = { timestamp : new Date().getTime(), count: 1};
	} else {
		justRedirected[newurl] = data;
		if (data.count >= redirectThreshold) {
			log('Ignoring ' + newurl + ' because we have encountered it ' + data.count + ' times in the last ' + threshold + 'ms');
			return {};
		}
		data.count++;
	}
	ignoreNextRequest[newurl] = new Date().getTime();
	// get the domain name of source page
	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
		let source_url = tabs[0].url;
		log("url of the source page is " + source_url);
		let url = new URL(source_url);
		let domain = url.hostname;
		log("domain name of the source page is " + domain);
		let parsed_domainurl = blogname_regparser.exec(domain);
		let blogname_regparsed = parsed_domainurl[1];
		log("blog name of the source page is " + blogname_regparsed);
	});
	// change the URL of the picture to 1280 size
	let parsedurl = regparser.exec(oldurl);
	if (parsedurl!==null){
		newurl=oldurl.replace(regparser, "$11280$3$4");
		log("Redirecting: " + oldurl);
	}
	log("RegEx pattern matching results: "+ parsedurl);

	
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
// reference: https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/webRequest/onBeforeRequest
chrome.webRequest.onBeforeRequest.addListener(
  redirect,
  {urls:[pattern],types:["main_frame"]},
  ["blocking"]
);