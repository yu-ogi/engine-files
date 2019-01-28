<p align="center">
<img src="https://github.com/akashic-games/engine-files/blob/ae1x-master/img/akashic.png"/>
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
npm run build:client:parts
npm run build:gr:parts
```

を実行して `./dist/raw/` 以下のディレクトリを適当な手段で zip 圧縮してください。

## 生成物

* `./dist/akashic_engine.zip`
* `./dist/akashic_engine-gr.zip`

それぞれの圧縮前のファイルは `./dist/raw/` に出力されます。

`akashic_engine.zip` は、`engineFilesV{n}_{n}_{n}.js` を含む zip ファイルです(詳細は次節)。

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

## npm モジュールとして利用

本モジュールを利用側で import します。

```javascript
import { akashicEngine as g } from "@akashic/engine-files";

...

```

## ライセンス
本リポジトリは MIT License の元で公開されています。
詳しくは [LICENSE](https://github.com/akashic-games/engine-files/blob/ae1x-master/LICENSE) をご覧ください。

ただし、画像ファイルおよび音声ファイルは
[CC BY 2.1 JP](https://creativecommons.org/licenses/by/2.1/jp/) の元で公開されています。
