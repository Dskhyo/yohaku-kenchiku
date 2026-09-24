/* Phase 3: navigation and honest local content previews only. */
(() => {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#site-menu');
  const closeMenu = (focus = false) => {
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'メニューを開く');
    if (focus) toggle.focus();
  };
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
  });
  menu?.addEventListener('click', event => { if (event.target.closest('a,button')) closeMenu(); });
  document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !menu.hidden) closeMenu(true); });
  const entries = {
    data: ['PERFORMANCE DATA','性能を、数字で証明する。','耐震等級03、最大変形量−42%、構造解析1,240件、累計施工386棟はデザイン確認用の架空の数値です。比較試験や実測による裏付けはありません。今後の実装では、試験条件・解析モデル・出典を併せて掲載する構成を想定しています。'],
    structure: ['STRUCTURAL ANALYSIS','見えない構造まで、設計する。','荷重条件の設定、柱・梁のモデル化、地震応答の確認。構造のつながりを可視化し、接合部まで検討する設計プロセスを表現しています。図版はコンセプトイメージで、実際の解析結果ではありません。'],
    'project-0': ['CONCEPT PROJECT / 01','RESIDENCE A','RC HOUSE / TOKYO。大きな開口と端正なコンクリートの構造を組み合わせた住宅のコンセプト。水盤に映る夕景と、温かな居住空間をイメージしています。'],
    'project-1': ['CONCEPT PROJECT / 02','OFFICE FRAME','STEEL STRUCTURE / OSAKA。光を受け止める開放的な空間を、柱と梁の秩序で支えるオフィスのコンセプト。掲載写真は空間の参考イメージです。'],
    'project-2': ['CONCEPT PROJECT / 03','SEISMIC RENOVATION','PUBLIC FACILITY / KOBE。地域の暮らしを支える建築を、長く使い続けるための改修コンセプト。掲載写真は空間の参考イメージです。'],
    'report-0': ['TECH REPORT 021 / 2026.09.04','耐震等級から考える、住まいの安全。','耐震性能を伝える数値には、前提となる設計条件があります。この技術ノートでは、数値だけでなく、その評価条件や建物の使い方にも目を向ける構成を予定しています。本文は今後制作するデモ記事です。'],
    'report-1': ['TECH REPORT 020 / 2026.08.21','見えない接合部が、建物の強さを決める。','柱と梁をつなぐ接合部に注目し、力の伝わり方を図解で読み解く技術ノートを予定しています。本文は今後制作するデモ記事です。'],
    'report-2': ['TECH REPORT 019 / 2026.08.07','シミュレーションで読み解く、地震の力。','入力する地震動、解析モデル、応答の確認までを紹介する研究ノートを予定しています。本文は今後制作するデモ記事です。'],
    contact: ['TECHNICAL CONTACT','技術相談について','現在はPCデザイン確認用のプレビューです。お問い合わせの送信先・フォームは未接続です。今後、建築計画・構造設計・耐震改修について相談できるフォームを実装します。個人情報の送信や保存は行いません。'],
    request: ['DOCUMENT REQUEST','資料請求について','現在はデザイン確認用のプレビューです。配布資料や請求フォームはまだ用意していません。今後、技術概要・設計プロセス・解析事例をまとめた資料への導線を実装します。'],
    company: ['COMPANY','AXIS STRUCTURE','構造設計・耐震技術をテーマとした、ポートフォリオ用の架空企業です。実在する事業者ではなく、所在地・連絡先などの企業情報は設定していません。'],
    recruit: ['RECRUIT','構造から、次の未来へ。','研究・設計・施工をつなぐチームをイメージした採用導線です。架空ブランドのため、実際の採用募集は行っていません。'],
    privacy: ['PRIVACY','プライバシーについて','この静的プレビューには、問い合わせ送信、解析タグ、広告Cookieを実装していません。WordPress運用時には、導入するプラグインやサーバーの設定に合わせて正式なポリシーを整備してください。']
  };
  const dialog = document.querySelector('#detail-dialog');
  let opener;
  document.querySelectorAll('[data-detail]').forEach(button => button.addEventListener('click', () => {
    const entry = entries[button.dataset.detail];
    if (!entry || !dialog) return;
    opener = button;
    document.querySelector('#dialog-label').textContent = entry[0];
    document.querySelector('#dialog-title').textContent = entry[1];
    const paragraph = document.createElement('p'); paragraph.textContent = entry[2];
    document.querySelector('#dialog-body').replaceChildren(paragraph);
    dialog.showModal();
  }));
  document.querySelector('.dialog-close')?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('click', event => { if (event.target === dialog) { const box=dialog.getBoundingClientRect(); if(event.clientX<box.left || event.clientX>box.right || event.clientY<box.top || event.clientY>box.bottom) dialog.close(); } });
  dialog?.addEventListener('close', () => { if(opener?.closest('[hidden]')) toggle.focus(); else opener?.focus(); });
})();
