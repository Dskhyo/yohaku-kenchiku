# アニメーション実装

## 実装済み

- 初回セッションのブランドイントロ（約2.4秒）。グリッド、ロゴ、波形、解析ステータスから左右分割でHEROへ。同じ位置の青い基準線をHEROへ引き継ぎます。通信進捗ではなく演出です。スクロール・タッチ・キー入力でスキップします。
- `sessionStorage.axis_intro_played` で再訪問時は省略。`?intro=1` で再生。アンカー付きURLでは目的位置の表示を優先して省略。
- HEROの構造線、建築写真、英字、日本語コピーの順次表示。画像は1.04倍から1倍へ。
- PROBLEMの波形描画、最大1.7pxの水平変位、青い補強ラインと静止。
- TECHNOLOGYの6段階のscrub。PCは約180vhのスクロール距離でpin。900px以下・高さ600px以上では見出しを先に読ませた後、模型と現在ステップのみをヘッダー下に固定。約135vhで6段階を進め、終了後に固定を解除します。低い横向き画面ではpinなしに切り替えます。
- DATAの数値試算風表示から指定数値へ確定。値・解析図は架空データ。
- STRUCTUREの半透明化、骨組み、耐震部材、荷重、モデル復帰。
- 実績写真のマスク表示とhover、研究レポートの横方向表示、背景タイポの微小移動。
- PCの補助クロスヘア。通常カーソルは保持。
- スクロール後のヘッダー背景、対応ブラウザーでのCSSスクロール進捗線。

## 設計

GSAP 3.13.0 / ScrollTriggerを `assets/js/vendor/` からローカル配信。WordPressは `wp_enqueue_script()` の依存関係で順序を保証。静的プレビューはdeferスクリプトを同じ順で読み込みます。

`intro-boot.js` は最初の描画と5.5秒の解除期限を担当。`loader.js` はイントロ、`hero.js` はHERO、`technology.js` は6段階解析、`scroll.js` はその他のスクロール演出、`cursor.js` は補助カーソル、`motion.js` はライフサイクルを担当します。`main.js` のメニュー・ダイアログから独立しています。

`gsap.matchMedia()` のcontextで画面幅とReduced Motionの変更時にアニメーション・pinをrevertし、追加DOM・イベントをcleanupします。フォント準備後にrefreshし、ブラウザーの戻るキャッシュ復帰にも対応します。画像要素は寸法を持ち、演出画像は絶対配置です。

JavaScript無効・ライブラリ取得失敗時も本文を表示。Reduced Motionではintro・pin・scrub・カーソルを使わず最終状態を表示します。View Transitionは実績詳細をWordPressの別URLへ接続する段階で追加予定です。現状の詳細はダイアログです。

## 確認

`scripts/check-motion.cjs` が初回再生、セッション記録、6段階の進行、数値確定、モバイル専用ステージのpin、横はみ出し、resize後の重複、実行中のReduced Motion切替、再訪問、Escapeスキップ、JS無効、GSAP取得失敗を確認します。結果は `artifacts/motion-checks.json`。

通常レイアウト・メニュー・ダイアログは `scripts/check.cjs`。実機Safari/iOS、WordPress実環境、実測Core Web Vitalsは未検証です。

公式資料: https://gsap.com/docs/v3/Plugins/ScrollTrigger/ 、 https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/

GSAP/ScrollTriggerは配布ファイル内の著作権・ライセンス表記を保持しています。利用条件: https://gsap.com/standard-license/

スマホ専用検証: `scripts/check-mobile-analysis.cjs` で320 / 375 / 390 / 768pxの6段階表示・逆スクロール・画面内への収まり・固定解除・横向き切替・Reduced Motionの復元を確認。
各ステップの説明は、青で要点を強調する見出しと、構造の役割を伝える本文で構成。6種類を同じグリッドセルに重ねて最大の高さを確保し、切替時の高さ変化を防止。非表示の説明はaria-hiddenに設定しています。高さ700px以下のスマホでは模型を小さくし、説明文が画面内に収まるよう調整しています。
