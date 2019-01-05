document.body.style.border = "5px solid blue";

// toggle log messages
function log(msg){
if (log_enabled) {
		console.log('Yo dawg check dis out: ' + msg);
	}
}
var log_enabled = true;

log("tumblr redirector");


// match pattern for the URLs to redirect
var pattern = "<all_urls>"

// redirect function
// returns an object with a property `redirectURL`
// set to the new URL
function redirect(details) {

  log("Redirecting: " + details.url);
  //Check if we're stuck in a loop where we keep redirecting this, in that
			//case ignore!
			var data = justRedirected[details.url];

			var threshold = 3000;
			if(!data || ((new Date().getTime()-data.timestamp) > threshold)) { //Obsolete after 3 seconds
				justRedirected[details.url] = { timestamp : new Date().getTime(), count: 1};
			} else {
				data.count++;
				justRedirected[details.url] = data;
				if (data.count >= redirectThreshold) {
					log('Ignoring ' + details.url + ' because we have redirected it ' + data.count + ' times in the last ' + threshold + 'ms');
					return {};
				} 
			}
			ignoreNextRequest["https://38.media.tumblr.com/tumblr_ldbj01lZiP1qe0eclo1_500.gif"] = new Date().getTime();
  return {
    redirectUrl: "https://38.media.tumblr.com/tumblr_ldbj01lZiP1qe0eclo1_500.gif"
  };
}

// i think we have to prevent endless redirects
//Cache of urls that have just been redirected to. They will not be redirected again, to
//stop recursive redirects, and endless redirect chains.
//Key is url, value is timestamp of redirect.
var ignoreNextRequest = {

};

//url => { timestamp:ms, count:1...n};
var justRedirected = {

};
var redirectThreshold = 3;
// add the listener,
// passing the filter argument and "blocking"
chrome.webRequest.onBeforeRequest.addListener(
  redirect,
  {urls:[pattern],types:["main_frame"]},
  ["blocking"]
);