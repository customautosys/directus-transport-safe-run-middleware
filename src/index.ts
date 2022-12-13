import{
	Transport,
	TransportMethods,
	TransportOptions,
	TransportResponse
}from '@directus/sdk';
import type{
	Request,
	Response
}from 'express';
import runMiddleware from 'run-middleware';

export default class DirectusTransportSafeRunMiddleware extends Transport{
	constructor(url:string,protected req:Request,protected res:Response){
		super({url});
		runMiddleware(req.app);
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
			ip:'127.0.0.1',
			method,
			body:data,
			headers:{
				remoteAddress:'127.0.0.1',
				origin:'127.0.0.1',
				'content-type':'application/json',
				'transfer-encoding':'identity'
			},
			connection:{},
			original_req:this.req
		};
		if(options.params)params.query=options.params;
		if(options.headers)Object.assign(params.headers,options.headers);
		return new Promise(resolve=>(this.req.app as any).runMiddleware(this.url+path,params,(status,data,headers)=>{
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