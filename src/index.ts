import{
	ITransport,
	TransportRequestOptions,
	TransportResponse
}from '@directus/sdk';
import {Express} from 'express';
import safeRunMiddleware from 'safe-run-middleware';

export default class DirectusTransportSafeRunMiddleware implements ITransport{
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
		this.app=safeRunMiddleware(app);
	}

	protected readonly request=async<
		T=any,
		P=any,
		R=any
	>(
		method:string,
		path:string,
		options?:TransportRequestOptions,
		data?:P
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

	readonly get=<
		T=any,
		R=any
	>(
		path:string,
		options?:TransportRequestOptions
	):Promise<TransportResponse<T,R>>=>this.request('get',path,options);
	
	readonly head=<
		T=any,
		R=any
	>(
		path:string,
		options?:TransportRequestOptions
	):Promise<TransportResponse<T,R>>=>this.request('head',path,options);
	
	readonly options=<
		T=any,
		R=any
	>(
		path:string,
		options?:TransportRequestOptions
	):Promise<TransportResponse<T,R>>=>this.request('options',path,options);
	
	readonly delete=<
		T=any,
		P=any,
		R=any
	>(
		path:string,
		data?:P,
		options?:TransportRequestOptions
	):Promise<TransportResponse<T,R>>=>this.request('delete',path,options,data);
	
	readonly post=<
		T=any,
		P=any,
		R=any
	>(
		path:string,
		data?:P,
		options?:TransportRequestOptions
	):Promise<TransportResponse<T,R>>=>this.request('post',path,options,data);
	
	readonly put=<
		T=any,
		P=any,
		R=any
	>(
		path:string,
		data?:P,
		options?:TransportRequestOptions
	):Promise<TransportResponse<T,R>>=>this.request('put',path,options,data);
	
	readonly patch=<
		T=any,
		P=any,
		R=any
	>(
		path:string,
		data?:P,
		options?:TransportRequestOptions
	):Promise<TransportResponse<T,R>>=>this.request('patch',path,options,data);
}