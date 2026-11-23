# 《神社保衛戰》音效：來源與授權 🔔

這裡是《神社保衛戰》用的 19 個精選音效，還有它們的原始音效包。全部都是 CC0，可以放心用～

> 2026-11-20 下載。這裡的音效全部是 **CC0（公眾領域）**：可以商用、可以修改、可以放進公開的 GitHub repo 重新散布，也不用署名（作者表示署名「很好，但不是必要」）。

## 精選（`精選/`）

依遊戲事件挑選並重新命名。檔名用英文，方便叫 AI 在程式裡直接引用。[線上試聽頁](https://mojimojilab.github.io/shrine-defense-demo/%E9%9F%B3%E6%95%88/%E7%B2%BE%E9%81%B8/%E8%A9%A6%E8%81%BD.html)可以逐一試聽（在自己的電腦上，也可以直接打開 `精選/試聽.html`）。

| 檔名 | 用在哪裡 | 原始檔 | 長度 |
| --- | --- | --- | --- |
| [`shot_talisman.ogg`](%E7%B2%BE%E9%81%B8/shot_talisman.ogg) | 符咒發射（很頻繁，所以挑短而輕的） | Kenney RPG Audio `cloth2` | 0.42 s |
| [`hit.ogg`](%E7%B2%BE%E9%81%B8/hit.ogg) | 符咒擊中敵人 | Kenney RPG Audio `chop` | 0.24 s |
| [`enemy_vanish.mp3`](%E7%B2%BE%E9%81%B8/enemy_vanish.mp3) | 敵人被打倒、消散 | Kenney Digital Audio `phaserDown2` | 0.26 s |
| [`orb_pickup.ogg`](%E7%B2%BE%E9%81%B8/orb_pickup.ogg) | 吸收經驗球 | Kenney Interface Sounds `glass_002` | 0.12 s |
| [`level_up.mp3`](%E7%B2%BE%E9%81%B8/level_up.mp3) | 升級（一路往上升 15 個半音） | Kenney Digital Audio `powerUp9` | 0.46 s |
| [`ui_select.ogg`](%E7%B2%BE%E9%81%B8/ui_select.ogg) | 強化卡片游標移過 | Kenney Interface Sounds `select_001` | 0.04 s |
| [`ui_confirm.ogg`](%E7%B2%BE%E9%81%B8/ui_confirm.ogg) | 選定強化、按鈕 | Kenney Interface Sounds `confirmation_001` | 0.29 s |
| [`shrine_hit.ogg`](%E7%B2%BE%E9%81%B8/shrine_hit.ogg) | 神社被打（像敲鐘的「噹」） | Kenney RPG Audio `metalPot2` | 0.94 s |
| [`wave_start.ogg`](%E7%B2%BE%E9%81%B8/wave_start.ogg) | 新的一波開始 | Kenney Music Jingles `jingles_HIT03` | 0.75 s |
| [`purify_burst.ogg`](%E7%B2%BE%E9%81%B8/purify_burst.ogg) | 淨化結界炸開 | Kenney Sci-Fi Sounds `forceField_002` | 0.96 s |
| [`boss_land.ogg`](%E7%B2%BE%E9%81%B8/boss_land.ogg) | 鬼王降臨（低頻轟） | Kenney Sci-Fi Sounds `lowFrequency_explosion_000` | 2.00 s |
| [`boss_roar.wav`](%E7%B2%BE%E9%81%B8/boss_roar.wav) | 鬼王登場的吼聲 | Ogrebane Monster SFX `monster-6` | 1.00 s |
| [`boss_warning.ogg`](%E7%B2%BE%E9%81%B8/boss_warning.ogg) | 震地重槌的紅圈預警 | Kenney Sci-Fi Sounds `forceField_001` | 0.95 s |
| [`boss_slam.ogg`](%E7%B2%BE%E9%81%B8/boss_slam.ogg) | 重槌落地 | Kenney Sci-Fi Sounds `explosionCrunch_000` | 0.78 s |
| [`boss_fireball.ogg`](%E7%B2%BE%E9%81%B8/boss_fireball.ogg) | 三道鬼火射出 | Kenney Sci-Fi Sounds `laserLarge_001` | 0.72 s |
| [`boss_summon.wav`](%E7%B2%BE%E9%81%B8/boss_summon.wav) | 喚靈咆哮 | Ogrebane Monster SFX `monster-8` | 0.94 s |
| [`boss_defeat.ogg`](%E7%B2%BE%E9%81%B8/boss_defeat.ogg) | 鬼王倒下 | Kenney Sci-Fi Sounds `explosionCrunch_004` | 1.98 s |
| [`win.ogg`](%E7%B2%BE%E9%81%B8/win.ogg) | 神社守護成功（一路往上升 10 個半音） | Kenney Music Jingles `jingles_NES12` | 0.85 s |
| [`lose.ogg`](%E7%B2%BE%E9%81%B8/lose.ogg) | 神社失守（往下降 7.7 個半音） | Kenney Music Jingles `jingles_STEEL01` | 1.38 s |

這份對照是依檔名、長度、音量、亮度和音高走向挑的。

**挑選原則：正面的事件（升級、勝利）用往上走的音，負面的事件（失守）用往下走的音。**

勝利音效的備選：`jingles_SAX02`，同樣一路往上升 10 個半音，0.87 秒，薩克斯風音色。

## 原始音效包（`原始/`）

每一包都在 OpenGameArt 的頁面上確認過作者和授權，原始授權檔也一起保留在資料夾裡。

| 資料夾 | 音效包 | 作者 | 授權 | 數量 | 出處 |
| --- | --- | --- | --- | --- | --- |
| [`kenney-interface`](%E5%8E%9F%E5%A7%8B/kenney-interface/) | Interface Sounds | Kenney | CC0 | 100 | [kenney.nl](https://kenney.nl/assets/interface-sounds) ／ [OpenGameArt](https://opengameart.org/content/interface-sounds) |
| [`kenney-rpg`](%E5%8E%9F%E5%A7%8B/kenney-rpg/) | 50 RPG sound effects | Kenney | CC0 | 51 | [kenney.nl](https://kenney.nl/assets/rpg-audio) ／ [OpenGameArt](https://opengameart.org/content/50-rpg-sound-effects) |
| [`kenney-digital`](%E5%8E%9F%E5%A7%8B/kenney-digital/) | 63 Digital sound effects | Kenney | CC0 | 62 | [kenney.nl](https://kenney.nl/assets/digital-audio) ／ [OpenGameArt](https://opengameart.org/node/12493) |
| [`kenney-scifi`](%E5%8E%9F%E5%A7%8B/kenney-scifi/) | Sci-Fi Sounds | Kenney | CC0 | 73 | [kenney.nl](https://kenney.nl/assets/sci-fi-sounds) ／ [OpenGameArt](https://opengameart.org/content/sci-fi-sounds) |
| [`kenney-jingles`](%E5%8E%9F%E5%A7%8B/kenney-jingles/) | 85 Short music jingles | Kenney | CC0 | 85 | [kenney.nl](https://kenney.nl/assets/music-jingles) ／ [OpenGameArt](https://opengameart.org/node/22000) |
| [`ogrebane-monster`](%E5%8E%9F%E5%A7%8B/ogrebane-monster/) | Monster Sound Effects Pack | Ogrebane | CC0 | 10 | [OpenGameArt](https://opengameart.org/content/monster-sound-effects-pack) |

Ogrebane 的音效包裡沒有附授權檔，授權以 OpenGameArt 頁面標示的 CC0 為準。

## 給觀眾：去哪裡找音效

**可以放進公開專案、和別人分享的（CC0）**

- **Kenney**（[kenney.nl/assets](https://kenney.nl/assets?t=audio)）：遊戲用的音效包，全部 CC0，品質穩定，最推薦。
- **OpenGameArt**（[opengameart.org](https://opengameart.org)）：用進階搜尋把授權篩成 CC0。每一頁的授權都要自己確認，同一個網站上也有需要署名的 CC-BY 作品。

**可以免費用在自己的作品，但不能把原始檔再分享出去**

- **Pixabay 音效**：可以免費商用，不用署名。但不能把原始檔單獨再散布，所以不適合放進公開的 GitHub repo。
- **効果音ラボ**（日文）：可以免費商用，不用署名，也有很多和風音效。規約禁止再散布，改過的檔案也不行。
- **魔王魂**（日文）：可以免費商用，也有和風曲目。禁止再散布原始檔，規約請以官網為準。

簡單判斷：**只是放進自己的遊戲或影片 → 上面都可以；要把音效檔本身放上網給別人下載 → 只能用 CC0。**授權條款會改，用之前請到原網站確認最新版本。
