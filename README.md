<p align="center">
<img src="https://github.com/akashic-games/engine-files/blob/master/img/akashic.png"/>
</p>

# engine-files

Akashic Engine に関連するファイルをまとめて UMD にし、zip 圧縮したファイルを作ります。

このリポジトリは、Akashic Engine 実行系 (`akashic-sandbox` など) が共通で使うファイルを生成するものです。
**ゲーム開発者が利用する必要はありません。**

## 利用法

次のコマンドで、 `dist/` 以下にzipファイルが生成されます。

```
npm i
npm run build
```

`optionalDependencies` が解決できない環境では、部分的に失敗します。

上のコマンドの実行には、シェルから `zip` コマンドが利用できる必要があります。ない場合は

```
npm run build:full:parts
npm run build:canvas:parts
npm run build:gr:parts
```

を実行して `./dist/raw/` 以下のディレクトリを適当な手段で zip 圧縮してください。

## 生成物

* `./dist/akashic_engine.zip`
* `./dist/akashic_engine.canvas.zip`
* `./dist/akashic_engine.debug.zip`
* `./dist/akashic_engine.canvas.debug.zip`
* `./dist/akashic_engine-gr.zip`

それぞれの圧縮前のファイルは `./dist/raw/` に出力されます。

`akashic_engine.[canvas.][debug.]zip` は、`engineFilesV{n}_{n}_{n}.js` を含む zip ファイルです(詳細は次節)。

`akashic_engine-gr.zip` は、 `akashic-enigne.js` と `game-driver.js` を含む zip ファイルです。
この二つはグローバル関数 `require()` を定義するスクリプトファイルで、
それぞれ読み込むと、 `"@akashic/akashic-engine"`, `"@akashic/game-driver"` に対して値を返す `require()` を得ることができます。

### engineFilesV{n}\_{n}\_{n}.js

依存関係を持つ次のモジュールをすべてまとめた UMD 形式のファイルです。

* [@akashic/akashic-engine](https://github.com/akashic-games/akashic-engine)
* [@akashic/game-driver](https://github.com/akashic-games/game-driver)
* [@akashic/pdi-broder](https://github.com/akashic-games/pdi-browser)

このファイルは、概念的には次のような型の値をexportします。

```
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

Canvas のみ版 (`akashic_engine.canvas.zip`) では、 `engineFilesV0_0_1_Canvas.js` のようなファイル名と、それに対応する変数名になります。

Node.js など `window` が存在しない環境では pdiBrowser の値が `null` になります。

## npm モジュールとして利用

本モジュールを利用側で import します。

```javascript
import { akashicEngine as g } from "@akashic/engine-files";

...

```

## 更新方法

各モジュールは次のコマンドで一括して最新 (latest) に更新できます。

1. `npm run update-modules`
2. `npm run build`

個別に更新する場合は、 package.json を編集してください。

1. `devDependencies` フィールドを更新して akashic-engine など必要なもののバージョンを上げ、
2. `version` を更新し、
3. `npm run build`

## runtime-version.json の更新

### インクリメント
```sh
npm run runtime-version:bump
```

### リセット
```sh
npm run runtime-version:reset
```

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
