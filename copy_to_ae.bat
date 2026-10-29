@echo off
chcp 65001 >nul
copy /Y "d:\After Effect MCP\build\scripts\mcp-bridge-auto.jsx" "C:\Program Files\Adobe\Adobe After Effects 2026\Support Files\Scripts\ScriptUI Panels\mcp-bridge-auto.jsx"
if exist "C:\Program Files\Adobe\Adobe After Effects 2025\Support Files\Scripts\ScriptUI Panels" (
    copy /Y "d:\After Effect MCP\build\scripts\mcp-bridge-auto.jsx" "C:\Program Files\Adobe\Adobe After Effects 2025\Support Files\Scripts\ScriptUI Panels\mcp-bridge-auto.jsx"
)
if exist "C:\Program Files\Adobe\Adobe After Effects 2023\Support Files\Scripts\ScriptUI Panels" (
    copy /Y "d:\After Effect MCP\build\scripts\mcp-bridge-auto.jsx" "C:\Program Files\Adobe\Adobe After Effects 2023\Support Files\Scripts\ScriptUI Panels\mcp-bridge-auto.jsx"
)
echo Done.

