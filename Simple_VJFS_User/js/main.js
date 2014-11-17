/**
* Function will retrieve the root URL for domain it's running on.
*
* @returns {string} : the currently root hostname
*/
function getHostRoot() {
	return location.protocol + '//' + location.hostname;
}