import { goto } from '$app/navigation';
import { page } from '$app/stores';

const URLSearchParamsToObject = (params: URLSearchParams) => {
	const obj = {};
	params.forEach((v: string, k: string) => {
		obj[k] = v;
	});
	return obj;
};

export const createQueryParamsStore = (key: string) => {
	let params;
	page.subscribe((v) => {
		params = URLSearchParamsToObject(v.query);
	});

	return {
		subscribe: (cb) => {
			return page.subscribe((p) => {
				cb(p.query.get(key));
			});
		},
		set: (value: string) => {
			params[key] = value;
			const urlSearchParams = new URLSearchParams(params);
			goto(`?${urlSearchParams.toString()}`, {
				keepfocus: true,
				replaceState: true,
				noscroll: true
			});
		}
	};
};
