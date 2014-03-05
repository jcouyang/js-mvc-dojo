var login_user;

function getUser(){
	return Q($.ajax({
		url:"https://api.github.com/user"+ "?access_token=" + localStorage.getItem("access_token"),
		method:'get'
	}));
}

function renderHeader(){
	return getUser().then(function(user){
		$(".navbar.navbar-default").html(nunjucks.render("src/templates/header.html",user));
		login_user = user.login;
	});	
}


function getGists(){
	return Q($.ajax({
		url:"https://api.github.com/users/"+login_user+"/gists?access_token=" + localStorage.getItem("access_token"),
		method:'get'
	}));
};

function renderGist(){
	getGists().then(function(body){
		$('.container .article').html(nunjucks.render("src/templates/gistlist.html",{gists:body}));
	}).then(bindEvent);
}


function bindEvent(){
	$(".article li a").click(function(){
		$.getJSON($(this).data("url")+".json?callback=?",function(data){
			$(".article").html(data.div);
		});
	});
}

renderHeader().then(renderGist);
