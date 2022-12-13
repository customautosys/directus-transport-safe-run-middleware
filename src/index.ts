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
		let params:any={
			method,
			body:data,
			headers:{
				remoteAddress:'127.0.0.1',
				origin:'127.0.0.1',
				'content-type':'application/json',
				'transfer-encoding':'identity'
			},
			connection:{}
		};
		if(options.params)params.query=options.params;
		if(options.headers)Object.assign(params.headers,options.headers);
		return new Promise(resolve=>(this.app as any).runMiddleware(this.url+path,params,(status,data,headers)=>{
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