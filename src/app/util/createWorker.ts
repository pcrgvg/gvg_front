export function createWorker(workerUrl: string) {
	let worker = null;
	try {
		worker = new Worker(workerUrl);
	} catch (e) {
		console.log('333');
		try {
			let blob;
			try {
				blob = new Blob(['importScripts(\'' + workerUrl + '\');'], { type: 'application/javascript' });
			} catch (e1) {
				console.log('33344');
				let blobBuilder = new window.MSBlobBuilder();
				blobBuilder.append('importScripts(\'' + workerUrl + '\');');
				blob = blobBuilder.getBlob('application/javascript');
			}
			let url = window.URL || window.webkitURL;
			let blobUrl = url.createObjectURL(blob);
			worker = new Worker(blobUrl);
		} catch (e2) {
			// if it still fails, there is nothing much we can do
			throw new Error('');

		}
	}
	return worker;
}

export function getLocalWorkerUrl(orginUrl: string): Promise<string> {
	return new Promise((resolve, reject) => {
		fetch(orginUrl).then(res => res.text()).then(codeString => {
			const localWorkUrl =  window.URL.createObjectURL(new Blob([codeString], {
				type: 'application/javascript'
			}));
			resolve(localWorkUrl);
		}).catch(err => reject(err));
	});
}
