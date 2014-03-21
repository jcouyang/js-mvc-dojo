function getToken(){
	var token = localStorage.getItem("access_token");
	if(token)
		return "?access_token=" + token;
	return "";
}

var userModel = new Model("user","get@https://api.github.com/user"+ getToken());

var bloglistModel = new Model("bloglist","get@https://api.github.com/users/"+ userModel.get("login") +"/gists");

var blogdetailModel = Model.extend({
	dataOptions:{dataType:"jsonp"}
});
var HeaderView = View.extend({
	model:userModel,
	el: $(".navbar.navbar-default"),
	template:"src/templates/header.html"
});


var BlogDetailView = View.extend({
	el:$(".container .article"),
	template:"src/templates/article.html"
});

var BloglistView = View.extend({
	model:bloglistModel,

	el: $(".container .article"),
	template:"src/templates/gistlist.html"
});

var header = new HeaderView();
header.render();
var bloglist = new BloglistView();

var router = new Router();
router.get("/", function(){
	console.log("homepage");
	bloglist.render();
});

router.get("/:gistid",function(params,data){
	new BlogDetailView({model:new blogdetailModel("blogdetail",'get@https://gist.github.com/'+ userModel.get("login") +"/"+ params.gistid +".json")}).render();
});
