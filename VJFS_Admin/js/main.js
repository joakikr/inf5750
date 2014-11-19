/**
 * Adding an isEmpty prototype for String
 */
String.prototype.isEmpty = function() {
	return (this.length === 0 || !this.trim());
};

/**
 * Function will retrieve the root URL for domain it's running on.
 *
 * @returns {string} : the currently root hostname
 */
function getHostRoot() {
	return location.protocol + '//' + location.hostname;
}

/**
 * Function will retrieve the root URL for where the APP resides.
 *
 * @returns {string} : the currently root url for the app
 */
function getAppRoot() {
	return getHostRoot() + '/apps/VJFS_Admin';
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
 * Function will return an unique ID
 */
function getUniqueID() {
	var time = new Date().getTime();
	while (time == new Date().getTime());
	return new Date().getTime();
}

/**
 * Function will setup an instance of the "bloodhound" suggstioner and return it.
 *
 * @param div_id is the id of the div to add on bloodhound
 * @param name is the name used for this instance
 * @param data is the array of objects to use for suggestion
 * @param display_key_function is a function that will return what to display from an object from the data array
 * @param suggestion_function is a function that will return what to display in suggestion box from an object from the data array
 */
function setupBloodHound(div_id, name, data, display_key_function, suggestion_function) {
	var bh = new Bloodhound({
		datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		local: data
	});

	// kicks off the loading/processing of `local` and `prefetch`
	bh.initialize();

	$('#' + div_id + ' .typeahead').typeahead(
		{
			hint: true,
			highlight: true,
			minLength: 1
		},
		{
			name: name,
			displayKey: display_key_function,
			// `ttAdapter` wraps the suggestion engine in an adapter that
			// is compatible with the typeahead jQuery plugin
			source: bh.ttAdapter(),
			templates :

			{
				suggestion: suggestion_function
			}
		});

	return bh;
}

/**
 * Function will check if the user currently trying to access app
 * has the right privilege level (admin or if groups can be created: customizer)
 *
 * If user is admin, then handler function is called
 */
function isCustomizer(handler) {
	// Create URL to fetch user data from (was not possible to use "fields" and "filters" here?)
	// If so then last part of URL would be: /api/me.json?fields=userCredentials[userAuthorityGroups]
	var url = getHostRoot() + '/api/me';

	// Get information as json object
	$.ajax({
		url: url,
		dataType: 'json'
	}).success(function(user) {

		var isSuperUser = false;

		if(user.hasOwnProperty('userCredentials')) {
			// Someone logged in,
			// Need to check if user is "Superuser"
			var authority_groups = user['userCredentials']['userAuthorityGroups'];

			for(key in authority_groups) {
				if(authority_groups[key]['name'] === 'Superuser') {
					// This is a super user!
					isSuperUser = true;
					break;
				}
			}
		}


		if(isSuperUser) {
			// Here we have a super user, call handler function
			handler(true);
		} else {
			handler(false);
		}
	});
}