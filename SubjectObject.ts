namespace Subjects {
	export function SubjectObject<T>(): ISubjectObject {
		let f = function (value?: T) {
			let argCount = arguments.length;

			if (arguments.length === 0)
				return f['value'];

			f['value'] = value;

			let funcs = f['funcs'];

			if (funcs && funcs.length > 0)
				funcs.forEach(x => x(value));
		} as ISubjectObject;

		f.IsSubject = true;

		f.AddCallback = callback => {
			let funcs = f['funcs'] = f['funcs'] || [];
			funcs.push(callback);
		};

		f.RemoveCallback = callback => {
			let funcs = f['funcs'];
			if (!funcs)
				return;

			let index = funcs.indexOf(callback);

			if (index >= 0)
				funcs.splice(index, 1);
		};

		return f;
	}
}