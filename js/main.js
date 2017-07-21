function getTime(par){
	var def = {
		con1 : "#data_in",
		con2 : "#data_out",
		con3 : "#new",
		con4 : "#temp",
		con5 : "#night",
		startTime : new Date(),
		night:3
	},
	set = this.extend({},def,par),
	urlObj = this.analysisUrl();
	this.con1 = this.getElement(set.con1);
	this.con2 = this.getElement(set.con2);
	this.con3 = this.getElement(set.con3);
	this.con4 = this.getElement(set.con4);
	this.con5 = this.getElement(set.con5);
	this.startTime =set.startTime;
	this.night = set.night;
	if(urlObj){
		var	sub = Math.ceil((new Date(urlObj.leaveTime) - new Date(urlObj.liveTime))/86400000);
		this.startTime = new Date(urlObj.liveTime);
		this.night = sub;
	}
	this.showTime()
	this.binEvent()
}
getTime.prototype={
	constructor:getTime,
	showTime:function(){
		var year = this.startTime.getFullYear(),
			month = this.startTime.getMonth(),
			day = this.startTime.getDate(),
			sTime = this.getDate(this.startTime);
			eTime = this.getDate(new Date(year,month,day+this.night));
		this.con1.innerText = sTime;
		this.con2.innerText = eTime;
		this.con3.innerText = this.getWeek(sTime);
		this.con4.innerText = this.getWeek(eTime);
		this.con5.innerText = "共"+Math.ceil(( new Date(year,month,day+this.night) - this.startTime)/86400000)+"晚";
	},
	getDate:function(date){
		var y = date.getFullYear(),
			m = date.getMonth(),
			d = date.getDate();
		return y + "年" + addZero(m+1) + "月" + addZero(d) + "日";
	},
	getWeek:function(time){
		var week = ["日","一","二","三","四","五","六"],
			splitTime = time.replace(/\D/g,"-").slice(0,-1);
			sub = Math.ceil((new Date(splitTime) - new Date())/86400000);
		switch(sub){
			case 0 :
			return "今天";
			case 1 :
			return "明天";
			case 2 :
			return "后天";
			default:
			return "周"+week[new Date(splitTime).getDay()];
		}
	},
	analysisUrl:function(){
		var url = location.search,
			obj = {};
		if(!url) return false;
		url = url.substring(1).split("&")
		for(var i=0,len=url.length;i<len;i++){
			var arr = url[i].split("=");
			obj[arr[0]] = arr[1];
		}
		return obj;
	},
	getElement:function(obj){
		return typeof obj =="string" ? document.querySelector(obj) : obj;
	},
	extend:function(){
		for(var i=1,len=arguments.length;i<len;i++){
			for(var key in arguments[i]){
				arguments[0][key] = arguments[i][key];
			}
		}
		return arguments[0];
	},
	binEvent:function(){
		var that = this;
		document.querySelector("#btn").onclick=function(){
			location.href = "html/index.html?liveTime=" + that.con1.innerText + "&leaveTime=" + that.con2.innerText;
		}
	},
	analysisUrl:function(){
		var url = location.search,
			obj = {};
		if(!url) return false;
		url = url.substring(1).split("&")
		for(var i=0,len=url.length;i<len;i++){
			var arr = url[i].split("=");
			obj[arr[0]] = arr[1];
		}
		return obj;
	}
}