var isInIFrame = (window.top !== window);
var externalOnly = false;

function SendMessage(MsgName, MsgData)
{
	safari.self.tab.dispatchMessage(MsgName, MsgData);
}

function parseURL(url)
{
    var a = document.createElement('a');
    a.href = url;
    return {
        source: url,
        protocol: a.protocol.replace(':', ''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function()
        {
            var ret = {},
                seg = a.search.replace(/^\?/, '').split('&'),
                len = seg.length, i = 0, s;
            for (; i < len; i++)
            {
                if (!seg[i])
                {
                	continue;
                }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
        hash: a.hash.replace('#', ''),
        path: a.pathname.replace(/^([^\/])/, '/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
        segments: a.pathname.replace(/^\//,'').split('/')
    };
}

if (isInIFrame === false)
{
	var shift = false;
	var alt = false;
	var command = false;
	var control = false;
	var linkHref = "";
	
	function UpdateMessage()
	{
		var intro = "";
		var outro = "";
		var linkShow = "";
		var urlParams = {};
		if (linkHref.substr(0, 7).toLowerCase() === "mailto:")
		{
			intro = "Send email to ";
			linkShow = linkHref.substr(7);
		}
		else if (linkHref.substr(0, 4).toLowerCase() === "tel:")
		{
			intro = "Call ";
			linkShow = linkHref.substr(4);
		}
		else if (linkHref.substr(0, 7).toLowerCase() === "callto:")
		{
			intro = "Call ";
			linkShow = linkHref.substr(7);
		}
		else if (linkHref.substr(0, 4).toLowerCase() === "aim:")
		{
			intro = "Send instant message to ";
			(function()
			{
				var e, d = function(s)
				{
					return decodeURIComponent(s.replace(/\+/g, " "));
				},
				q = linkHref.split("?")[1], r = /([^&=]+)=?([^&]*)/g;
				while (e = r.exec(q)) urlParams[d(e[1])] = d(e[2]);
			})();
			linkShow = urlParams["screenname"];
		}
		else if (linkHref.substr(0, 6).toLowerCase() === "msnim:")
		{
			intro = "Send instant message to ";
			linkShow = linkHref.substr(6);
		}
		else if (linkHref.substr(0, 11).toLowerCase() === "javascript:")
		{
			intro = "Run script ";
			linkShow = linkHref.substr(11);
		}
		else
		{
			intro = "Go to "
			if (alt === true && shift === false)
			{
				intro = "Download ";
			}
			if (command === true)
			{
				intro = "Open ";
				outro = " in a new";
				if (alt === true)
				{
					outro = outro + " window";
				}
				else
				{
					outro = outro + " tab";
				}
				if (shift === true)
				{
					outro = outro + "";
				}
				else
				{
					outro = outro + " behind the current one";
				}
			}
			linkShow = linkHref;
		}
		if (control === true)
		{
			intro = "Display a menu for ";
			outro = "";
			linkShow = linkHref;
		}
		$("#aaGentleStatus p").text(intro + "\"" + linkShow + "\"" + outro);
	}
	
	function ShowStatusBar()
	{
		if (linkHref !== "")
		{
			UpdateMessage();
			$("#aaGentleStatus").addClass("aaGentleStatusShow");
		}
	}
	
	function HideStatusBar()
	{
		$("#aaGentleStatus").removeClass("aaGentleStatusShow");
		if ($("#aaGentleStatus").hasClass("aaGentleStatusRight"))
		{
			$("#aaGentleStatus").removeClass("aaGentleStatusRight");
			$("#aaGentleStatus").addClass("aaGentleStatusLeft");
		}
	}
	
	$(function()
	{
		$("body").append("<div id=\"aaGentleStatus\"><p></p></div>");
		$("#aaGentleStatus").addClass("aaGentleStatusLeft");
		$(document).keydown(function(e) { DetectKeys(e, true); });
		$(document).keyup(function(e) { DetectKeys(e, false); });
		$("a").live("mouseover", function()
		{
			SendMessage("setting_external_only", null);
			if (externalOnly === false || (externalOnly === true && window.location.hostname !== parseURL(this.href).host))
			{
				linkHref = this.href;
				ShowStatusBar();
			}
		});
		$("a").live("mouseout", function()
		{
			HideStatusBar();
		});
		$("a").live("click", function()
		{
			HideStatusBar();
		});
		$("#aaGentleStatus").bind("mouseover", function()
		{
			if ($("#aaGentleStatus").hasClass("aaGentleStatusLeft"))
			{
				$("#aaGentleStatus").removeClass("aaGentleStatusLeft");
				$("#aaGentleStatus").addClass("aaGentleStatusRight");
			}
			else
			{
				$("#aaGentleStatus").removeClass("aaGentleStatusRight");
				$("#aaGentleStatus").addClass("aaGentleStatusLeft");
			}
		});
	});
		   
	function DetectKeys(e, k)
	{
		if (e.keyCode === 16)
		{
			shift = k;
		}
		else if (e.keyCode === 17)
		{
			control = k;
		}
		else if (e.keyCode === 18)
		{
			alt = k;
		}
		else if (e.keyCode === 91 || e.keyCode === 92)
		{
			command = k;
		}
		UpdateMessage();
	}
	
	function HandleMessage(MsgEvent)
	{
		var MsgName = MsgEvent.name;
		var MsgData = MsgEvent.message;
		switch (MsgName)
		{
			case "linkHref":
			{
				linkHref = MsgData;
				break;
			}
			case "UpdateMessage":
			{
				UpdateMessage();
				break;
			}
			case "ShowStatusBar":
			{
				ShowStatusBar();
				break;
			}
			case "HideStatusBar":
			{
				HideStatusBar();
				break;
			}
			case "shift":
			{
				shift = MsgData;
				break;
			}
			case "control":
			{
				control = MsgData;
				break;
			}
			case "alt":
			{
				alt = MsgData;
				break;
			}
			case "command":
			{
				command = MsgData;
				break;
			}
			case "setting_external_only":
			{
				externalOnly = MsgData;
				break;
			}
		}
	}
	
	safari.self.addEventListener("message", HandleMessage, false);
}
else
{
	$(function()
	{
		$(document).keydown(function(e) { DetectKeys(e, true); });
		$(document).keyup(function(e) { DetectKeys(e, false); });
		$("a").live("mouseover", function()
		{
			SendMessage("linkHref", this.href);
			SendMessage("ShowStatusBar", true);
		});
		$("a").live("mouseout", function()
		{
			SendMessage("HideStatusBar", true);
		});
		$("a").live("click", function()
		{
			SendMessage("HideStatusBar", true);
		});
	});
	
	function DetectKeys(e, k)
	{
		if (e.keyCode === 16)
		{
			SendMessage("shift", k);
		}
		else if (e.keyCode === 17)
		{
			SendMessage("control", k);
		}
		else if (e.keyCode === 18)
		{
			SendMessage("alt", k);
		}
		else if (e.keyCode === 91 || e.keyCode === 92)
		{
			SendMessage("command", k);
		}
		SendMessage("UpdateMessage", true);
	}
}