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
