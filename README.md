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

```sh
npm test
```

## ライセンス
本リポジトリは MIT License の元で公開されています。
詳しくは [LICENSE](https://github.com/akashic-games/engine-files/blob/master/LICENSE) をご覧ください。

ただし、画像ファイルおよび音声ファイルは
[CC BY 2.1 JP](https://creativecommons.org/licenses/by/2.1/jp/) の元で公開されています。
