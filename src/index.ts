import{
	Transport,
	TransportMethods,
	TransportOptions,
	TransportResponse
}from '@directus/sdk';
import type {Express} from 'express';
import runMiddleware from 'run-middleware';

export default class DirectusTransportSafeRunMiddleware extends Transport{
	constructor(url:string,protected app:Express){
		super({url});
		runMiddleware(app);
	}

	protected request<
		T=any,
		R=any
	>(
		method:TransportMethods,
		path:string,
		data?:Record<string,any>,
		options?:Omit<TransportOptions,'url'>
	):Promise<TransportResponse<T,R>>{
		return new Promise(resolve=>(this.app as any).runMiddleware(this.url+path,{
			method,
			query:options.params,
			body:data,
			headers:options.headers
		},(status,data,headers)=>{
			console.log(status,data,headers);
			resolve({
				headers,
				raw:data,
				data:data?.data,
				status
			});
		}));
	}
}