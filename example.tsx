/*
npm install --save subjects-ts
Replace the first line below with:
/// <reference path="subjects-ts" />
tsconfig.json:
"jsx": "react",
"jsxFactory": "Subjects.SubjectProcessor"
*/
/// <reference path="./index.d.ts" />

let sub = Subjects.SubjectObject<string>();
sub("My first SubjectObject");
console.log(sub());
sub.AddCallback(value => console.log('callback1:', value));
sub.AddCallback(value => console.log('callback2:', value));
sub("Callback is called");
console.log(sub());
let sa = new Subjects.SubjectArray<string>();
sa.Push('a');
let mapped = sa.Map(x => console.log(x));
mapped.AddCallbackToOriginalSubjectArray('Push', str => mapped.ExecuteMapFunction(str));
sa.Push('b');

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