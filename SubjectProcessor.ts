import ISubjectObject = require('./ISubjectObject');
import SubjectArray = require('./SubjectArray');

function RemoveAllChildren(elem: Element) {
	let child = elem.firstChild;

	while (child) {
		elem.removeChild(child);
		child = elem.firstChild;
	}
}

function SubjectProcessorInternal(value: any, a: HTMLElement): any[] {
	if (value === null || value === undefined)
		return [];

	if (value instanceof HTMLElement) {
		a.appendChild(value);
		return [value];
	}
	else if (value instanceof Array) {
		let arr = [];
		value.forEach(x => SubjectProcessorInternal(x, a).forEach(y => arr.push(y)));
		return arr;
	}
	else if (value instanceof SubjectArray) {
		value.AddCallbackToOriginalSubjectArray('Push', (todo) => {
			a.appendChild(value.ExecuteMapFunction(todo));
		});
		value.AddCallbackToOriginalSubjectArray('Set', (index, todo) => {
			a.replaceChild(value.ExecuteMapFunction(todo), a.childNodes[index]);
		});
		value.AddCallbackToOriginalSubjectArray('Remove', (index) => {
			a.removeChild(a.childNodes[index]);
		});
		value.AddCallbackToOriginalSubjectArray('Clear', () => RemoveAllChildren(a));
		let arr = [];
		value.ForEach(x => SubjectProcessorInternal(x, a).forEach(y => arr.push(y)));
		return arr;
	}
	else if (value instanceof Function) {
		let value2 = value();
		let arr = SubjectProcessorInternal(value2, a);

		let so = value as ISubjectObject;

		if (so && so.IsSubject) {
			so.AddCallback(newVal => {
				arr.forEach(x => a.removeChild(x));
				SubjectProcessorInternal(newVal, a);
			});
		}
	}
	else {
		let x: Text = document.createTextNode(value);
		a.appendChild(x);
		return [x];
	}
}

export = function SubjectProcessor() {
	let arr = Array.from(arguments);
	let tag: string = arr[0];
	let attrs: any = arr[1];
	let values: any[] = arr.slice(2);
	let a = document.createElement(tag);

	if (attrs) {
		Object.keys(attrs).forEach(x => {
			let attr = attrs[x];

			if (attr === null || attr === undefined)
				return;

			if (attr instanceof Function) {
				let attrValue = attr();

				if (attrValue === null || attrValue === undefined)
					return;

				a.setAttribute(x, attrValue);
				let so = attr as ISubjectObject;

				if (so && so.IsSubject)
					so.AddCallback(newVal => a.setAttribute(x, newVal));
			}
			else {
				a.setAttribute(x, attr);
			}
		});
	}
	values.forEach(value => SubjectProcessorInternal(value, a));
	return a;
};