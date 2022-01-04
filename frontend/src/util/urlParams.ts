export function updateURLParameter(param: string, paramVal: string | number): void {
	const url = window.location.href;
	let TheAnchor = null;
	let newAdditionalURL = '';
	let tempArray = url.split('?');
	let baseURL = tempArray[0];
	let additionalURL = tempArray[1];
	let temp = '';

	if (additionalURL) {
		const tmpAnchor = additionalURL.split('#');
		const TheParams = tmpAnchor[0];
		TheAnchor = tmpAnchor[1];
		if (TheAnchor) additionalURL = TheParams;

		tempArray = additionalURL.split('&');

		for (let i = 0; i < tempArray.length; i++) {
			if (tempArray[i].split('=')[0] != param.toLowerCase()) {
				newAdditionalURL += temp + tempArray[i];
				temp = '&';
			}
		}
	} else {
		const tmpAnchor = baseURL.split('#');
		const TheParams = tmpAnchor[0];
		TheAnchor = tmpAnchor[1];

		if (TheParams) baseURL = TheParams;
	}

	if (typeof paramVal == 'string') {
		paramVal = paramVal.toLowerCase();
	}

	if (TheAnchor) paramVal += '#' + TheAnchor;

	const rows_txt = temp + '' + param.toLowerCase() + '=' + paramVal;
	window.history.replaceState('', '', baseURL + '?' + newAdditionalURL + rows_txt);
}

export function getUrlParam(param: string): string {
	// get url Param (param) from url params
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get(param.toLowerCase());
}

export function removeUrlParam(param: string): void {
	// remove url param from url
	const urlParams = new URLSearchParams(window.location.search);
	urlParams.delete(param.toLowerCase());
	window.history.replaceState('', '', window.location.pathname + '?' + urlParams.toString());
}
