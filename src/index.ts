import{
	Transport,
	TransportMethods,
	TransportOptions,
	TransportResponse
}from '@directus/sdk';
import type {Request} from 'express';

export default class DirectusTransportSafeRunMiddleware extends Transport{
	constructor(url:string,public req:Request){
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
		return new Promise<TransportResponse<T,R>>((resolve,reject)=>{
			let req=Object.assign({},this.req);
			let params:any={
				ip:'127.0.0.1',
				method,
				body:'',
				url:this.url+path,
				headers:{
					remoteAddress:'127.0.0.1',
					origin:'127.0.0.1',
					'content-type':'text/plain',
					'transfer-encoding':'identity'
				},
				connection:{}
			};
			if(data){
				params.body=data;
				if(typeof data==='object')params.headers['content-type']='application/json';
			}
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

			res.setHeader=(x,y)=>{
				headers[x] = y;
				headers[x.toLowerCase()] = y;
				return res;
			};

			res.getHeader=x=>headers[x]??null;

			res.redirect=function(code,url){
				if(typeof code!=='number') {
					status=301;
					url=code;
				}else{
					status=code;
				}
				res.setHeader('Location',url);
				res.end();
			};

			res.status=res.sendStatus=function(code){
				status=code;
				return res;
			};

			res.end=res.send=res.write=(raw=>{
				let response:any={
					status,
					headers,
					raw
				};
				try{
					response.data=JSON.parse(raw)?.data;
				}catch(error){}
				resolve(response);
			}) as any;

			this.req.app(req,res,reject);
		});
	}
}