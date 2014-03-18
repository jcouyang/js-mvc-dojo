var login_user;

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

var HeaderView = View.extend({
	el: $(".navbar.navbar-default"),
	fetch:function(options){
		var self = this;
		if (!this.dataurl) return Q();
		var methodAndUrl = this.dataurl.split('@');
		return Q($.ajax(_.extend({
			url:methodAndUrl[1],
			method:methodAndUrl[0]
		},options))).then(function(data){
			self.data = data;
			self.render();
			localStorage.setItem("login_user",data.login);
			return data;
		});
	},
	template:"src/templates/header.html",
	dataurl:"get@https://api.github.com/user"+ "?access_token=" + localStorage.getItem("access_token")
});

var BlogDetailView = View.extend({
	initialize:function(){
		this.dataurl = "get@" + arguments[0];
		this.dataOptions = {dataType:'jsonp'};
	},
	el:$(".container .article"),
	template:"src/templates/article.html"
});

var BloglistView = View.extend({
	el: $(".container .article"),
	template:"src/templates/gistlist.html",
	dataurl:"get@https://api.github.com/users/"+localStorage.getItem('login_user') +"/gists?access_token=" + localStorage.getItem("access_token")
});

var header = new HeaderView();
var bloglist = new BloglistView();
header.fetch().then(bloglist.fetch());

Router = function(){
	this.routes = [];
	this.params = {};
	var self = this;
	$(window).on("hashchange",function(){
		var values;
		var hash = window.location.hash.replace("#","");
		
		_.each(self.routes,function(route){
			var regex = new RegExp(route.regex,"g");
			if((values = regex.exec(hash))!==null){
				values.shift();
				route.callback(_.object(route.paramNames,values));
				return;
			}
		});

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


var router = new Router();
router.get("/", function(){
	console.log("homepage");
	header.render();
	bloglist.render();
});

router.get("/:gistid",function(params){
	new BlogDetailView('https://gist.github.com/'+localStorage.getItem('login_user')+"/"+ params.gistid +".json").fetch();
});
