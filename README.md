<p align="center">
<img src="https://github.com/akashic-games/engine-files/blob/main/img/akashic.png"/>
</p>

# engine-files

Akashic Engine に関連するファイルをまとめて UMD にし、zip 圧縮したファイルを作ります。

このリポジトリは、Akashic Engine 実行系が共通で使うファイルを生成するものです。
**ゲーム開発者が利用する必要はありません。**

## 利用法

次のコマンドで、 `./dist/raw/` 以下に成果物が生成されます。

```
npm i
npm run build
```

## 成果物

* `./dist/raw/debug/full/engineFilesV*_*_*.js`
  * Canvas レンダラおよび WebGL レンダラを含むデバッグ用の成果物
* `./dist/raw/debug/canvas/engineFilesV*_*_*_Canvas.js`
  * Canvas レンダラを含むデバッグ用の成果物
* `./dist/raw/release/full/engineFilesV*_*_*.js`
  * Canvas レンダラおよび WebGL レンダラを含むリリース用用の成果物
* `./dist/raw/release/canvas/engineFilesV*_*_*_Canvas.js`
  * Canvas レンダラを含むリリース用の成果物

`engineFilesV*_*_*.js` は依存関係を持つ次のモジュールをすべてまとめた UMD 形式のファイルです。

* [@akashic/akashic-engine](https://github.com/akashic-games/akashic-engine)
* [@akashic/game-driver](https://github.com/akashic-games/game-driver)
* [@akashic/pdi-browser](https://github.com/akashic-games/pdi-browser)

このファイルは、概念的には次のような型の値をexportします。

```typescript
import * as g from "@akashic/akashic-engine";
import * as gdr from "@akashic/game-driver";
import * as pdib from "@akashic/pdi-browser";

export interface EngineFilesObject {
    akashicEngine: typeof g;
    gameDriver: typeof gdr;
    pdiBrowser: typeof pdib;
}
```

ファイル名は `engineFilesV0_0_1.js` のような形式です (V の後はこのモジュール (engine-files) のバージョンです)。
非 CommonJS 環境では、ファイル名の拡張子以外の部分 (e.g. `engineFilesV0_0_1`) の名前のグローバル変数を定義します。

Node.js など `window` が存在しない環境では pdiBrowser の値が `null` になります。

## npm モジュールとして利用

本モジュールを利用側で import します。

```javascript
import { akashicEngine as g } from "@akashic/engine-files";

...

```

## 内部モジュールの更新方法
[こちら](https://github.com/akashic-games/engine-files/actions/workflows/update_internal_modules.yml) からワークフローを実行してください。
更新が必要なモジュールをチェックした後に `Run Workflow` を実行することで PullRequest が作成されます。

## テスト

### reftest の実行

`npm test` コマンドで reftest が実行されます。
reftest で利用するコンテンツは `tests/fixtures/*/game.json` として格納し、 game.json と同一の場所にその他必要な設定ファイルとテスト結果を出力するディレクトリを配置する必要があります。

| ディレクトリ/ファイル | 内容 |
| ------------- | ------------- |
| `scenario.json` | コンテンツの動作を定義する設定ファイル。 |
| `expected/` | scenario.json で定義された動作の正解画像データ。 |
| `actual/debug/full/` | デバッグビルドされた成果物の実際の出力画像データ。 |
| `actual/debug/canvas/` | Canvas 版でデバッグビルドされた成果物の実際の出力画像データ。 |
| `actual/release/full/` | リリースビルドされた成果物の実際の出力画像データ。 |
| `actual/release/canvas/` | Canvas 版でリリースビルドされた成果物の実際の出力画像データ。 |
| `diff/debug/full/` | デバッグビルドされた成果物の実際の出力画像データと正解画像データとの差分画像データ。 |
| `diff/debug/canvas/` | Canvas 版でデバッグビルドされた成果物の実際の出力画像データ。と正解画像データとの差分画像データ。 |
| `diff/release/full/` | リリースビルドされた成果物の実際の出力画像データ。と正解画像データとの差分画像データ。 |
| `diff/release/canvas/` | Canvas 版でリリースビルドされた成果物の実際の出力画像データと正解画像データとの差分画像データ。 |

また、テストにはビルド成果物が必要です。
あらかじめ `npm run build` などで `dist/raw/{release,debug}/{full,canvas}/engineFilesV{n}_{n}_{n}.js` ファイルを生成しておいてください。

### reftest の正解画像データの更新

以下のコマンドで reftest に必要な正解画像データを更新できます。

```sh
npm run update-expected
```

## ライセンス
本リポジトリは MIT License の元で公開されています。
詳しくは [LICENSE](https://github.com/akashic-games/engine-files/blob/master/LICENSE) をご覧ください。

ただし、画像ファイルおよび音声ファイルは
[CC BY 2.1 JP](https://creativecommons.org/licenses/by/2.1/jp/) の元で公開されています。
