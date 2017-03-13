'use strict';

require('whatwg-fetch');
const ReactDOM = require('react-dom');

const dictToSortedQueryStr = function (dict) {
	let keys = Object.keys(dict);
	keys.sort();
	let paramList = [];
	for (let idx = 0; idx < keys.length; ++idx) {
		const k = keys[idx];
		const v = dict[k];
		paramList.push(k + "=" + encodeURIComponent(v));
	}
	return paramList.join('&');
};

const httpGet = function (url, paramsDict) {
	if (!paramsDict || Object.keys(paramsDict).length == 0) return fetch(url, {
		credentials: 'same-origin',
	});
	const concatenated = url + "?" + dictToSortedQueryStr(paramsDict);
	return fetch(concatenated, {
		credentials: 'same-origin',
	});
};

const getRenderedComponentSize = function (ref) {
	// NOTE: This function could ONLY be applied to MOUNTED COMPONENT!!!
	if (undefined === ref || null === ref) return null;
	const domElement = ReactDOM.findDOMNode(ref);
	return {
		width: domElement.clientWidth,
		height: domElement.clientHeight
	};
}

exports.httpGet = httpGet;
exports.getRenderedComponentSize = getRenderedComponentSize;
