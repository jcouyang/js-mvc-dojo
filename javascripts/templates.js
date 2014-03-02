(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["src/templates/header.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"navbar-header\">\n\t<button data-target=\".navbar-responsive-collapse\" data-toggle=\"collapse\" class=\"navbar-toggle\" type=\"button\">\n\t\t<span class=\"icon-bar\"></span>\n\t\t<span class=\"icon-bar\"></span>\n\t\t<span class=\"icon-bar\"></span>\n\t</button>\n\t<a href=\"#\" class=\"navbar-brand\">Blogist</a>\n</div>\n<div class=\"navbar-collapse collapse navbar-responsive-collapse\">\n\t<ul class=\"nav navbar-nav\">\n\t\t<li class=\"active\"><a href=\"#\">Archives</a></li>\n\t</ul>\n\t<form class=\"navbar-form navbar-left\">\n\t\t<input type=\"text\" placeholder=\"Search\" class=\"form-control col-lg-8\">\n\t</form>\n\n\t<ul class=\"nav navbar-nav navbar-right\">\n\t\t";
if(runtime.contextOrFrameLookup(context, frame, "login")) {
output += "\n\t\t<li>\n\t\t\t<a class=\"name\" href=\"#\">\n\t\t\t\t<img width=\"20\" height=\"20\" src=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "avatar_url"), env.autoesc);
output += "\" alt=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "name"), env.autoesc);
output += "\"> ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "name"), env.autoesc);
output += "\n\t\t\t</a>\n\t\t</li>\n\t\t";
;
}
else {
output += "\n\t\t<li><a href=\"#\">Login</a></li>\n\t\t";
;
}
output += "\n\t</ul>\n</div>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};
})();
})();
