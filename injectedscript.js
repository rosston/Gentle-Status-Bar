var isInIFrame = (window.top !== window);
var externalOnly = false;

function SendMessage(name, message)
{
	safari.self.tab.dispatchMessage(name, message);
}

if (isInIFrame === false)
{
	var shift = false;
	var alt = false;
	var command = false;
	var control = false;
	var linkType = null;
	var linkHref = undefined;
	var linkTarget = undefined;
	var statusBar = null;
	
	function parseURL(url)
	{
		var a = document.createElement("a");
		a.href = url;
		return {
			source: url,
			resolved: a.href,
			protocol: a.protocol.replace(":", ""),
			host: a.hostname,
			port: a.port,
			query: a.search,
			params: (function()
			{
				var ret = {},
					seg = a.search.replace(/^\?/, "").split("&"),
					len = seg.length,
					i = 0,
					s;
				for (; i < len; i++)
				{
					if (!seg[i])
					{
						continue;
					}
					s = seg[i].split("=");
					ret[s[0]] = s[1];
				}
				return ret;
			})(),
			file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ""])[1],
			hash: a.hash.replace("#", ""),
			path: a.pathname.replace(/^([^\/])/, "/$1"),
			relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ""])[1],
			segments: a.pathname.replace(/^\//, "").split("/")
		};
	}
	
	function UpdateMessage()
	{
		var intro = "";
		var outro = "";
		var linkShow = parseURL(linkHref).resolved;
		if (linkHref.substr(0, 7).toLowerCase() === "mailto:")
		{
			intro = "Send email to ";
			linkShow = linkShow.substr(7);
		}
		else if (linkHref.substr(0, 4).toLowerCase() === "tel:")
		{
			intro = "Call ";
			linkShow = linkShow.substr(4);
		}
		else if (linkHref.substr(0, 7).toLowerCase() === "callto:")
		{
			intro = "Call ";
			linkShow = linkShow.substr(7);
		}
		else if (linkHref.substr(0, 11).toLowerCase() === "javascript:")
		{
			intro = "Run script ";
			linkShow = linkShow.substr(11);
		}
		else
		{
			if (linkType === "form")
			{
				intro = "Submit to ";
			}
			else
			{
				intro = "Go to "
			}
			if (linkTarget !== undefined && linkTarget !== "" && linkTarget !== "_parent" && linkTarget !== "_self" && linkTarget !== "_top")
			{
				if (linkType === "form")
				{
					intro = "Submit to ";
				}
				else
				{
					intro = "Open ";
				}
				outro = " in a new window";
			}
			if (alt === true && shift === false)
			{
				intro = "Download ";
				outro = "";
			}
			if (command === true)
			{
				if (linkType === "form")
				{
					intro = "Submit to ";
				}
				else
				{
					intro = "Open ";
				}
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
		}
		if (control === true)
		{
			intro = "Display a menu for ";
			outro = "";
		}
		statusBar.find("p").text(intro + "\"" + linkShow + "\"" + outro);
	}
	
	function ShowStatusBar()
	{
		if (linkHref !== undefined)
		{
			UpdateMessage();
			statusBar.stop();
			statusBar.fadeIn("fast", function() { statusBar.addClass("tools-rubenarakelyan-com-safari-gentlestatus-show"); });
		}
	}
	
	function HideStatusBar()
	{
		statusBar.removeClass("tools-rubenarakelyan-com-safari-gentlestatus-show");
		statusBar.stop();
		statusBar.fadeOut("fast");
		if (statusBar.hasClass("tools-rubenarakelyan-com-safari-gentlestatus-right"))
		{
			statusBar.removeClass("tools-rubenarakelyan-com-safari-gentlestatus-right").addClass("tools-rubenarakelyan-com-safari-gentlestatus-left");
		}
	}
	
	$(function()
	{
		$("body").append("<div id=\"tools-rubenarakelyan-com-safari-gentlestatus\" class=\"tools-rubenarakelyan-com-safari-gentlestatus-left\" style=\"display: none;\"><p></p></div>");
		statusBar = $("#tools-rubenarakelyan-com-safari-gentlestatus");
		$(document).keydown(function(e) { DetectKeys(e, true); });
		$(document).keyup(function(e) { DetectKeys(e, false); });
		$("a").live("mouseover", function()
		{
			SendMessage("setting_external_only", null);
			if (externalOnly === false || (externalOnly === true && window.location.hostname !== parseURL(this.href).host))
			{
				linkType = "anchor";
				linkHref = $(this).attr("href");
				linkTarget = $(this).attr("target");
				ShowStatusBar();
			}
		});
		$("form input[type=submit], form input[type=image], form button[type=submit]").live("mouseover", function()
		{
			var formAction = (($(this).attr("formaction") !== undefined) ? $(this).attr("formaction") : (($(this).parent("form").attr("action") !== undefined) ? $(this).parent("form").attr("action") : ""));
			var formTarget = (($(this).attr("formtarget") !== undefined) ? $(this).attr("formtarget") : (($(this).parent("form").attr("target") !== undefined) ? $(this).parent("form").attr("target") : ""));
			SendMessage("setting_external_only", null);
			if (externalOnly === false || (externalOnly === true && window.location.hostname !== parseURL(formAction).host))
			{
				linkType = "form";
				linkHref = formAction;
				linkTarget = formTarget;
				ShowStatusBar();
			}
		});
		$("a, form input[type=submit], form input[type=image], form button[type=submit]").live("mouseout click", function()
		{
			HideStatusBar();
		});
		statusBar.bind("mouseover", function()
		{
			if (statusBar.hasClass("tools-rubenarakelyan-com-safari-gentlestatus-left"))
			{
				statusBar.removeClass("tools-rubenarakelyan-com-safari-gentlestatus-left").addClass("tools-rubenarakelyan-com-safari-gentlestatus-right");
			}
			else
			{
				statusBar.removeClass("tools-rubenarakelyan-com-safari-gentlestatus-right").addClass("tools-rubenarakelyan-com-safari-gentlestatus-left");
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
	
	function HandleMessage(event)
	{
		var name = event.name;
		var message = event.message;
		switch (name)
		{
			case "linkType":
			{
				linkType = message;
				break;
			}
			case "linkHref":
			{
				linkHref = message;
				break;
			}
			case "linkTarget":
			{
				linkTarget = message;
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
				shift = message;
				break;
			}
			case "control":
			{
				control = message;
				break;
			}
			case "alt":
			{
				alt = message;
				break;
			}
			case "command":
			{
				command = message;
				break;
			}
			case "setting_external_only":
			{
				externalOnly = message;
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
			SendMessage("setting_external_only", null);
			var externalOnly = window.top.externalOnly;
			if (externalOnly === false || (externalOnly === true && window.location.hostname !== parseURL(this.href).host))
			{
				SendMessage("linkType", "anchor");
				SendMessage("linkHref", $(this).attr("href"));
				SendMessage("linkTarget", $(this).attr("target"));
				SendMessage("ShowStatusBar", true);
			}
		});
		$("form input[type=submit], form input[type=image], form button[type=submit]").live("mouseover", function()
		{
			var formAction = (($(this).attr("formaction") !== undefined) ? $(this).attr("formaction") : (($(this).parent("form").attr("action") !== undefined) ? $(this).parent("form").attr("action") : ""));
			var formTarget = (($(this).attr("formtarget") !== undefined) ? $(this).attr("formtarget") : (($(this).parent("form").attr("target") !== undefined) ? $(this).parent("form").attr("target") : ""));
			SendMessage("setting_external_only", null);
			var externalOnly = window.top.externalOnly;
			if (externalOnly === false || (externalOnly === true && window.location.hostname !== parseURL(formAction).host))
			{
				SendMessage("linkType", "form");
				SendMessage("linkHref", formAction);
				SendMessage("linkTarget", formTarget);
				SendMessage("ShowStatusBar", true);
			}
		});
		$("a, form input[type=submit], form input[type=image], form button[type=submit]").live("mouseout click", function()
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