var externalOnly = safari.extension.settings.getItem("external_only");

function GlobalHandleMessage(MsgEvent)
{
	var MsgName = MsgEvent.name;
	var MsgData = MsgEvent.message;
	switch (MsgName)
	{
		case "linkHref":
		{
			GlobalReturnMessage("linkHref", MsgData);
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
			GlobalReturnMessage("shift", MsgData);
			break;
		}
		case "control":
		{
			GlobalReturnMessage("control", MsgData);
			break;
		}
		case "alt":
		{
			GlobalReturnMessage("alt", MsgData);
			break;
		}
		case "command":
		{
			GlobalReturnMessage("command", MsgData);
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

function GlobalReturnMessage(MsgName, MsgData)
{
	safari.application.activeBrowserWindow.activeTab.page.dispatchMessage(MsgName, MsgData);
}

safari.application.addEventListener("message", GlobalHandleMessage, false);
safari.extension.settings.addEventListener("change", GlobalHandleEvent, false);