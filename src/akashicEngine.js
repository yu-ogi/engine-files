var akashicEngine = require("@akashic/akashic-engine");

// 後方互換性のための暫定対応。
// 現状 akashic-engine の AudioAsset などは pdi-types 由来の interface になっているが、ここでは過去バージョン当時の値を入れる。
// 一部環境に、これらの値に依存している処理が残っているため。
//
// これらの値は、TS 上では interface (型だけの存在) に見える一方 JS レイヤーでは値が存在する、という状況になる。
// 元々 engine-files の利用者のレイヤーでは JS としてしか扱っておらず、
// また TS として利用している場合は値を参照することがないので問題はない。
akashicEngine.AudioAsset = require("@akashic/pdi-common-impl/lib/AudioAsset").AudioAsset;
akashicEngine.AudioPlayer = require("@akashic/pdi-common-impl/lib/AudioPlayer").AudioPlayer;
akashicEngine.ScriptAsset = require("@akashic/pdi-common-impl/lib/ScriptAsset").ScriptAsset;
akashicEngine.TextAsset = require("@akashic/pdi-common-impl/lib/TextAsset").TextAsset;

module.exports = akashicEngine;
