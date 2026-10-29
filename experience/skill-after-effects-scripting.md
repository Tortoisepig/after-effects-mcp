# After Effects Scripting 經驗庫

## 🔧 文字分行多字重多字級自動化與 characterRange 結束索引陷阱
**日期：** 2026-10-29
**技能：** after-effects-scripting
**情境：** 批次更新時間軸所有歷屆人物文字圖層，將第一行人名設為 Bold 80pt，第二行年份任職設為 Medium 50pt，中途出現末尾 4 個字未被套用樣式的問題。
**解法：**
- 檢查 `CharacterRange` 物件屬性發現其內部為 `characterStart` 與 `characterEnd`。
- 原程式碼誤寫為 `td.characterRange(newlineIdx + 1, yearLength)`，導致第 11~15 字元（如 `87任職`、`94任職`）被排除在選取範圍外。
- 修正為 `td.characterRange(newlineIdx + 1, td.text.length)` 即可全字串覆蓋至結尾。
- 透過 ExtendScript Bridge IPC，在檔案傳輸時使用 UTF-8 編碼確保繁體中文無亂碼。
**關鍵檔案/路徑：**
- src/scripts/mcp-bridge-auto.jsx
- build/scripts/mcp-bridge-auto.jsx
- C:\Users\garry\Documents\ae-mcp-bridge\ae_command.json
**keywords：** after-effects, extendscript, characterRange, textDocument, fontSize, fontStyle, typography, mcp-bridge

