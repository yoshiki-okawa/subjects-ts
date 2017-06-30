namespace Subjects {
	export interface ISubjectObject {
		(value?: any): any;
		IsSubject: boolean;
		AddCallback: (callback: Function) => void;
		RemoveCallback: (callback: Function) => void;
	}
}