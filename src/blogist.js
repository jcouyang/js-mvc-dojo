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
header.fetch();

var router = new Router();
router.get("/", function(){
	console.log("homepage");
	header.fetch().then(bloglist.fetch.bind(bloglist));
});

router.get("/:gistid",function(params,data){
	new BlogDetailView('https://gist.github.com/'+localStorage.getItem('login_user')+"/"+ params.gistid +".json").fetch();
});
