// This code is based on some original work by an unknown author
// and has been heavily modified for use with FreeWX and FreeWX-Wi.
// Andy Keir, March 4 2005  7:00pm.
function Graph(width, height, backcol, offset, IsWind, NonMetric, time24) {
this.backcol = backcol;
this.offset = offset;
this.IsWind = IsWind;
this.NonMetric = NonMetric;
this.width = width || 400;
this.height = height || 200;
this.rows = new Array();
this.addRow = _addRowGraph;
this.setXScale = _setXScaleGraph;
this.setXScaleValues = _setXScaleValuesGraph;
this.setTime = _setStartTimeGraph;
this.setDate = _setStartDateGraph;
this.build = _buildGraph;
this.setLegend = _setLegendGraph;
this.writeLegend = _writeLegendGraph;
this.time24 = time24;
return this;
}
function _setLegendGraph() {
this.legends = arguments;
}
function _addRowGraph() {
this.rows[this.rows.length] = new Array();
var row = this.rows[this.rows.length-1];
for(var i = 0; i < arguments.length; i++)
row[row.length] = arguments[i];
}
function _rescaleGraph(g) {
g.posMax = 0, g.negMax = 0, g.c = 0;
for(var i = 0; i < g.rows.length; i++) {
for(var j = 0; j < g.rows[i].length; j++) {
g.c++;
if(g.rows[i][j] > g.posMax) g.posMax = g.rows[i][j];
// if(g.rows[i][j] < -100) g.rows[i][j] = 0;
// if(g.rows[i][j] < -100) g.rows[i][j] = g.offset;
if(g.rows[i][j] < -100) g.rows[i][j] = g.negMax;
if(g.rows[i][j] < g.negMax) g.negMax = g.rows[i][j];
}
}
if(g.NonMetric == 0){
if(g.posMax < 1 && g.posMax >= 0) g.posMax = 1;
}
if(g.NonMetric == 0){
if(g.negMax > -1 && g.negMax < 0) g.negMax = -1;
}
if(g.NonMetric == 1){
if(g.posMax < .03 && g.posMax >= 0) g.posMax = 0.03;
}
if(g.NonMetric == 1){
if(g.negMax > -.03 && g.negMax < 0) g.negMax = -0.03;
}
if(g.IsWind == 1){
g.posMax = 360;
g.negMax = 0
}
g.vscale = g.height/(g.posMax-g.negMax);
g.hscale = Math.floor(g.width/g.c-1/g.rows[0].length);
}
function _writeLegendGraph() {
var st = "";
st += "<TABLE BORDER=1 CELLSPACING=0 CELLPADDING=4><TR><TD><FONT FACE='Arial,Helvetica' SIZE=-1>";
for(var i = 0; i < this.legends.length; i++) {
if(!this.legends[i]) continue;
if(i >= this.rows.length) break;
st += "<IMG SRC=bar.gif BORDER=1 HSPACE=3>"+this.legends[i]+"<BR>\n";
}
st += "</FONT></TD></TR></TABLE>";
return st;
}
function _buildRegGraph(g, doc) {
var str = "";
str += "<TABLE BORDER=0 CELLPADDING=0 CELLSPACING=0>\n";
if(g.title) {
str += "<TR>\n";
if(g.scale) str += "<TD COLSPAN=3></TD>\n";
if(g.yLabel) str += "<TD></TD>\n";
str += "<TH VALIGN=TOP HEIGHT=30 COLSPAN="+(g.c)+">\n";
str += "<FONT FACE='Arial,Helvetica' SIZE=-1>";
str += g.title;
str += "</FONT></TH></TR>\n";
}
if(g.yLabel) {
g.yLabel = g.yLabel.split(" ");
g.yLabel = g.yLabel.join("<BR>\n");
str += "<TR>\n";
var r = 2; if(g.negMax && g.posMax) r++;
str += "<TH ROWSPAN="+r+" ALIGN=LEFT WIDTH=20 NOWRAP>\n";
str += "<FONT FACE='Arial,Helvetica' SIZE=-1>"+g.yLabel+"</FONT></TD>\n";
}
if(g.posMax > 0) {
if(!g.yLabel) str += "<TR>\n";
if(g.scale) str += _writeScaleGraph(g, 0, g.posMax);
str += "<TD VALIGN=BOTTOM";
if(g.bgColor) str += " BGCOLOR=\""+g.bgColor+"\"";
str += ">";
for(var j = 0; j < g.rows[0].length; j++) {
for(var i = 0; i < g.rows.length; i++) {
if(parseInt(g.vscale*g.rows[i][j]) > 0) {
str += "<a href=\"#\" title=\""; 
if(g.legends && g.legends[i]) str += g.legends[i]+": "; 
str += (g.rows[i][j]+g.offset); 
if(g.dates) str += ", "+g.dates[j]; 
str += "\">"; 
str += "<IMG BORDER=0 SRC=\"bar.gif\" ";
str += "ALT=\"";
if(g.legends && g.legends[i]) str += g.legends[i]+": ";
str += (g.rows[i][j]+g.offset);
if(g.dates) str += ", "+g.dates[j];
str += "\" ";
str += "WIDTH="+parseInt(g.hscale)+" ";
str += "HEIGHT="+parseInt(g.vscale*g.rows[i][j])+" ";
str += "></a>"; 
} else
str += "<IMG SRC=clear.gif WIDTH="+parseInt(g.hscale)+" HEIGHT=5>";
str += "</TD>\n<TD VALIGN=BOTTOM";
if(g.bgColor) str += " BGCOLOR=\""+g.bgColor+"\"";
str += ">";
}
str += "<IMG SRC=clear.gif WIDTH=1 HEIGHT=5>";
}
str += "</TD>\n";
}
if(g.legends && g.posMax != 0) {
str += "<TD WIDTH=5 NOWRAP ROWSPAN=3></TD>\n";
str += "<TD ROWSPAN=3>";
str += g.writeLegend();
str += "</TD>\n";
}
if(g.scale || g.xScale) {
if(g.posMax) str += "</TR><TR>\n";
else str += "<TR><TD COLSPAN=2></TD>\n";
str += "<TD BGCOLOR="+g.backcol+" COLSPAN="+(g.c+1)+">";
str += "<IMG SRC=tic.gif HEIGHT=1 WIDTH=";
str += parseInt(g.rows[0].length*g.hscale)+" ></TD></TR>\n";
}
if(g.xScale && !g.negMax)
str += _writeXScaleGraph(g);
if(g.negMax < 0) {
if(g.posMax != 0 && !g.scale) str += "</TR>";
str += "<TR>\n";
if(g.scale) str += _writeNegScaleGraph(g, g.negMax, 0);
str += "<TD VALIGN=TOP";
if(g.bgColor) str += " BGCOLOR=\""+g.bgColor+"\"";
str += ">";
for(var j = 0; j < g.rows[0].length; j++) {
for(var i = 0; i < g.rows.length; i++) {
if(parseInt(g.vscale*g.rows[i][j]) < 0) {
str += "<IMG VSPACE=0 HSPACE=0 BORDER=0 ALIGN=TOP SRC=bar.gif WIDTH="+
parseInt(g.hscale)+" HEIGHT="+
parseInt(-1*g.vscale*g.rows[i][j]);
str += " ALT=\"";
if(g.legends && g.legends[i]) str += g.legends[i]+": ";
str += (g.rows[i][j]+g.offset);
if(g.dates) str += ", "+g.dates[j];
str += "\" >";
} else
// this appears to be the code that writes the X axis if there are negative values
str += "<IMG SRC=clear.gif ALIGN=TOP BORDER=0 WIDTH="+parseInt(g.hscale)+
" HEIGHT=5>";
str += "</TD>\n<TD VALIGN=TOP";
if(g.bgColor) str += " BGCOLOR=\""+g.bgColor+"\"";
str += ">";
}
str += "<IMG SRC=clear.gif ALIGN=TOP WIDTH=1 BORDER=0 HEIGHT=5>";
}
str += "</TD>\n";
if(g.legends && g.posMax == 0) {
str += "<TD WIDTH=5 NOWRAP ROWSPAN=2></TD><TD>";
str += g.writeLegend();
str += "</TD>\n";
}
}
str += "</TD></TR>\n";
if(g.xLabel) {
str += "<TR>\n";
if(g.scale) str += "<TD COLSPAN=3></TD>\n";
if(g.yLabel) str += "<TD></TD>\n";
str += "<TH COLSPAN="+g.c+" HEIGHT=25 VALIGN=BOTTOM><FONT FACE='Arial,Helvetica' SIZE=-1>";
str += g.xLabel;
str += "</FONT></TH></TR>\n";
}
str += "</TABLE>\n";
doc.write(str); 
}
function _setXScaleGraph(s, skip, inc) {
this.xScale = true;
this.s = s || 0;
this.skip = skip || 1;
this.inc = inc || 1;
}
function _setXScaleValuesGraph() {
this.xScale = true;
this.s = 0;
this.skip = 1;
this.inc = 1;
this.dates = new Array();
for(var i = 0; i < arguments.length; i++)
this.dates[this.dates.length] = arguments[i];
}
function _setStartTimeGraph(hour, min, skip, inc) {
this.xScale = true;
this.sTime = new Date(0, 0, 0, hour, min);
this.skip = skip || 1;
this.inc = inc || 1;
}
function _setStartDateGraph(month, day, year, skip, inc) {
this.xScale = true;
this.sDate = new Date(year, month-1, day);
this.skip = skip || 1;
this.inc = inc || skip || 1;
this.showDate = true;
}
function _setDatesArrayGraph(g) {
if(g.dates) return;
g.dates = new Array();
for(var i = 0; i < g.rows[0].length; i++) {
var dateStr = "";
if(g.sDate) {
if(g.showDay) {
eval('switch(g.sDate.getDay()) {'+
'case 0: dateStr += "Sun"; break;'+
'case 1: dateStr += "Mon"; break;'+
'case 2: dateStr += "Tue"; break;'+
'case 3: dateStr += "Wed"; break;'+
'case 4: dateStr += "Thu"; break;'+
'case 5: dateStr += "Fri"; break;'+
'case 6: dateStr += "Sat"; break;'+
'}');
dateStr += " ";
}
if(g.longDate && g.showDate) {
dateStr += g.sDate.getDate()+"-";
eval('switch(g.sDate.getMonth()) {'+
'case 0: dateStr += "Jan"; break;'+
'case 1: dateStr += "Feb"; break;'+
'case 2: dateStr += "Mar"; break;'+
'case 3: dateStr += "Apr"; break;'+
'case 4: dateStr += "May"; break;'+
'case 5: dateStr += "Jun"; break;'+
'case 6: dateStr += "Jul"; break;'+
'case 7: dateStr += "Aug"; break;'+
'case 8: dateStr += "Sep"; break;'+
'case 9: dateStr += "Oct"; break;'+
'case 10: dateStr += "Nov"; break;'+
'case 11: dateStr += "Dec"; break;'+
'}');
} else if(g.showDate) dateStr += (g.sDate.getMonth()+1)+"/"+g.sDate.getDate();
if(g.showYear && g.showDate) {
if(g.longDate) dateStr += "-";
else dateStr += "/";
}
if(g.showYear) {
if(g.longYear) dateStr += g.sDate.getFullYear();
else dateStr += (g.sDate.getFullYear()%100);
}
g.sDate.setDate(g.sDate.getDate()+ g.inc);
} else if(g.sTime) {
var hrs = g.sTime.getHours();
if(!g.time24) {
var pm = false;
if(hrs == 0) { hrs = 12; }
else if(hrs >= 12) { if(hrs > 12) hrs -= 12; pm = true; }
} else 
if(hrs < 10) hrs = "0" + hrs;
dateStr = hrs + ":";
var min = g.sTime.getMinutes();
if(min < 10) min = "0" + min;
dateStr += min;
if(!g.time24) { !pm ? dateStr += "am" : dateStr += "pm" ; }
g.sTime.setMinutes(g.sTime.getMinutes()+ g.inc); 
} else dateStr = g.s+i*g.inc;
g.dates[i] = dateStr;
}
}
function _writeXScaleGraph(g) {
var st = "";
if(!g.c) g.c = g.rows[0].length*2-1;
st += "<TR>\n";
if(g.scale) st += "<TD COLSPAN=2></TD>\n";
if(g.yLabel) st += "<TD></TD>\n";
st += "<TD VALIGN=TOP COLSPAN="+(g.c+1)+">";
st += "<IMG SRC=tic.gif HEIGHT=10 WIDTH=1>";
st += "<IMG SRC=clear.gif HEIGHT=1 WIDTH=1>";
var n = g.rows[0].length;
var mult = g.rows.length;
for(var i = 0; i < n; i++) {
st += "<IMG SRC=clear.gif HEIGHT=1 WIDTH="+(g.hscale*mult)+">";
if((i+1) % g.skip)
st += "<IMG SRC=clear.gif HEIGHT=10 WIDTH=1>";
else
st += "<IMG SRC=tic.gif HEIGHT=10 WIDTH=1>";
}
st += "</TD></TR><TR>\n";
if(g.scale) st += "<TD COLSPAN=3></TD>\n";
if(g.yLabel) st += "<TD></TD>\n";
var cspan = g.rows.length;
cspan *= g.skip;
if(g.sDate || g.sTime) _setDatesArrayGraph(g);
var t = 0;
for(var i = 0; i < Math.floor(g.rows[0].length/g.skip); i++) {
st += "<TD VALIGN=TOP";
st += " COLSPAN="+cspan; t += cspan;
st += "><FONT FACE='Arial,Helvetica' SIZE=-3><I>";
st += g.dates[i*g.skip] || "";
st += "</I></FONT></TD>\n";
}
var len = g.rows[0].length;
if(i < Math.ceil(g.rows[0].length/g.skip)) {
st += "<TD VALIGN=TOP";
st += " COLSPAN="+(len-t);
st += "><FONT FACE='Arial,Helvetica' SIZE=-3><I>";
st += g.dates[i*g.skip];
st += "</I></FONT></TD>\n";
}
st += "</TR>\n"; 
return st;
}
function _writeNegScaleGraph(g, min, max) {
var h = Math.ceil(g.height/(g.posMax-g.negMax)*g.scale);
var p = -1*g.negMax/(g.posMax-g.negMax);
var n = Math.floor(g.height*p/h);
var st = "";
if(h < 15) {
if(!g.posMax)
alert("Warning! Scale is too small! Please make\nthe scale larger or make the graph taller.");
st += "<TD></TD><TD></TD><TD></TD>\n"
return st;
}
st += "<TD VALIGN=TOP ALIGN=RIGHT>";
var H = h - 3;
for(var i = 0; i < n; i++) {
st += "<FONT FACE=Arial,Helvetica SIZE=-3><I>"+(g.scale*-1*(i+1)+g.offset)+"</I></FONT>";
st += "<IMG SRC=clear.gif WIDTH=1 HEIGHT="+H+"><BR>\n";
}
st += "</TD>\n";
st += "<TD VALIGN=TOP>";
for(var i = 0; i < n; i++) {
st += "<IMG SRC=clear.gif WIDTH=1 HEIGHT="+(h-1)+"><BR>\n";
st += "<IMG SRC=tic.gif WIDTH=6 HEIGHT=1><BR>\n";
}
st += "</TD>\n";
st += "<TD VALIGN=TOP>";
st += "<IMG SRC=tic.gif WIDTH=1 HEIGHT="+(g.height*p)+">";
st += "<IMG SRC=clear.gif WIDTH=1 HEIGHT="+(g.height*p)+">";
st += "</TD>\n"
return st;
}
function _writeScaleGraph(g, min, max) {
var h;
var p = g.posMax/(g.posMax-g.negMax);
h = Math.ceil(g.height/(g.posMax-g.negMax)*g.scale);
var n = Math.floor(g.height*p/h);
var st = "";
if(h < 15) {
alert("Warning! Scale is too small! Please make\nthe scale larger or make the graph taller.");
st += "<TD ROWSPAN=2></TD><TD ROWSPAN=2></TD><TD></TD>\n"
return st;
}
st += "<TD VALIGN=BOTTOM ROWSPAN=2 ALIGN=RIGHT>";
var H = h - 3;
//var original=28.453
//round "original" to two decimals
//var result=Math.round(original*100)/100  //returns 28.45
for(var i = 0; i < n; i++) {
st += "<FONT FACE=Arial,Helvetica SIZE=-3><I>"+Math.round((g.scale*(n-1)-g.scale*i+g.offset)*100)/100;
st += "</I></FONT>";
st += "<IMG SRC=clear.gif WIDTH=1 HEIGHT="+H+"><BR>\n";
}
st += "</TD>\n";
st += "<TD VALIGN=BOTTOM ROWSPAN=2>";
for(var i = 0; i < n; i++) {
st += "<IMG SRC=tic.gif WIDTH=6 HEIGHT=1><BR>\n";
st += "<IMG SRC=clear.gif WIDTH=1 HEIGHT="+(h-1)+"><BR>\n";
}
st += "<IMG SRC=tic.gif WIDTH=6 HEIGHT=1><BR>\n";
st += "</TD>\n";
st += "<TD VALIGN=BOTTOM>";
st += "<IMG SRC=tic.gif WIDTH=1 HEIGHT="+(g.height*p)+">";
st += "<IMG SRC=clear.gif WIDTH=1 HEIGHT="+(g.height*p)+">";
st += "</TD>\n"
return st;
}
function _adjustOffsetGraph(g) {
for(var i = 0; i < g.rows.length; i++)
for(var j = 0; j < g.rows[i].length; j++)
g.rows[i][j] -= g.offset;
}
function _buildGraph(d) {
doc = d || document;
if(!this.rows) return;
if(this.rows.length == 0) {
doc.write("<TABLE><TR><TD><TT>[empty graph]</TT></TD></TR></TABLE>\n");
return;
}
_adjustOffsetGraph(this);
if(this.xScale) _setDatesArrayGraph(this);
_rescaleGraph(this);
_buildRegGraph(this, doc);
}
