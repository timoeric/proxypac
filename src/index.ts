/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
}

const pac = (subdomain: string) => `
function FindProxyForURL(url,host)
{
	// No proxy for private (RFC 1918) IP addresses (intranet sites)
	if (isInNet(dnsResolve(host), "10.0.0.0", "255.0.0.0") ||
		isInNet(dnsResolve(host), "172.16.0.0", "255.240.0.0") ||
		isInNet(dnsResolve(host), "192.168.0.0", "255.255.0.0")) {
		 return "DIRECT";
	}
  
	// No proxy for localhost
	if (isInNet(dnsResolve(host), "127.0.0.0", "255.0.0.0")) {
		return "DIRECT";
	}
 
	// Proxy all
	return 'HTTPS ${subdomain}.proxy.cloudflare-gateway.com:443';
}`

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		const url = new URL(request.url)
		const subdomain = url.pathname.slice(1).split('.')[0]
		 
		return new Response(pac(subdomain), {
		  headers: {
			'content-type': 'application/x-ns-proxy-autoconfig',
		  },
		})
	},
};