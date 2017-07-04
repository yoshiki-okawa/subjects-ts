function IsPolyfillRequired() {
	return !('Promise' in window);
}

function LoadScript(src: string, done: (err: Error) => void) {
	var js = document.createElement('script');
	js.src = src;
	js.onload = () => done(null);
	js.onerror = (err: ErrorEvent) => done(new Error('Failed to load script ' + src + '\n' + err));
	document.head.appendChild(js);
}

export = class Utils {
	public static RunWithPolyfill(main: (err: Error) => void) {
		if (!IsPolyfillRequired())
			main(null);
		else
			LoadScript('https://cdn.polyfill.io/v2/polyfill.min.js?features=Promise,Array.from', main);
	}
};