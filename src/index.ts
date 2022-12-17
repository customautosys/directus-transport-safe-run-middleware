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

export default class DirectusTransportSafeRunMiddleware extends Transport{
	constructor(url:string,protected req:Request,protected res:Response){
		super({url});
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
		return new Promise(resolve=>{
			let req=Object.assign({},this.req);
			let params:any={
				ip:'127.0.0.1',
				method,
				url:path,
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
			Object.assign(req,params);
			let headers={};
			let status=200;
			let res:any={
				_removedHeader: {},
				_statusCode: 200,
				statusMessage: 'OK',
				get statusCode(){
				  return this._statusCode
				},
				set statusCode(status){
				  this._statusCode = status
				  this.status(status)
				},
				getHeader:x=>headers[x]??null,
				setHeader(x,y){
					headers[x]=headers[x.toLowerCase()]=y;
					return this;
				},
				redirect(code,url){
					if (typeof code!=='number'||(code>0&&code<600)) {
						status=typeof url==='number'?Math.max(1,Math.min(599,url)):301;
						url=code;
					}else{
						status=code;
					}
					this.setHeader('Location', url);
					this.end();
				},
				status(code){
					status=code;
					return this;
				}
			};
			res.set=res.header=((x,y)=>{
				if(x&&typeof x==='object'){
					for(let key in x){
						res.setHeader(key,x[key]);
					}
				}else{
					res.setHeader(x,y??'');
				}
				return res;
			}) as any;

			res.end=res.send=res.write=(raw=>{
				let response:any={
					status,
					headers,
					raw
				};
				try{
					response.data=JSON.parse(raw);
				}catch(error){}
				resolve(response);
			}) as any;

			this.req.app(req,res);
		});
	}
}