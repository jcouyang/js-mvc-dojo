var login_user;

View = function(){
	this.initialize.apply(this, arguments);
};

var delegateEventSplitter = /^(\S+)\s*(.*)$/;
_.extend(View.prototype, {
	el:$("body"),
	templateEngine: nunjucks,
	template:"",
	data:"",
	events:"click body:",
	initialize:function(){
	},
	getData:function(options){
		if (!this.data) return Q();
		var methodAndUrl = this.data.split('@');
		return Q($.ajax(_.extend({
			url:methodAndUrl[1],
			method:methodAndUrl[0]
		},options)));
	},
	render:function(){
		var self = this;
		return this.getData(this.dataOptions).then(function(data){
			self.el.html(self.templateEngine.render(self.template, {data:data}));
		}).then(self.bindEvent.bind(self));
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
	render:function(){
		var self = this;
		return this.getData().then(function(data){
			localStorage.setItem("login_user",data.login);
			self.el.html(self.templateEngine.render(self.template, data));
		}).then(self.bindEvent.bind(self));
	},
	template:"src/templates/header.html",
	data:"get@https://api.github.com/user"+ "?access_token=" + localStorage.getItem("access_token")
});

var BlogDetailView = View.extend({
	initialize:function(){
		this.data = "get@" + arguments[0];
		this.dataOptions = {dataType:'jsonp'};
	},
	el:$(".container .article"),
	template:"src/templates/article.html"
});

var BloglistView = View.extend({
	el: $(".container .article"),
	events:{
		'click li a':"renderDetail"
	},
	renderDetail:function(e){
		new BlogDetailView($(e.currentTarget).data("url") +".json").render();
	},
	template:"src/templates/gistlist.html",
	data:"get@https://api.github.com/users/"+localStorage.getItem('login_user') +"/gists?access_token=" + localStorage.getItem("access_token")
});

var header = new HeaderView();
var bloglist = new BloglistView();

header.render().then(bloglist.render.bind(bloglist));
