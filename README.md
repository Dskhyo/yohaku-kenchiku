# YOHAKU KENCHIKU — ローカルデザイン開発

架空の高級注文住宅ブランドのポートフォリオサイト。現在はHTML・CSS・JavaScriptによるデザイン調整版です。WordPressテーマの書き出し・ZIP化は行っていません。

## 起動

```sh
npm run dev
```

http://127.0.0.1:4173 を開きます。依存パッケージのインストールは不要です。終了は Ctrl+C。

## ファイル

公開ページは静的ファイルのみで動作します。GitHub Pagesではブランチのルートを配信元に設定できます。独自ドメインや有料サービスは必要ありません。

開発用の確認スクリプトを実行する場合のみ `npm install` を行い、Google Chromeをインストールした環境で、サーバーを起動後 `npm run check:layout` / `npm run check:motion` を実行します。

- `index.html`：TOPページ。画像内の文章ではなく指定書の文章を優先。
- `assets/css/style.css`：PC・Tablet・Mobile、余白、文字組み、アニメーション。
- `assets/css/motion.css`：Cinzel、4秒ロゴローディング、PCのみ24秒FVズーム、行単位のテキスト表示、2.4秒画像フェード。900px以下とタッチ端末ではFVの拡大を無効化。PC（901px以上）のCONCEPT上余白は0。
- `assets/js/intro.js`：初回描画前のローディング開始と4秒後の解除。再読み込み時に毎回再生。
- `assets/js/main.js`：メニュー、スクロール表示、確認用の詳細画面とフォーム。
- `assets/images/`：生成した架空の建築写真（WebP）。
- `scripts/server.cjs`：127.0.0.1だけで待ち受けるローカル開発サーバー。

資料請求・問い合わせは送信も保存もしないデモです。各施工事例・記事はデザイン確認用の仮コンテンツです。SNSも架空ブランドの案内画面になっています。外部フォントや画像CDNは使用していません。CinzelはGoogle Fonts公式配布のファイルをローカル配信し、ライセンスは `assets/fonts/OFL-Cinzel.txt` に同梱しています。配布元：https://github.com/google/fonts/tree/main/ofl/cinzel

ファビコンは現時点では仮のYマークのままです。正式素材の設定は後日。

## 調整の順番

1. PCのヒーロー、写真のトリミング、文字サイズ。
2. 各セクションの写真と文章の比率、余白。
3. 1024 / 768 / 480 / 390pxの表示と操作。
4. デザイン確定後にWordPressテンプレート化し、works投稿・ACF・通常投稿に接続。
5. WordPress実環境で確認してからテーマを書き出す。

## WordPress化で保持する仕様

`style.css`、`functions.php`、`header.php`、`footer.php`、`front-page.php`、`page.php`、`single.php`、`archive.php`、`single-works.php`、`archive-works.php`、`index.php` を持つ独立テーマとします。`works`カスタム投稿にはタイトル・アイキャッチ・サブタイトル・場所・住宅タイプ・完成年月・延床面積・設計コンセプト・ギャラリーを設定。ACF停止時もフォールバックできる実装にします。

写真は組み込みのimagegenで生成したコンセプト画像です。実在の施工実績ではありません。生成プロンプトは `assets/images/PROMPTS.md` に記録します。
