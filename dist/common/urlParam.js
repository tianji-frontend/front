/* build at 2013-07-15 10:07:39 */
define(function(a,b){b.urlParam=function(a,b){var c="",d=[];c=a.substring(a.indexOf("?")+1),d=c.split("&");for(var e=0,f=d.length;f>e;e++){if(-1==d[e].indexOf("="))return"";var g=d[e].split("=");if(g[0]==b)return g[1]}return""}});