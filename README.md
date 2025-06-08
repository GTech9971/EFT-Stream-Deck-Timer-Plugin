# 🎮 EFT Raid Timer - Stream Deck Plugin

**Escape from Tarkov**のレイド時間を管理するStream Deckプラグインです。残り時間をリアルタイム表示し、視覚的警告で脱出タイミングをサポートします。

![Plugin Demo](https://img.shields.io/badge/Stream%20Deck-Plugin-00d4aa)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![EFT Compatible](https://img.shields.io/badge/EFT-Compatible-orange)

## ✨ 主な機能

### 🗺️ **Map Selector**
- **10種類のマップ対応**: Factory, Customs, Woods, Shoreline, Interchange, Reserve, Lighthouse, Labs, Streets, Ground Zero
- **クリック**: マップ切り替え
- **長押し (800ms)**: レイドタイマー開始

### ⏱️ **Raid Timer**
- **リアルタイム表示**: 残り時間を秒単位で更新
- **視覚的警告**: 緑 (10分以上) → 黄 (5-10分) → 赤 (5分以下)
- **クリック**: 一時停止/再開
- **長押し (1秒)**: タイマークリア

## 📥 インストール方法

### 自動インストール
1. **[最新リリース](https://github.com/gtech9971/eft-stream-deck-timer-plugin/releases)**から `eft-raid-timer.streamDeckPlugin` をダウンロード
2. ファイルをダブルクリックしてStream Deckに自動インストール
3. Stream Deckアプリで「EFT Raid Timer」カテゴリからアクションを追加

### 手動インストール
```bash
# Stream Deck CLIがインストール済みの場合
streamdeck install eft-raid-timer.streamDeckPlugin
```

## 🎯 使用方法

### 基本的な流れ
```
1️⃣ Map Selectorでマップを選択
2️⃣ EFTでそのマップに出撃
3️⃣ ロード完了後、Map Selectorを長押し
4️⃣ Raid Timerで残り時間を監視
5️⃣ 脱出完了後、Raid Timerを長押しでリセット
```

### 詳細操作

#### **Map Selector**
| 操作 | 動作 |
|------|------|
| クリック | 次のマップに切り替え |
| 長押し (800ms) | 選択マップでレイド開始 |
| 右クリック → Edit | 設定画面でマップ選択 |

#### **Raid Timer**
| 操作 | 動作 |
|------|------|
| クリック | 一時停止 ⇄ 再開 |
| 長押し (1秒) | タイマークリア |
| 一時停止中 | 「PAUSED」表示、破線アイコン |

## 🗺️ 対応マップと制限時間

| マップ | 制限時間 | 特徴 |
|--------|----------|------|
| **Factory** | 20分 | 短時間の激戦マップ |
| **The Lab** | 35分 | 高リスク・高リターン |
| **Ground Zero** | 35分 | 市街戦エリア |
| **Customs** | 45分 | バランス型マップ |
| **Woods** | 45分 | 広大な森林エリア |
| **Shoreline** | 45分 | 海岸沿いのリゾート |
| **Interchange** | 45分 | ショッピングモール |
| **Reserve** | 45分 | 軍事基地 |
| **Lighthouse** | 45分 | 灯台周辺エリア |
| **Streets** | 45分 | 市街地戦闘 |

## ⚙️ カスタマイズ

### Property Inspector設定
- **カスタム制限時間**: マップごとの時間調整
- **警告しきい値**: 色変化のタイミング調整
- **表示形式**: MM:SS / M:SS / 分のみ
- **自動リセット**: レイド終了後の動作

### 推奨設定
```
🟡 黄色警告: 10分前
🔴 赤色警告: 5分前
⏰ 表示形式: MM:SS
🔄 自動リセット: 有効
```

## 🔧 トラブルシューティング

### よくある問題

**Q: プラグインが表示されない**
```
1. Stream Deckソフトウェア 6.5以上を確認
2. Stream Deckアプリを再起動
3. プラグインを再インストール
```

**Q: タイマーが正確でない**
```
1. レイドロード完了のタイミングで開始
2. システム時計の正確性を確認
3. 他のタイマーアプリとの競合を確認
```

**Q: 長押しが反応しない**
```
1. 1秒間しっかり押し続ける
2. Stream Deckファームウェア更新を確認
3. プラグインを再ビルド
```

### デバッグ手順
```bash
# 開発者向け
npm run build    # プラグインビルド
npm run package  # 配布パッケージ作成
npm run watch    # 開発モード
```

## 💡 使用のコツ

### タイミング最適化
- **開始**: 「武器を構える」瞬間にMap Selector長押し
- **脱出判断**: 残り15分で脱出ルート確認
- **緊急時**: 残り5分（赤色）で強制脱出開始

### 効率的な運用
```
🎯 事前準備: よく使うマップを覚える
⏰ 時間管理: 黄色で戦闘終了、赤色で移動開始
🔄 習慣化: レイド終了時は必ずリセット
📱 予備: スマホタイマーと併用で確実性UP
```

## 🤝 サポート・フィードバック

### 報告・要望
- **Issues**: [GitHub Issues](https://github.com/gtech9971/eft-stream-deck-timer-plugin/issues)
- **機能要望**: 新マップ対応、UI改善など
- **バグ報告**: 詳細な再現手順を記載

### 開発者向け
```bash
git clone https://github.com/gtech9971/eft-stream-deck-timer-plugin.git
cd eft-stream-deck-timer-plugin
npm install
npm run watch
```

## 📄 ライセンス

MIT License - 自由に使用・改変・再配布可能

## ⚠️ 免責事項

- 非公式ツール（Battlestate Games、Elgatoとは無関係）
- ゲーム内タイマーと若干のズレが生じる場合があります
- 脱出は余裕を持って行ってください

---

**Happy Raiding! 🎮**

*Made with ❤️ for the EFT community*