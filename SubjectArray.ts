namespace Subjects {
	type MethodName = "Set" | "Remove" | "Push" | "Clear";
	export class SubjectArray<T> {
		private _arr: T[] = [];
		private _callbacks = { Push: [], Remove: [], Set: [], Clear: [] };
		private _originalArray: SubjectArray<T>;
		private _mapFunc: Function;

		constructor(arr?: Array<T>) {
			this._arr = arr || [];
		}

		public Get(index: number): T {
			return this._arr[index];
		}

		public Set(index: number, item: T): void {
			this._arr[index] = item;
			let callbacks = this._callbacks.Set;

			if (callbacks.length > 0)
				callbacks.forEach(x => x(index, item));
		}

		public Remove(index: number): void {
			this._arr.splice(index, 1);
			let callbacks = this._callbacks.Remove;

			if (callbacks.length > 0)
				callbacks.forEach(x => x(index));
		}

		public Map<U>(func: (item: T) => any): SubjectArray<U> {
			let list = new SubjectArray<any>(this._arr.map(func));
			list._originalArray = this;
			list._mapFunc = func;
			return list;
		}

		public Push(item: T): void {
			this._arr.push(item);
			let callbacks = this._callbacks.Push;

			if (callbacks.length > 0)
				callbacks.forEach(x => x(item));
		}

		public ForEach(func: (item: T) => void): void {
			this._arr.forEach(func);
		}

		public Clear(): void {
			this._arr = [];
			let callbacks = this._callbacks.Clear;

			if (callbacks.length > 0)
				callbacks.forEach(x => x());
		}

		public AddCallbackToOriginalSubjectArray(methodName: MethodName, func: Function): void {
			this._originalArray._callbacks[methodName.toString()].push(func);
		}

		public ExecuteMapFunction(item: T): any {
			return this._mapFunc(item);
		}
	}
}