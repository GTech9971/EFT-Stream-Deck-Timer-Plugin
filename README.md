# Escape from Tarkov Raid Timer - Stream Deck Plugin

Stream DeckでEscape from Tarkovのレイド時間を管理するプラグインです。各マップの制限時間を表示し、残り時間をリアルタイムで確認できます。

## 機能

- **マップ選択**: 10種類のマップに対応（Factory, Customs, Woods, Shoreline, Interchange, Reserve, Lighthouse, Labs, Streets, Ground Zero）
- **自動タイマー**: 選択したマップの制限時間でカウントダウン
- **視覚的アラート**: 残り時間に応じて色が変化（緑→黄→赤）
- **手動操作**: ゲーム開始前にマップを選択してタイマー開始

## セットアップ

### 必要な環境

- Node.js 20以上
- Stream Deck ソフトウェア 6.5以上
- Stream Deck CLI

### インストール手順

1. **依存関係のインストール**

```bash
npm install
```

2. **プラグインのビルドと起動**

```bash
npm run watch
```

## 使用方法

### 1. Map Selectorボタン

- **クリック**: マップを切り替え
- **Property Inspector**: 詳細設定とレイド開始
- 現在選択中のマップと制限時間が表示されます

### 2. Raid Timerボタン

- レイド中の残り時間をリアルタイム表示
- 時間に応じて色が変化：
  - 緑: 10分以上
  - 黄: 5-10分
  - 赤: 5分以下
- クリックでレイド終了

### 3. Property Inspector（設定画面）

- Map Selector: マップ選択とレイド開始ボタン
- Raid Timer: 表示形式と警告設定

## マップ別制限時間

| マップ | 制限時間 |
|--------|----------|
| Factory | 20分 |
| Customs | 45分 |
| Woods | 45分 |
| Shoreline | 45分 |
| Interchange | 45分 |
| Reserve | 45分 |
| Lighthouse | 45分 |
| The Lab | 35分 |
| Streets of Tarkov | 45分 |
| Ground Zero | 35分 |

## 開発

### ファイル構成

```
project/
├── src/
│   ├── plugin.ts                      # メインプラグイン
│   └── actions/
│       └── eft-timer-actions.ts       # タイマーアクション
├── com.gtech9971.eft-stream-deck-timer-plugin.sdPlugin/
│   ├── manifest.json                  # プラグインメタデータ
│   ├── bin/
│   │   └── plugin.js                  # コンパイル済み
│   └── ui/
│       ├── selector-property-inspector.html
│       └── timer-property-inspector.html
├── package.json
├── rollup.config.mjs
└── README.md
```

### ビルドコマンド

```bash
# 開発モード（自動リロード）
npm run watch

# ビルドのみ
npm run build
```

## トラブルシューティング

### プラグインが表示されない

1. `npm run build`でプラグインを再ビルド
2. Stream Deckソフトウェアを再起動
3. 管理者権限でStream Deckが実行されていないことを確認

### タイマーが正確に動作しない

1. システムの時計が正確であることを確認
2. 複数のタイマーが同時に動作していないことを確認

## ライセンス

MIT License

## 免責事項

このプラグインは非公式のツールです。Escape from TarkovやBattlestate Games、Elgatoとは関係ありません。
