export const gh325 = Symbol('gh325');
const UniqueSecretSymbolKey = Symbol('asdfghjkliuytrewqaxcvb,nb');

interface IEmpty {
	[UniqueSecretSymbolKey]: never;

}

export class CEmpty {
	[UniqueSecretSymbolKey]: never;
}

export default new class PrivateHelpersForGlobals {
	EmptyObject: IEmpty;
};


type obj = {
	[gh325]: '';
}

let myobj: obj;

function afc(param: obj) {}
myobj = {[gh325]: ''}

afc(myobj);