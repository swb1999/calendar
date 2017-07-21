function calendar(par){
	var set = {
		quantity:1,
		target:"",
		startTime : new Date(),
		maxDay:7
	};
	for(var key in par){
		set[key] = par[key];
	}
	this.quantity = set.quantity;
	this.target = typeof set.target == "string" ? document.querySelector(set.target) : set.target;
	this.maxDay = set.maxDay;
	this.y = set.startTime.getFullYear();
	this.m = set.startTime.getMonth();
	this.d = set.startTime.getDate();
	this.createCalendar();
	this.selectDate();
	this.highShow();
}
calendar.prototype={
	constructor:calendar,
	createCalendar:function(){
		var week = ["日","一","二","三","四","五","六"],
			weekStr = "",
			str = "";
		for(var i = 0,len = week.length;i<len;i++){
			weekStr += "<li>"+week[i]+"</li>"
		}
		for(var i=0;i<this.quantity;i++){
			var newDate = new Date(this.y,(this.m+i),1),
				newY = newDate.getFullYear(),
				newM = newDate.getMonth(),
				days = this.getDays(newY,newM),
				weekDate =  newDate.getDay(),
				rows = Math.ceil((days + weekDate)/7),
				tableStr = "",
				num = 0,
				prevDays = new Date(this.y,this.m+1,0).getDate();
			for(var r = 0;r < rows;r++){
				tableStr += "<tr>"
				for(var c = 0;c < 7;c++){
					num ++ ;
					newNum = num - weekDate;
					if(newNum<1){
						newNum += prevDays;
						tableStr += "<td class='ligh'><span>"+newNum+"</span></td>";
					}else if(newNum>days){
						newNum -= days;
						tableStr += "<td class='ligh'><span>"+newNum+"</span></td>";
					}else if(newNum<this.d && newM == this.m){
						tableStr += "<td class='bg'><span>"+newNum+"</span></td>";
					}else{
						tableStr += "<td><span>"+newNum+"</span></td>";
					}
				}
				tableStr += "</tr>"
			}
			str += "<section>"+
					"<h2>"+newY+"年"+(addZero(newM+1))+"月</h2>"+
					"<ul>"+weekStr+"</ul>"+
					"<table class='table' id='tab"+(newM+1)+"'>"+tableStr+"</table>"
				"</section>";
		}
		this.target.innerHTML = str;
	},
	getDays:function(year,month){
		var arr = [31,28,31,30,31,30,31,31,30,31,30,31];
		if (year%400 == 0 || (year%4 == 0 && year%100 != 0)) arr[1]=29;
		return arr[month];
	},
	selectDate:function(){
		var flag = true,
			that = this,
			liveY = "",
			liveM = "",
			liveD = "";
		this.target.onclick=function(e){
			var event = e || event,
				target = e.target || e.srcElement,
				nodeB = document.createElement("b");
			if(target.tagName == "TD" && target.className != "bg" && target.className != "ligh"){
				var time = target.parentNode.parentNode.parentNode.parentNode.children[0].innerText.match(/\d+/g),
					selectDay = target.getElementsByTagName("span")[0].innerText;
				if(flag){
					var hoverTd = document.querySelectorAll(".hover");
					for(var i=0,len=hoverTd.length;i<len;i++){
						hoverTd[i].className = "";
					}
					hoverTd[0].removeChild(hoverTd[0].children[1]);
					hoverTd[hoverTd.length-1].removeChild(hoverTd[hoverTd.length-1].children[1]);
					nodeB.innerText = "入住";
					liveY = new Date(time[0],(time[1]-1),selectDay).getFullYear();
					liveM = new Date(time[0],(time[1]-1),selectDay).getMonth();
					liveD = new Date(time[0],(time[1]-1),selectDay).getDate();
					flag = false;
				}else{
					if(target.className == "hover") return;
					nodeB.innerText = "离店";
					leaveY = new Date(time[0],(time[1]-1),selectDay).getFullYear();
					leaveM = new Date(time[0],(time[1]-1),selectDay).getMonth();
					leaveD = new Date(time[0],(time[1]-1),selectDay).getDate();
					var cur = parseInt(new Date(leaveY,leaveM,leaveD) - new Date(liveY,liveM,liveD))/86400000,
						curs = Math.abs(cur)+1,
						par = "";
					if(curs>that.maxDay){
						alert("入住时长不得超过"+that.maxDay+"天");
						return;
					}
					if(cur>=0){
						par = "?liveTime="+liveY+"-"+(liveM+1)+"-"+liveD+"&leaveTime="+leaveY+"-"+(leaveM+1)+"-"+leaveD;
					}else{
						par = "?liveTime="+leaveY+"-"+(leaveM+1)+"-"+leaveD+"&leaveTime="+liveY+"-"+(liveM+1)+"-"+liveD;
					}
					flag = true;
					location.href="../main.html"+par;
				}
				target.appendChild(nodeB);
				target.className = "hover";
			}
		}
	},
	highShow:function(){
		var urlSearch = this.analysisUrl();
		if(!urlSearch) return false;
		var liveM = decodeURI(urlSearch.liveTime).split(/\D/g)[1]*1,
			leaveM =  decodeURI(urlSearch.leaveTime).split(/\D/g)[1]*1,
			liveD = decodeURI(urlSearch.liveTime).split(/\D/g)[2]*1,
			leaveD = decodeURI(urlSearch.leaveTime).split(/\D/g)[2]*1,
			liveTable = document.getElementById("tab"+liveM),
			leaveTable = document.getElementById("tab"+leaveM),
			liveTd = liveTable.getElementsByTagName("td"),
			leaveTd = leaveTable.getElementsByTagName("td");
		if(liveM == leaveM){
			for(var i=0,len=liveTd.length;i<len;i++){
				if(liveTd[i].className == "ligh" || liveTd[i].className == "bg") continue;
				var ind = liveTd[i].children[0].innerText*1,
					nodeB = document.createElement("b");
				if(liveD == ind){
					liveTd[i].className = "hover";
					nodeB.innerText = "入住";
					liveTd[i].appendChild(nodeB);
				}else if(leaveD == ind){
					liveTd[i].className = "hover";
					nodeB.innerText = "离店";
					liveTd[i].appendChild(nodeB);
				}else if(ind>liveD && ind <leaveD){
					liveTd[i].className = "hover";
				}
			}
		}else{

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