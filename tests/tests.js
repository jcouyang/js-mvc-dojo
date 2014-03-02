var should = chai.should();
var stub = sinon.stub;
function once(fn) {
    var returnValue, called = false;
    return function () {
        if (!called) {
            called = true;
            returnValue = fn.apply(this, arguments);
        }
        return returnValue;
    };
}
$('<div id="for-testing" style="display:none;"></div>').appendTo('body');

describe('unit test', function(){
	before(function(){
   sinon.stub(nunjucks,"render").callsArgAsync(2);
  });
	after(function(){
		nunjucks.render.restore();
	});
	describe('header',function(){
		it('header when login', function(done){
			var user = {
				login:"wang nima"
			};
			var userData = Q(user);
			getUser = stub().returns(userData);
			renderHeader();
			userData.should.be.fulfilled.then(function(){
				nunjucks.render.calledOnce.should.be.true;
				nunjucks.render.getCall(0).args[0].should.be.equal("src/templates/header.html");
				nunjucks.render.getCall(0).args[1].should.be.equal(user);
			}).should.notify(done);
		});
	});
});
	


