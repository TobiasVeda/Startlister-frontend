export interface RequestOptions extends RequestInit {
	headers?: Record<string, string>;
	params?: Record<string, unknown>;
}
export interface FetchResponse<T> {
	data: T;
	status: number;
	statusText: string;
	headers: Headers;
}
export interface FetchError<T> extends Error {
	response?: FetchResponse<T>;
}

class HttpClient {
	private defaultHeaders: Record<string, string> = {};

	setHeader(key:string, value: string):void {
		this.defaultHeaders[key] = value;
	}

	getHeader(key:string):string|undefined {
		return this.defaultHeaders[key];
	}

	removeHeader(key:string):void {
		delete this.defaultHeaders[key];
	}

	private buildUrl(input:string|URL|Request, params?:Record<string, unknown>):string|URL|Request {
		if (!params || typeof input !== "string") {
			return input;
		}
		const query = Object.keys(params)
			.filter((key) => params[key] !== undefined && params[key] !== null)
			.map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(String(params[key]))}`)
			.join("&");
		if (!query) {
			return input;
		}
		return input.includes("?") ? `${input}&${query}` : `${input}?${query}`;
	}

	private async request<T = unknown>(input:string|URL|Request, init?:RequestOptions|undefined):Promise<FetchResponse<T>> {
		const { params, ...restInit } = init ?? {};
		const resolvedInput = this.buildUrl(input, params);

		const headers = {
			...this.defaultHeaders,
			...init?.headers
		};

		const response = await fetch(resolvedInput, {
			...restInit,
			headers: headers
		});

		// Parses JSON if header is "application/json", else parses as text
		const contentType = response.headers.get("content-type") ?? "";
		let data:unknown;
		if (contentType.includes("application/json")) {
			const text = await response.text();
			data = text ? JSON.parse(text) : null;
		} else {
			data = await response.text();
		}
		
		// Returns data as a FetchResponse
		const result: FetchResponse<T> = {
			data: data as T,
			status: response.status,
			statusText: response.statusText,
			headers: response.headers
		};

		// Throws error if not 200 ok
		if (!response.ok) {
			const error = new Error(`HTTP Error: ${response.status} ${response.statusText}`) as FetchError<T>;
			error.response = result;
			throw error;
		}

		return result;
	}

	async get<T>(input:string|URL|Request, init?:RequestOptions|undefined): Promise<FetchResponse<T>> {
		return this.request<T>(input, { ...init, method: "GET" });
	}

	async post<T>(input: string | URL | Request, body?: unknown, init?: RequestOptions | undefined): Promise<FetchResponse<T>> {
		return this.request<T>(input, {
			...init,
			method: "POST",
			body: JSON.stringify(body)
		});
	}
}

const Fetch = new HttpClient();
export default Fetch;
