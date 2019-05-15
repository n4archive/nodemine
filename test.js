var nodemine = require("./index.js");
var lnf = new nodemine.ExecWidget("say hixd");
var pack = {
	pack_format: 1,
	target: "./pack",
	desc: "moin",
	namespaces: [
		{
			name:"test",
			functions:{
				load: lnf
			}
		}
	]
};
nodemine.compile(pack);
