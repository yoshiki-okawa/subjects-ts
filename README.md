# Subjects.ts

Subjects.ts is very simple typescript utilities using Subject pattern (Observer and Observable) based on TSX (JSX).

Main focus of this project is to move away from 

## Usage

```cmd
npm install --save subjects-ts
```

## Examples

See example.tsx and example.html for live examples.

### Minimal example of SubjectObject

```js
/// <reference types="subjects-ts" />
let sub = Subjects.SubjectObject<string>();
sub("My first SubjectObject");
console.log(sub());
sub.AddCallback(value => console.log('callback1:', value));
sub.AddCallback(value => console.log('callback2:', value));
sub("Callback is called");
console.log(sub());
```

### Minimal example of SubjectArray

```js
/// <reference types="subjects-ts" />
let sa = new Subjects.SubjectArray<string>();
sa.Push('a');
let mapped = sa.Map(x => console.log(x));
mapped.AddCallbackToOriginalSubjectArray('Push', str => mapped.ExecuteMapFunction(str));
```

### Browser Example
example.tsx
```jsx
/// <reference types="subjects-ts" />

class Todo {
	public Subject = Subjects.SubjectObject<string>();
	public Done = Subjects.SubjectObject<string>();
	public constructor(init?: any) {
		Object.keys(init).forEach(x => this[x](init[x]));
	}
}

let todos = new Subjects.SubjectArray<Todo>();
todos.Push(new Todo({ Subject: 'todo 1', Done: null }));
todos.Push(new Todo({ Subject: 'todo 2', Done: 'checked' }));
todos.Push(new Todo({ Subject: 'todo 3', Done: null }));

document.body.appendChild(
	<ul>
		{
			todos.Map(x => <li><label><input type='checkbox' checked={x.Done} />{x.Subject}</label></li>)
		}
	</ul>
);

let Sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));
async function Test() {
	todos.Get(0).Done('checked');
	await Sleep(1000);
	todos.Get(0).Subject('todo 4');
	await Sleep(1000);
	todos.Push(new Todo({ Subject: 'todo 5', Done: null }));
	await Sleep(1000);
	todos.Set(1, new Todo({ Subject: 'todo 6', Done: null }));
	await Sleep(1000);
	todos.Remove(2);
	await Sleep(1000);
	todos.Clear();
	await Sleep(1000);
}
Test();
```
example.html
```html
<html>

<body>
	<script type="text/javascript" src="out.js"></script>
	<!--<script type="text/javascript" src="out.min.js"></script>-->
</body>

</html>
```

## API

* ISubjectObject.ts, SubjectObject.ts
	* ### (value?: any): any;
		() to get value and (value) to notify callback (observer).
	* ### IsSubject: boolean;
		Whether this object is ISubjectObject or not. (as transpiled javascript won't have interface type)
	* ### AddCallback: (callback: Function) => void;
		Add callback (observer) to this object.
	* ### RemoveCallback: (callback: Function) => void;
		Remove callback (observer) from this object.
* SubjectArray.ts
	* ### Get(index: number): T
		Array[index]
	* ### Set(index: number, item: T): void
		Array[index] = item
	* ### Remove(index: number): void
		Array.slice(index, 1)
	* ### Map<U>(func: (item: T) => any): SubjectArray<U>
		Array.map(func)
	* ### Push(item: T): void
		Array.push(item)
	* ### ForEach(func: (item: T) => void): void
		Array.forEach(func)
	* ### Clear(): void
		Array = []
	* ### AddCallbackToOriginalSubjectArray(methodName: MethodName, func: Function): void
		Register callback (observer) to original SubjectArray where Map() occurred.
	* ### ExecuteMapFunction(item: T): any
		Execute map function which created this SubjectArray.
* SubjectProcessor.ts

	* ### SubjectProcessor()
		This is example jsx factory function you can specify as "jsxFactory" in tsConfig.json.
		```js
		"jsxFactory": "Subjects.SubjectProcessor"
		```

## Misc

I'll add more functionalities and fix bugs as I use but please feel free to contribute :)