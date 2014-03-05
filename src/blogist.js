user=""
function getUser(){
	return Q($.ajax({
		url:"https://api.github.com/user"+ "?access_token=" + localStorage.getItem("access_token"),
		method:'get'
	}));
}

function renderHeader(){
	return getUser().then(function(user){
		$(".navbar.navbar-default").html(nunjucks.render("src/templates/header.html",user));
		user = user.login;
	});	
}


function getGist(){
	return Q($.ajax({
		url:"https://api.github.com/users/jcouyang/gists?access_token=" + localStorage.getItem("access_token"),
		method:'get'
	}));
};

function renderGist(){
	getGist().then(function(body){
		$('.container .article').html(nunjucks.render("src/templates/article.html",{gists:body}));
	});
}

renderHeader().then(renderGist);
