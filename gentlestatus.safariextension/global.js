var externalOnly = safari.extension.settings.getItem("external_only");

function GlobalHandleMessage(event)
{
	var name = event.name;
	var message = event.message;
	switch (name)
	{
		case "linkType":
		{
			GlobalReturnMessage("linkType", message);
			break;
		}
		case "linkHref":
		{
			GlobalReturnMessage("linkHref", message);
			break;
		}
		case "linkTarget":
		{
			GlobalReturnMessage("linkTarget", message);
			break;
		}
		case "UpdateMessage":
		{
			GlobalReturnMessage("UpdateMessage", true);
			break;
		}
		case "ShowStatusBar":
		{
			GlobalReturnMessage("ShowStatusBar", true);
			break;
		}
		case "HideStatusBar":
		{
			GlobalReturnMessage("HideStatusBar", true);
			break;
		}
		case "shift":
		{
			GlobalReturnMessage("shift", message);
			break;
		}
		case "control":
		{
			GlobalReturnMessage("control", message);
			break;
		}
		case "alt":
		{
			GlobalReturnMessage("alt", message);
			break;
		}
		case "command":
		{
			GlobalReturnMessage("command", message);
			break;
		}
		case "setting_external_only":
		{
			GlobalReturnMessage("setting_external_only", externalOnly);
			break;
		}
	}
}

function GlobalHandleEvent(event)
{
	if (event.key === "external_only")
	{
		externalOnly = safari.extension.settings.getItem("external_only");
	}
}

function GlobalReturnMessage(name, message)
{
	safari.application.activeBrowserWindow.activeTab.page.dispatchMessage(name, message);
}

safari.application.addEventListener("message", GlobalHandleMessage, false);
safari.extension.settings.addEventListener("change", GlobalHandleEvent, false);