# 《神社保衛戰》照著做：1 小時做出自己的遊戲 ⛩️

歡迎來玩～這裡示範怎麼用 ChatGPT（我們用付費版 Plus；免費版也勉強可以，只是額度比較少，不能反覆修改太多次喔）的「工作」模式（Codex），從一份遊戲企畫開始，一步一步做出能玩的網頁遊戲《神社保衛戰》。照著做需要的東西都在這裡：提示詞、每一步的檢查清單和存檔點，還有三個可以直接線上玩的版本。

實際花的時間：從第 1 步到第一版能玩，約 39 分鐘；加上第 7 步，大約一小時。不用趕，慢慢做也沒關係～

## 快速連結 ✨

| 我想… | 點這裡 |
| --- | --- |
| 先玩玩看，不用下載 | **[線上試玩](https://mojimojilab.github.io/shrine-defense-demo/)**，三個版本都能直接開 |
| 下載到自己的電腦玩 | **[單機版，雙擊就能玩](https://mojimojilab.github.io/shrine-defense-demo/#offline)**：一個檔案（約 17 MB），不用安裝任何東西 |
| 整包帶走 | **[下載整包 ZIP](https://github.com/MojimojiLab/shrine-defense-demo/archive/refs/heads/main.zip)**（約 93 MB）。也可以按這頁右上角綠色的 Code → Download ZIP |
| 照著做 | [遊戲企畫.txt](%E9%81%8A%E6%88%B2%E4%BC%81%E7%95%AB.txt)（第 1 步要上傳）、[提示詞.md](%E6%8F%90%E7%A4%BA%E8%A9%9E.md)（照順序貼）、[檢查清單.md](%E6%AA%A2%E6%9F%A5%E6%B8%85%E5%96%AE.md)（每一步驗收） |
| 第 7 步要上傳的素材包 | [音效 shrine-defense-sfx.zip](https://github.com/MojimojiLab/shrine-defense-demo/raw/main/%E7%B4%A0%E6%9D%90%E5%8C%85%EF%BC%88%E4%B8%8A%E5%82%B3%E7%94%A8%EF%BC%89/shrine-defense-sfx.zip)、[BGM shrine-defense-bgm.zip](https://github.com/MojimojiLab/shrine-defense-demo/raw/main/%E7%B4%A0%E6%9D%90%E5%8C%85%EF%BC%88%E4%B8%8A%E5%82%B3%E7%94%A8%EF%BC%89/shrine-defense-bgm.zip)（點了直接下載） |
| 沒有自己的角色圖 | [角色海報](%E8%A7%92%E8%89%B2%E6%B5%B7%E5%A0%B1/Machakon-Poster-2026.jpg) |
| 卡住了，想從某一步接著做 | [存檔點/](%E5%AD%98%E6%AA%94%E9%BB%9E/)（每一步我們做出來的圖，別擔心，下載了接著做就好） |
| 試聽音樂和音效 | [試聽頁](https://mojimojilab.github.io/shrine-defense-demo/#sound) |

## 怎麼用 🍵

1. 打開 [提示詞.md](%E6%8F%90%E7%A4%BA%E8%A9%9E.md)，照順序貼到同一個對話串。
2. 每一步做完，看 [檢查清單.md](%E6%AA%A2%E6%9F%A5%E6%B8%85%E5%96%AE.md)。和你的不一樣也沒關係，看「如果和你的不一樣」就好～
3. 卡住了？別擔心！到 [存檔點/](%E5%AD%98%E6%AA%94%E9%BB%9E/) 下載這一步的圖，拖進對話串，請 AI 用這張接著做。
4. 想做你自己的世界：先改 [遊戲企畫.txt](%E9%81%8A%E6%88%B2%E4%BC%81%E7%95%AB.txt) 的題材（角色在幹嘛、要克服什麼、怎樣算贏），再從第 1 步開始。

下表每一格都可以點：步驟編號連到那一步的檢查清單，提示詞連到原文。

| 步驟 | 做什麼 | 提示詞 | 要上傳的檔案 | 這一步的存檔點 |
| --- | --- | --- | --- | --- |
| [1](%E6%AA%A2%E6%9F%A5%E6%B8%85%E5%96%AE.md#%E7%AC%AC-1-%E6%AD%A5%E8%A6%8F%E5%8A%83) | 規劃 | [第 1 則](%E6%8F%90%E7%A4%BA%E8%A9%9E.md#%E7%AC%AC-1-%E5%89%87) | [遊戲企畫.txt](%E9%81%8A%E6%88%B2%E4%BC%81%E7%95%AB.txt) | — |
| [2](%E6%AA%A2%E6%9F%A5%E6%B8%85%E5%96%AE.md#%E7%AC%AC-2-%E6%AD%A5%E4%B8%BB%E8%A7%92) | 主角 | [第 2 則](%E6%8F%90%E7%A4%BA%E8%A9%9E.md#%E7%AC%AC-2-%E5%89%87)、[第 3 則](%E6%8F%90%E7%A4%BA%E8%A9%9E.md#%E7%AC%AC-3-%E5%89%87) | 你的角色圖（沒有就用 [角色海報/](%E8%A7%92%E8%89%B2%E6%B5%B7%E5%A0%B1/)） | [存檔點/步驟2-巫女圖集.png](%E5%AD%98%E6%AA%94%E9%BB%9E/%E6%AD%A5%E9%A9%9F2-%E5%B7%AB%E5%A5%B3%E5%9C%96%E9%9B%86.png) |
| [3](%E6%AA%A2%E6%9F%A5%E6%B8%85%E5%96%AE.md#%E7%AC%AC-3-%E6%AD%A5%E8%83%8C%E6%99%AF) | 背景 | [第 4 則](%E6%8F%90%E7%A4%BA%E8%A9%9E.md#%E7%AC%AC-4-%E5%89%87) | — | [存檔點/步驟3-背景.png](%E5%AD%98%E6%AA%94%E9%BB%9E/%E6%AD%A5%E9%A9%9F3-%E8%83%8C%E6%99%AF.png) |
| [4](%E6%AA%A2%E6%9F%A5%E6%B8%85%E5%96%AE.md#%E7%AC%AC-4-%E6%AD%A5%E6%95%B5%E4%BA%BA) | 敵人 | [第 5 則](%E6%8F%90%E7%A4%BA%E8%A9%9E.md#%E7%AC%AC-5-%E5%89%87)、[第 6 則](%E6%8F%90%E7%A4%BA%E8%A9%9E.md#%E7%AC%AC-6-%E5%89%87) | — | [存檔點/步驟4-赤角小鬼-圖集.png](%E5%AD%98%E6%AA%94%E9%BB%9E/%E6%AD%A5%E9%A9%9F4-%E8%B5%A4%E8%A7%92%E5%B0%8F%E9%AC%BC-%E5%9C%96%E9%9B%86.png) |
| [5](%E6%AA%A2%E6%9F%A5%E6%B8%85%E5%96%AE.md#%E7%AC%AC-5-%E6%AD%A5boss-%E5%92%8C%E6%8B%9B%E5%BC%8F) | BOSS 和招式 | [第 7 則](%E6%8F%90%E7%A4%BA%E8%A9%9E.md#%E7%AC%AC-7-%E5%89%87) | — | [存檔點/步驟5-災厄鬼王-圖集.png](%E5%AD%98%E6%AA%94%E9%BB%9E/%E6%AD%A5%E9%A9%9F5-%E7%81%BD%E5%8E%84%E9%AC%BC%E7%8E%8B-%E5%9C%96%E9%9B%86.png) |
| [6](%E6%AA%A2%E6%9F%A5%E6%B8%85%E5%96%AE.md#%E7%AC%AC-6-%E6%AD%A5%E7%AC%AC%E4%B8%80%E7%89%88) | 第一版 | [第 8 則](%E6%8F%90%E7%A4%BA%E8%A9%9E.md#%E7%AC%AC-8-%E5%89%87) | — | — |
| [7](%E6%AA%A2%E6%9F%A5%E6%B8%85%E5%96%AE.md#%E7%AC%AC-7-%E6%AD%A5%E4%BF%AE%E5%95%8F%E9%A1%8C) | 修問題 | [第 9 則](%E6%8F%90%E7%A4%BA%E8%A9%9E.md#%E7%AC%AC-9-%E5%89%87)、[第 10 則](%E6%8F%90%E7%A4%BA%E8%A9%9E.md#%E7%AC%AC-10-%E5%89%87%E7%AF%84%E4%BE%8B%E4%B8%8D%E8%A6%81%E7%85%A7%E6%8A%84) | [shrine-defense-sfx.zip](%E7%B4%A0%E6%9D%90%E5%8C%85%EF%BC%88%E4%B8%8A%E5%82%B3%E7%94%A8%EF%BC%89/shrine-defense-sfx.zip)、[shrine-defense-bgm.zip](%E7%B4%A0%E6%9D%90%E5%8C%85%EF%BC%88%E4%B8%8A%E5%82%B3%E7%94%A8%EF%BC%89/shrine-defense-bgm.zip)（[素材包（上傳用）/](%E7%B4%A0%E6%9D%90%E5%8C%85%EF%BC%88%E4%B8%8A%E5%82%B3%E7%94%A8%EF%BC%89/)） | — |

## 資料夾

| 資料夾／檔案 | 用在哪裡 |
| --- | --- |
| [遊戲企畫.txt](%E9%81%8A%E6%88%B2%E4%BC%81%E7%95%AB.txt) | 第 1 步。九行，可以照用，也可以改成你的題材 |
| [提示詞.md](%E6%8F%90%E7%A4%BA%E8%A9%9E.md) | 十則提示詞原文 |
| [檢查清單.md](%E6%AA%A2%E6%9F%A5%E6%B8%85%E5%96%AE.md) | 每一步的驗收項目，附我們的成品圖 |
| [角色海報/](%E8%A7%92%E8%89%B2%E6%B5%B7%E5%A0%B1/) | 第 2 步的參考圖。沒有自己的角色圖就用它 |
| [存檔點/](%E5%AD%98%E6%AA%94%E9%BB%9E/) | 每一步我們做出來的圖。檔名開頭是第幾步 |
| [素材包（上傳用）/](%E7%B4%A0%E6%9D%90%E5%8C%85%EF%BC%88%E4%B8%8A%E5%82%B3%E7%94%A8%EF%BC%89/) | 第 7 步上傳給 AI 的兩個壓縮檔（音效、BGM），裡面的 README 寫好每個檔案用在哪裡 |
| [音效/](%E9%9F%B3%E6%95%88/)、[BGM/](BGM/) | 音效與音樂的來源、授權說明，以及單獨的檔案 |
| [完成版/](%E5%AE%8C%E6%88%90%E7%89%88/) | 整個遊戲專案，每一版各一份（見該資料夾的 README） |

## 授權與來源

- 音效：全部 CC0（Kenney、OpenGameArt 上的 Ogrebane），見 [音效/README.md](%E9%9F%B3%E6%95%88/README.md)。
- BGM：用 ACE-Step 1.5 生成，我們以 CC0 釋出，見 [BGM/README.md](BGM/README.md)。獨立遊戲 BGM 的五條路與注意事項也在那裡；條款會改，使用前請到原網站確認。
- 遊戲圖片由 ChatGPT 生成。
- 角色海報（[角色海報/](%E8%A7%92%E8%89%B2%E6%B5%B7%E5%A0%B1/)）：[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/deed.zh-hant)。可以分享、改作，要署名「抹茶小語」，不可商用。
- 遊戲程式碼（[完成版/](%E5%AE%8C%E6%88%90%E7%89%88/)）：MIT，見 [LICENSE](LICENSE)。`vendor/pixi.min.js` 是 PixiJS，保留它自己的 MIT 授權標頭。

## 在自己的電腦玩 🎮

**最簡單的方法：下載 [神社保衛戰-單機版.html](https://mojimojilab.github.io/shrine-defense-demo/#offline)，雙擊它就能玩囉。** 圖片、音效、程式全都包在這一個檔案裡（約 17 MB），不用安裝任何東西，也不用上網。請用 Chrome 或 Edge 開啟（我們用 Chrome 實測過）。整包 ZIP 裡也有這個檔案。

這是最後一版（v3）的單機版；想玩 v1、v2 的話，用上面的線上試玩就可以。

### 想改程式的朋友看這裡

[完成版/](%E5%AE%8C%E6%88%90%E7%89%88/) 裡的各版本是分開的檔案，瀏覽器不讓你直接雙擊 `index.html` 打開（ES module 的限制），要先開一個小小的本機伺服器：

```
cd 完成版/v3-UI優化
python -m http.server 8003
```

再用瀏覽器開 `http://localhost:8003`。
