# After Effects 自動化與 ExtendScript 最佳實踐

## 🔧 After Effects ExtendScript 文字分行樣式控制與字元範圍 (characterRange) 排版最佳實踐
**日期：** 2026-10-29
**情境：** 在 After Effects 單一文字圖層中對不同行（如人名與年份）套用不同字級與字重（例如第一行 Bold 80pt，第二行 Medium 50pt）。
**最佳實踐：**
- **characterRange 參數陷阱**：`td.characterRange(start, end)` 的第二個參數是「結束字元索引（End Index）」，而非「字元長度（Length）」。若要選取至文字結尾，必須傳入 `td.text.length`（例如 `td.characterRange(newlineIdx + 1, td.text.length)`），若誤傳長度會導致結尾字元遺漏未套用樣式。
- **視覺縮放 (Scale) vs 字級 (fontSize)**：在 AE 預覽視窗中使用滑鼠拖拉文字外框，改動的是圖層的 `Transform > Scale`，而非 Character 面板的 `fontSize`。自動化統一文字外觀時，必須先確認各圖層的 Scale 是否為 100%，避免產生視覺大小與屬性不一致的錯覺。
- **分行字元識別**：AE TextDocument 內部分行字元標準為 `\r` (Carriage Return)，部分情況可能包含 `\n`，分割與搜尋換行時建議以 `indexOf('\r')` 為主並 fallback `indexOf('\n')`。
- **UndoGroup 事務包裹**：批次修改多個圖層或文字屬性時，務必使用 `app.beginUndoGroup("...")` 與 `app.endUndoGroup()` 包裹，以便使用者在 AE 介面能單鍵 (Ctrl+Z) 完整復原。

