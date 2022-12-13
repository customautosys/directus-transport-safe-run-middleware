import{
	Transport,
	TransportMethods,
	TransportOptions,
	TransportResponse
}from '@directus/sdk';
import type {Express} from 'express';
import safeRunMiddleware from 'safe-run-middleware';

export default class DirectusTransportSafeRunMiddleware extends Transport{
	protected app:{
		runMiddleware(
			path:string,
			payload?:{
				method?:string,
				query?:any,
				body?:any,
				cookies?:any,
				headers?:any
			}
		):Promise<{
			statusCode:number,data:any,headers:any
		}>
	};

	constructor(app:Express){
		super({url:''});
		this.app=safeRunMiddleware(app);
	}

	protected readonly request=async<
		T=any,
		R=any
	>(
		method:TransportMethods,
		path:string,
		data?:Record<string,any>,
		options?:Omit<TransportOptions,'url'>
	):Promise<TransportResponse<T,R>>=>{
		let response=await this.app.runMiddleware(path,{
			method,
			query:options.params,
			body:data,
			headers:options.headers
		});
		return{
			headers:response.headers,
			raw:response.data,
			data:response.data?.data,
			status:response.statusCode
		};
	}
}