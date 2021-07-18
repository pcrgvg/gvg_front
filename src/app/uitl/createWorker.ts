export function createWorker (workerUrl: string) {
	var worker = null;
	try {
		worker = new Worker(workerUrl);
	} catch (e) {
		console.log('333')
		try {
			var blob;
			try {
				blob = new Blob(["importScripts('" + workerUrl + "');"], { "type": 'application/javascript' });
			} catch (e1) {
				console.log('33344')
				var blobBuilder = new window.MSBlobBuilder();
				blobBuilder.append("importScripts('" + workerUrl + "');");
				blob = blobBuilder.getBlob('application/javascript');
			}
			var url = window.URL || window.webkitURL;
			var blobUrl = url.createObjectURL(blob);
			worker = new Worker(blobUrl);
		} catch (e2) {
			//if it still fails, there is nothing much we can do
			throw new Error("");
			
		}
	}
	return worker;
}