View = function(){
	this.initialize.apply(this, arguments);
};

var delegateEventSplitter = /^(\S+)\s*(.*)$/;
_.extend(View.prototype, {
	el:$("body"),
	templateEngine: nunjucks,
	template:"",
	dataurl:"",
	data:"",
	events:"click body:",
	initialize:function(options){
	},
	fetch:function(){
		var self = this;
		if (!this.dataurl) return Q();
		var methodAndUrl = this.dataurl.split('@');
		return Q($.ajax(_.extend({
			url:methodAndUrl[1],
			method:methodAndUrl[0]
		},self.dataOptions))).then(function(data){
			self.data = data;
			self.render(data);
			return data;
		});
	},
	render:function(data){
		this.el.html(this.templateEngine.render(this.template, {data:this.data}));
		this.bindEvent();
	},
	bindEvent:function(){
		var self = this;
		var events = _.result(this, 'events');
		if (!events) return this;
		_.each(_(events).keys(),function(key){
			var match = key.match(delegateEventSplitter);
			var eventName = match[1], selector = match[2];
			if (selector==''){
				self.el.on(eventName, _.bind(self[events[key]],self));
			} else{
				self.el.find(selector).on(eventName, _.bind(self[events[key]],self));
			}
		});
	}
});

View.extend = function(props){
	var parent = this,child;
    child = function(){
        parent.apply(this, arguments);
    };
	child.parent=parent;
    var FixConstructor = function(){
        this.constructor = child;
    };
    FixConstructor.prototype = parent.prototype;
    child.prototype = new FixConstructor();
    _.extend(child, parent);
    _.extend(child.prototype,props);
    return child;
};

Router = function(){
	this.routes = [];
	this.params = {};
	var self = this;
	var poped = false;
	var hashchanged = false;
	var loaded = false;
	var findRoute = function(e){
		var values;
		var hash = window.location.hash.replace("#","") || "/";
		_.each(self.routes,function(route){
			var regex = new RegExp(route.regex,"g");
			if((values = regex.exec(hash))!==null){
				console.log(values);
				values.shift();
				route.callback(_.object(route.paramNames,values));
				return;
			}
		});
	};
	
	$(window).on("hashchange",function(e){

		if(!poped){
			console.log("hashchange",document.location,e.originalEvent.state);
			findRoute(e);
			hashchanged = true;
			poped=false;
		}
		loaded =false;
	});

	$(window).on("popstate", function(e){
		if(!loaded){
			console.log("popstate",document.location,e.originalEvent.state);
			findRoute(e);
			poped =true;
			loaded=false;
		}
	});

	$(window).on("load", function(e){
		console.log("load",document.location,e.originalEvent.state);
		findRoute(e);
		loaded=true;
	});
};

Router.prototype.get = function(url,callback){
	var paramRegx = /:([^/.\\\\]+)/g;
	var param;
	var route = {
		paramNames:[],
		regex:'^'+ url +'$',
		params:{},
		callback:callback
	};
	while((param = paramRegx.exec(url))!==null){
		route.paramNames.push(param[1]);
		route.regex = route.regex.replace(param[0],"([^/.\\\\]+)").replace(":","");
	}
	this.routes.push(route);
};

