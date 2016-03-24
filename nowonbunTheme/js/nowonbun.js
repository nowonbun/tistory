
var lastScroll = 0;
var rightsideListCount = 9;
var myUrl = "http://nowonbun.tistory.com";

/*메인 화면 리다이렉트*/
var url = decodeURIComponent(location.href);
url = url.replace('http://','').replace('https://','');
url = url.split('#')[0];
url = url.split('?')[0];
url = url.split('/');
if(url[1] == '') { 
	location.href = '/notice/342'; 
}

/*OnLoad*/
$(function(){
	initLogo();
	initMenu();
	initAside();
	initList();
	initComment();
	initpaging();
	initListRate();
});
/*onResize*/
$(window).resize(function(){
	initLogo();
	initLogo();
	initAside();
	initListRate();
});
/*로고 중앙 위치*/
function initLogo(){
	headerLogoPos = ($(window).width()/2)-($("header div.navbar-header > a:nth-child(2)").width()/2);
	$("header div.navbar-header > a:nth-child(2)").css("left",headerLogoPos);
}
/*초기화*/
function initMenu(){
	/*메뉴 만들기*/
	temp = $("ul.category_list").html();
	/*탑메뉴 삭제*/
	/*$("ul.top-nav").html(temp);*/
	$("ul.side-nav").html(temp);
	/*사이드 메뉴 하위가 있을경우 위 아래 이미지생성*/
	$("div.side-list > ul.side-nav > li > ul").parent().children("a").append("<a href='#' class='glyphicon glyphicon-triangle-bottom pull-right' aria-hidden='true' onclick='openSublist($(this));'></a>");
	/*사이드 메뉴 상위 메뉴 초기화*/
	changeClassState($("div.side-list > ul.side-nav ul"),false);
	/*사이드 메뉴에서 아이콘 메뉴 활성화 처리*/
	if($("div.tistorytoolbar").hasClass("tt_menubar_login")){
		/*비로그인시*/
		changeClassState($("ul.bs-glyphicons-list > li.logout"),true);
		changeClassState($("ul.bs-glyphicons-list > li.login"),false);
		changeClassState($("ul.bs-glyphicons-list > li.admin"),false);
		$("div#loginstate").addClass("logout");
	}else{
		/*로그인시*/
		changeClassState($("ul.bs-glyphicons-list > li.logout"),false);
		changeClassState($("ul.bs-glyphicons-list > li.login"),true);
		changeClassState($("ul.bs-glyphicons-list > li.admin"),false);
		$("div#loginstate").addClass("login");
		$("a.tt_menubar_link").each(function(){
			/*관리자 일경우*/
			if($(this).attr("href") === myUrl){
				$("div#loginstate").addClass("admin");
				changeClassState($("ul.bs-glyphicons-list > li.admin"),true);
			}
		});
	}
}
/*사이드 메뉴에서 서브리스트-누르면 들어가고 누르면 나오는 구조*/
function openSublist(obj){
	/*사이드 메뉴 에서 - 상위 메뉴 버튼 이미지 교체*/
	if(obj.hasClass("glyphicon-triangle-bottom")){
		obj.removeClass("glyphicon-triangle-bottom");
		obj.addClass("glyphicon-triangle-top");
	}else if(obj.hasClass("glyphicon-triangle-top")){
		obj.removeClass("glyphicon-triangle-top");
		obj.addClass("glyphicon-triangle-bottom");
	}
	/* 하위 메뉴 펼침 접힘*/
	dom = obj.parent().parent().children("ul");
	if(dom.hasClass("on")){
		changeClassState(dom,false);
	}else{
		changeClassState(dom,true);
	}
}
/*메뉴 초기 설정 - 메뉴숨기기,사이즈 변경때마다도 요청한다.(메뉴가 가끔씩 튀어나오는 버그때문에)*/
function initAside(){
	dom = $("aside#leftside");
	/*사이드 메뉴 높이 설정*/
	//dom.css("height",$(window).height()-$("header").height());
	aside_height = $(window).height();
	/*모바일이 되면 position이 absolute으로 되기 때문에 사이드바가 깨짐*/
	if(!isMobile()){
		aside_height -= $("header").height();
	}
	dom.css("height",aside_height);
	/*오른쪽 사이드 추가*/
	initRightAside();
	sideLeftOff();
	sideRightOff();
	/*이미지 집어넣기*/
	$("aside#leftside h2.side-header > img").prop("src",$("div#blogImage").html());
	/*메인 최소사이즈 변경(Footer)*/
	main_min_height = $(window).height();
	main_min_height -= $("header").height();
	main_min_height -= $("div.footer-bottom").height();
	/*main_min_height -= $("div.widget-footer").height();*/
	/*padding값들*/
	main_min_height -= 41;
	/*paging크기*/
	main_min_height -= 43;
	/*재조정값*/
	main_min_height -= 2;
	$("main").css("min-height",main_min_height);
	
}
/*오른쪽 사이드 추가*/
function initRightAside(){
	dom2 = $("aside#rightside");
	aside2_height = $(window).height();
	if(!isMobile()){
		aside2_height -= $("header").height();
	}
	dom2.css("height",aside2_height);
}
/*function initFooter(){
	htmltest = $("div.article>div.tt_article_useless_p_margin>div.another_category").html();
	if(htmltest != null){
		$("div.widget-footer").html(htmltest);
	}
}*/
/*메뉴 상태.. 처음 누르면 메뉴가 나옴. 다시 누르면 메뉴가 들어감*/
function menu(state){
	if(state === "close"){
		sideLeftOff();
		sideRightOff();
		return;
	}
	if(!isMobile()){
		if($("aside#leftside").hasClass("on")){
			sideLeftOff();
			sideRightOff();
			return;
		}
		sideLeftOn();	
		sideRightOn();
		return;
	}
	if(state === "left"){
		if($("aside#leftside").hasClass("on")){
			sideOff();
			return;
		}
		sideLeftOn();	
		return;
	}
	if(state === "right"){
		if($("aside#rightside").hasClass("on")){
			sideRightOff();
			return;
		}
		sideRightOn();
		return;
	}
}
/*사이드바 없어질 때 처리*/
function sideLeftOff(){
	changeClassState($("aside#leftside"),false);
	changeClassState($("main"),false);
	/*화면이 작을때 튀어나오는 버그처리*/
	$("aside#leftside").css("left",$(window).width() > 300 ? -$(window).width() : -300);
	$("aside#leftside").css("width",0);
	$("aside#leftside").hide();
	/*화면 깨짐 버그처리*/
	$('body').css("width","");
	$('html').css("position","static");
	/*화면 고정처리*/
	$('html').css("overflow","auto");
}
function sideRightOff(){
	changeClassState($("aside#rightside"),false);
	$("aside#rightside").css("right",-300);
	$("aside#rightside").hide();
	if(isMobile()){
		/*화면 깨짐 버그처리*/
		$('body').css("width","");
		$('html').css("position","static");
		/*화면 고정처리*/
		$('html').css("overflow","auto");
	}
}
/*사이드바 생길 때 처리*/
function sideLeftOn(){
	/*화면 고정처리*/
	$('html').css("overflow","hidden");
	/*화면 깨짐 버그처리*/
	$('html').css("position","fixed");
	$('body').css("width",$(window).width());
	/*화면이 작을때 튀어나오는 버그처리*/
	$("aside#leftside").show();
	$("aside#leftside").css("width",$(window).width());
	$("aside#leftside").css("left",0);
	/*하단 아이콘처리*/
	$("aside#leftside > div > div.side-list").css("min-height",$("aside#leftside> div").height()-210);
	changeClassState($("main"),true);
	changeClassState($("aside#leftside"),true);
}
function sideRightOn(){
	if(isMobile()){
		/*화면 고정처리*/
		$('html').css("overflow","hidden");
		/*화면 깨짐 버그처리*/
		$('html').css("position","fixed");
		$('body').css("width",$(window).width());
	}
	$("aside#rightside").show();
	$("aside#rightside").css("right",0);
	changeClassState($("aside#rightside"),true);
}
/*클래스 상태 변경*/
function changeClassState(dom,state){
	if(dom.hasClass("on")){
		dom.removeClass("on");
	}
	if(dom.hasClass("off")){
		dom.removeClass("off");
	}
	dom.addClass(state?"on":"off");
}
/*로그인*/
function login(){
	if($("div#loginstate").hasClass("logout")){
		location.href='https://www.tistory.com/login';
	}
	return false;
}
/*로그아웃*/
function logout(){
	if($("div#loginstate").hasClass("login")){
		location.href='https://www.tistory.com/logout/?requestURI='+ myUrl;
	}
	return false;
}
/*링크추가 팝업*/
function addLink(){
	if($("div#loginstate").hasClass("login")){
		window.open("/toolbar/popup/link/");
		//location.href="/toolbar/popup/link/";
	}
	return false;
}
/*글쓰기로 이동*/
function writeTistory(){
	if($("div#loginstate").hasClass("admin")){
		location.href="/admin/entry/post/";
	}
	return false;
}
/*관리 메뉴로 이동*/
function adminTistory(){
	if($("div#loginstate").hasClass("admin")){
		location.href="/admin/center/";
	}
	return false;
}
/*모바일 스크롤바 버그*/
/*반응형 모바일 체크*/
function isMobile(){
	if($(window).width() < 768){
		return true;
	}
	return false;
}
/*오른쪽 사이드메 글 생성*/
function initList(){
	$("section#template div.recentPost ul > li").each(function(index){
		if(index < rightsideListCount){
			html = "<a class='recentlyPost' href='"+$(this).children("a").prop("href")+"'>"+$(this).children("a").html()+"</a>";
			$("aside#rightside div#recentList ol > li:nth-child("+(index+1)+")").html(html);
		}
	});
	$("div.article div.another_category tr th").each(function(index){
		if(index < rightsideListCount){
			html = "<a class='anotherPost' href='"+$(this).children("a").prop("href")+"'>"+$(this).children("a").html()+"</a>";
			$("aside#rightside div#categoryList ol > li:nth-child("+(index+1)+")").html(html);
		}
	});
}
/*최초 댓글 닫기*/
function initComment(){
	changeClassState($("div.actionTrail ul.nav.nav-tabs.nav-justified a"),false);
	changeClassState($("div.tab-content"),false);
}
/*댓글 이벤트*/
function commnet(){
	if($("div.tab-content").hasClass("off")){
		changeClassState($("div.actionTrail ul.nav.nav-tabs.nav-justified a"),true);
		changeClassState($("div.tab-content"),true);
	}else{
		changeClassState($("div.actionTrail ul.nav.nav-tabs.nav-justified a"),false);
		changeClassState($("div.tab-content"),false);
	}
}
/*페이징 만들기*/
function initpaging(){
	maxdom = $("section.paging > span.numbox > a:nth-last-of-type(1) > span");
	//maxurl = maxdom.parent().prop("href");
	selectdom = $("section.paging > span.numbox > a > span.selected");
	//selecturl = maxdom.parent().prop("href");
	html = "<span class='selected'>"+selectdom.html()+"</span>";
	html += "<span class='splite'>/</span>";
	html += "<span class='max'>"+maxdom.html()+"</span>";
	$("section.paging > span.numbox").html(html);
}
/*리스트시 비율 재조정하기*/
function initListRate(){
	$("article > div.searchListEntity").each(function(){
		if($(this).children("a.t-photo").css("display") != "none"){
			if($(this).children("a.t-photo").children("div.thumbnail").children("div.cropzone").children("img").prop("src") != null){
				imgWidthRate = (150 / $(this).width()) * 100;
				$(this).children("a.t-photo").css("width",imgWidthRate+"%");
				$(this).children("div.list-body").css("width",(100 - imgWidthRate)+"%");
				return;
			}
		}
		$(this).children("div.list-body").css("width","100%");
	});
}