/**
* Function will retrieve the root URL for domain it's running on.
*
* @returns {string} : the currently root hostname
*/
function getHostRoot() {
	return location.protocol + '//' + location.hostname;
}


/**
* Function will take an URL and a key parameter to search for,
* then for the given key return its value.
*/
function getURLParameter(url, parameter_key)
{
	var url_query_string = url.search.substring(1);
	var url_variables = url_query_string.split('&');

	for (var i = 0; i < url_variables.length; i++)
	{
		var pair = url_variables[i].split('=');
		if (pair[0] == parameter_key)
		{
			return pair[1];
		}
	}
}

/**
* Function will retrieve the root URL for where the APP resides.
*
* @returns {string} : the currently root url for the app
*/
function getAppRoot() {
	return getHostRoot() + '/apps/Simple_VJFS_User';
}

