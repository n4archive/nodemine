var fs = require("fs");
var path = require("path");
var Widget = class {
	generate(context){}
};
module.exports={
	compile(pack,prodBuild){
		if (pack===undefined) throw new Error("You must give a pack to compile.");
		if (prodBuild===undefined) prodBuild = false;
		if (!(pack.pack_format===1)) throw new Error("Invalid pack_format. 1 is the only valid value.");
		var addToMcLoad=[];
		var addToMcTick=[];
		console.log("Writing to "+pack.target);
		fs.writeFileSync(path.join(pack.target,"pack.mcmeta"),JSON.stringify({pack:{pack_format:1,description:pack.desc}}));
		if (!fs.existsSync(path.join(pack.target,"data"))) fs.mkdirSync(path.join(pack.target,"data"));
		if (!fs.existsSync(path.join(pack.target,"data","minecraft"))) fs.mkdirSync(path.join(pack.target,"data","minecraft"));
		if (!fs.existsSync(path.join(pack.target,"data","minecraft","tags"))) fs.mkdirSync(path.join(pack.target,"data","minecraft","tags"));
		if (!fs.existsSync(path.join(pack.target,"data","minecraft","tags","functions"))) fs.mkdirSync(path.join(pack.target,"data","minecraft","tags","functions"));
		pack.namespaces.forEach((namespace)=>{
			if (!fs.existsSync(path.join(pack.target,"data",namespace.name))) fs.mkdirSync(path.join(pack.target,"data",namespace.name));
			if (!fs.existsSync(path.join(pack.target,"data",namespace.name,"functions"))) fs.mkdirSync(path.join(pack.target,"data",namespace.name,"functions"));
			if (!fs.existsSync(path.join(pack.target,"data",namespace.name,"tags"))) fs.mkdirSync(path.join(pack.target,"data",namespace.name,"tags"));
			if (!fs.existsSync(path.join(pack.target,"data",namespace.name,"tags","functions"))) fs.mkdirSync(path.join(pack.target,"data",namespace.name,"tags","functions"));
			if (namespace.functions) {
				if (namespace.functions.main) {
					addToMcTick.push(namespace.name+":main");
				}
				if (namespace.functions.load) {
					addToMcLoad.push(namespace.name+":load");
				}
				for (let [key, value] of Object.entries(namespace.functions)) {
					fs.writeFileSync(path.join(pack.target,"data",namespace.name,"functions",key+".mcfunction"),value.generate({prefix:"",pack:pack.name,namespace:namespace.name,prod:prodBuild,file:key+".mcfunction",function_name:key}));
				}
			}
		});
		fs.writeFileSync(path.join(pack.target,"data","minecraft","tags","functions","load.json"),JSON.stringify({replace:false,values:addToMcLoad}));
		fs.writeFileSync(path.join(pack.target,"data","minecraft","tags","functions","tick.json"),JSON.stringify({replace:false,values:addToMcTick}));
	},
	Widget,
	ExecWidget: class extends Widget {
		constructor(cmd){
			super();
			this.cmd=cmd;
		}
		generate(context){
			console.log(context);
			return context.prefix+this.cmd;
		}
	},
	MultiRunWidget: class extends Widget {
	}
};
