

export interface SearchParam {
	key:string;
	value:string|undefined;
}

export function constructSearchParams(searchParams:SearchParam[]) {
	let queryString:string = "";
	let first = true;
	for (let i = 0; i < searchParams.length; i++) {
		
		if (!searchParams[i].value) {
			continue;
		}
		
		if (first) {
			queryString += "?";
			first = false;
		} else {
			queryString += "&";
		}
		queryString += searchParams[i].key + "=" + searchParams[i].value;
	}
	return encodeURI(queryString);
}