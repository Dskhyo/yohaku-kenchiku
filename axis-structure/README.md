# AXIS STRUCTURE — デザインとアニメーション

架空の構造設計・耐震技術企業のオリジナルWordPressテーマと、PCデザイン確認用の静的プレビューです。既存のYOHAKUサイトには変更を加えていません。

## プレビュー

親ディレクトリで `node scripts/server.cjs` を実行し、次のURLを開きます。

http://127.0.0.1:4173/axis-structure/index.html

`axis-structure/index.html` はファイルを直接ブラウザーで開いても表示できます。外部CDN・外部フォント・画像APIへの接続は不要です。

## 今回の範囲

- PHASE 1: 既存ディレクトリ・ファイル・Gitの状態を確認。
- PHASE 2: `wp-content/themes/axis-structure/` にテーマヘッダー、functions、header/footer、front-page、page、single、archive、indexを用意。
- PHASE 3: HEROからFOOTERまでのPC版TOP。参考画像の暗い夕景、青い構造部材、白とチャコールのセクション、細いグリッドと番号を再構成。
- メニュー、キーボード操作、スキップリンク、デモ詳細ダイアログを実装。スマートフォンには最低限の読みやすいフォールバックを用意。

ローディング、GSAP / ScrollTrigger、6段階の解析、数値確定、カーソル等のアニメーションを追加済みです。詳細は `MOTION.md` を参照してください。View Transition、Three.js、ACF、projects投稿タイプ、動的TOP一覧は未実装です。ナビゲーション・TOPの文章や画像も現段階では静的で、管理画面のメニュー・カスタムロゴはまだ表示に接続していません。

## WordPress

`wp-content/themes/axis-structure/` をWordPressの同名テーマディレクトリに配置して有効化します。固定フロントページを設定する場合は「設定 → 表示設定」から選択します。フロントページは `front-page.php` が担当します。

テーマの基本APIとenqueueを実装済みですが、この環境にはPHP / WordPressがないため、有効化・PHP実行・管理画面の検証は未実施です。今回の完成対象は静的PC版TOPです。

## 編集と再生成

- `scripts/build.cjs`: TOP、header/footerのマークアップ原本。変更後に `node axis-structure/scripts/build.cjs` を親ディレクトリから実行。
- `wp-content/themes/axis-structure/assets/css/main.css`: デザイン、色変数、画面幅ごとのフォールバック。
- `wp-content/themes/axis-structure/assets/js/main.js`: メニューと確認用の詳細画面。
- `wp-content/themes/axis-structure/assets/images/`: ローカルのWebP画像。
- `wp-content/themes/axis-structure/functions.php`: テーマ基本機能。

生成される `index.html`、テーマ内 `preview.html`、`template-parts/home.php`、`header.php`、`footer.php` は直接編集せず、ビルド原本を変更してください。汎用テンプレートもbuildスクリプトから生成しています。

## 確認結果

Chrome / Playwrightで1440・1280・1024・390pxを確認。横はみ出しなし、h1は1つ、画像読み込み成功、ページ内リンクの対象欠落なし、JavaScriptエラー・HTTPエラーなし。メニュー開閉、Escape、実績・性能データ・問い合わせ・資料請求のダイアログを確認しました。

`artifacts/checks.json` に機械確認結果、`artifacts/home-1440.png` と `hero-1440.png` にPCスクリーンショットを保存。実測Core Web VitalsやWordPress環境での性能評価は後続段階です。

確認の再実行にはNode.js環境で `playwright` とChromeが必要です。サーバー起動後 `node axis-structure/scripts/check.cjs` を実行します。

## コンテンツの取り扱い

性能・実績は仕様書に基づく架空データです。実証済みの構造性能を示しません。問い合わせと資料請求は説明ダイアログで、送信・保存は行いません。実績・記事も確認用コンテンツです。

画像は内蔵imagegenによる生成素材と、既存プロジェクトの生成画像のコピーです。生成プロンプトと出典は `ASSETS.md` を参照してください。
