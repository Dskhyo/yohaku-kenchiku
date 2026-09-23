'use strict';
if (document.documentElement.classList.contains('intro-loading')) {
  document.querySelectorAll('body > :not(.site-loader):not(script)').forEach(element => {
    element.inert = true;
    element.setAttribute('data-intro-inert', '');
  });
}
const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navigation');
const dialog = document.querySelector('#detail-dialog');
const content = document.querySelector('#dialog-content');
let returnFocus = null;
function setMenu(open) {
  header.classList.toggle('menu-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.querySelector('.sr-only').textContent = open ? 'メニューを閉じる' : 'メニューを開く';
  document.body.classList.toggle('locked', open || dialog.open);
}
menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
navigation.addEventListener('click', event => { if(event.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', event => {
  if (menuButton.getAttribute('aria-expanded') !== 'true') return;
  if(event.key === 'Escape') {setMenu(false); menuButton.focus();}
  if(event.key === 'Tab') {
    const links = [...navigation.querySelectorAll('a')];
    const last = links[links.length - 1];
    if(event.shiftKey && document.activeElement === menuButton) {event.preventDefault();last.focus();}
    else if(!event.shiftKey && document.activeElement === last) {event.preventDefault();menuButton.focus();}
  }
});
matchMedia('(min-width:901px)').addEventListener('change', event => {if(event.matches) setMenu(false);});
let scrollScheduled = false;
function updateHeader() {header.classList.toggle('is-scrolled', scrollY > document.querySelector('.hero').offsetHeight - 100);scrollScheduled = false;}
addEventListener('scroll', () => {if(!scrollScheduled){scrollScheduled=true;requestAnimationFrame(updateHeader);}}, {passive:true});
updateHeader();
if('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
  document.documentElement.classList.add('motion-ready');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}), {threshold:.08});
  const textObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if(entry.isIntersecting) {entry.target.classList.add('is-text-visible');textObserver.unobserve(entry.target);}
  }), {threshold:.15});
  document.querySelectorAll('main h1, main h2, main h3, .body-copy, .hero-caption').forEach(element => {
    const lines = [[]];
    [...element.childNodes].forEach(node => {
      if(node.nodeName === 'BR') lines.push([]);
      else lines[lines.length - 1].push(node);
    });
    element.replaceChildren(...lines.map((nodes,index) => {
      const line = document.createElement('span');
      line.className = 'text-line';
      line.style.setProperty('--line-index',index);
      line.append(...nodes);
      return line;
    }));
    element.classList.add('text-reveal');
  });
  const startReveals = () => {
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
    document.querySelectorAll('.text-reveal').forEach(element => textObserver.observe(element));
  };
  setTimeout(startReveals, Math.max(0, (window.yohakuIntro?.duration || 0) - (performance.now() - (window.yohakuIntro?.startedAt || 0))));
}
const image = (name, alt) => `<img class="dialog-hero" src="assets/images/${name}.webp" width="1536" height="1024" alt="${alt}">`;
const intro = (label,title) => `<p class="eyebrow">${label}</p><h2 id="dialog-title">${title}</h2>`;
const works = [
  {id:'courtyard',title:'中庭のある平屋',subtitle:'光と緑に包まれる家。',text:'中庭を中心に、居場所がゆるやかにつながる平屋。窓を開けば、風と木々の気配が室内へ。内と外の境界に生まれる余白が、いつもの時間を豊かにします。'},
  {id:'light',title:'光を迎える家',subtitle:'時間とともに表情が変わる家。',text:'朝のやわらかな光から、夕暮れの深い陰影まで。吹き抜けと大きな窓が、一日の移ろいを映し出します。光のそばに、自然と家族の居場所が生まれる住まいです。'},
  {id:'mountain',title:'山と暮らす家',subtitle:'静けさを楽しむ家。',text:'遠くの山並みを、暮らしの景色に。低く伸びる軒と自然素材が、周囲の風景に穏やかになじみます。四季の変化を眺めながら、何もしない時間を楽しむ住まいです。'}
];
const articles = [
  {id:'journal-1',image:'design',title:'何もしない時間を、楽しむ住まい。',date:'2026.09.18',category:'暮らし',text:'窓辺の椅子に腰を下ろし、庭を渡る風を眺める。予定を詰めないひとときは、住まいがくれる小さな贅沢かもしれません。\n\n部屋の用途を決めすぎず、光が心地よい場所に余白を残す。何もしない時間を受け止める居場所から、私たちは暮らしを考えます。'},
  {id:'journal-2',image:'plaster',title:'窓の向こうに、季節を感じる。',date:'2026.09.06',category:'設計',text:'春の新緑、夏の濃い木陰、秋の色づく枝。窓は光を取り込むだけでなく、季節と暮らしをつなぐ場所です。\n\n何が見えるか、どこに座るか。庭の一本の木と向き合いながら窓の位置を考えると、いつもの景色が少し特別なものになります。'},
  {id:'journal-3',image:'concept',title:'時とともに育つ、無垢の木の魅力。',date:'2026.08.25',category:'素材',text:'手で触れると感じる温もり。一枚ごとに違う木目。無垢の木には、均一ではないからこその表情があります。\n\n日々の手入れを重ねながら、色も手ざわりも少しずつ変わっていく。その変化を暮らしの記憶として楽しめる素材を、住まいに取り入れたいと考えています。'}
];
function grid(items,type) {return `<div class="dialog-grid">${items.map(item=>`<a href="#${item.id}" data-dialog="${item.id}"><img src="assets/images/${item.image||item.id}.webp" alt="${item.title}" width="1536" height="1024"><h3>${item.title}</h3></a>`).join('')}</div>`;}
function form(type) {
  const request = type === 'request';
  return intro(request?'REQUEST':'CONTACT',request?'暮らしの余白を、一冊に。':'これからの暮らしを、話そう。') + `<p class="local-note">ポートフォリオ用のデモサイトです。入力内容は送信・保存されません。実際の個人情報は入力せず、表示と操作をご確認ください。</p><form class="preview-form"><label>お名前（必須）<input name="name" autocomplete="off" required maxlength="100" placeholder="山田 太郎"></label><label>メールアドレス（必須）<input name="email" type="email" autocomplete="off" required maxlength="200" placeholder="sample@example.com"></label>${request?'<label>ご希望の資料<select name="catalog"><option>ブランドブック・施工事例集</option><option>家づくりの流れ・素材のご案内</option></select></label>':'<label>ご相談内容（必須）<textarea name="message" required maxlength="3000" placeholder="理想の暮らしについて、お聞かせください。"></textarea></label>'}<label class="check-label"><input type="checkbox" required>確認用の画面であり、実際には送信されないことを確認しました。</label><button class="form-button" type="submit">入力内容を確認する（デモ） →</button><p class="form-status" role="status" tabindex="-1"></p></form>`;
}
const pages = {
  about:()=>intro('ABOUT / CONCEPT','何もない時間まで、設計する。')+image('concept','静かな光が注ぐ窓辺')+'<p class="dialog-text">光。風。緑。<br>何もしない時間。<br>そのすべてを、設計する。</p><p class="local-note">YOHAKU KENCHIKUはポートフォリオ掲載用の架空ブランドです。掲載する住宅・施工事例・写真は、デザインのためのコンセプト表現です。</p>',
  works:()=>intro('WORKS','美しい景色には、<br>美しい暮らしがある。')+grid(works),
  design:()=>intro('DESIGN','美しい暮らしは、<br>余白がつくる。')+image('design','庭とつながるリビング')+'<p class="dialog-text">余白のある設計が生む、時間のくつろぎ。<br>心を整える暮らしを、<br>かたちにしていきます。</p>',
  flow:()=>intro('MATERIAL / FLOW','住まいができるまで。')+'<ol class="flow-list"><li><div><strong>出会いと対話</strong><p>好きな景色や日々の過ごし方から、理想の暮らしを一緒に探します。</p></div></li><li><div><strong>土地と向き合う</strong><p>光、風、周囲の緑。その場所の魅力を読み解きます。</p></div></li><li><div><strong>設計と素材選び</strong><p>暮らしのかたちを整え、長く愛せる素材を選びます。</p></div></li><li><div><strong>丁寧につくる</strong><p>細部まで対話を重ねながら、住まいをかたちにします。</p></div></li><li><div><strong>暮らしを育てる</strong><p>完成からはじまる時間にも、寄り添っていきます。</p></div></li></ol>',
  journal:()=>intro('JOURNAL','暮らしを考える、小さな読みもの。')+grid(articles),
  request:()=>form('request'),contact:()=>form('contact'),
  recruit:()=>intro('RECRUIT','余白を、ともにつくる。')+'<p class="dialog-text">このブランドは架空のポートフォリオ作品です。<br>現在、採用募集は行っていません。</p>',
  instagram:()=>intro('INSTAGRAM','暮らしの、一場面。')+'<p class="dialog-text">架空ブランドのため、公式Instagramアカウントはありません。公開時には実際のアカウントへのリンクを設定します。</p>',
  youtube:()=>intro('YOUTUBE','住まいの空気を、映像で。')+'<p class="dialog-text">架空ブランドのため、公式YouTubeチャンネルはありません。公開時には実際のチャンネルへのリンクを設定します。</p>',
  privacy:()=>intro('PRIVACY POLICY','プライバシーについて。')+'<p class="dialog-text">このデモサイトは、フォームの入力内容を外部に送信せず、保存もしません。アクセス解析や広告Cookieは使用していません。画像・スタイル・スクリプトは同じサイト内から読み込まれます。GitHub Pagesでは、セキュリティのためアクセス元のIPアドレスが記録されます。</p><p class="local-note">実際のフォームを接続する際に、運営者・利用目的・保管方法に応じたプライバシーポリシーを設定します。</p>',
  sitemap:()=>intro('SITEMAP','サイトマップ')+'<nav class="sitemap-links" aria-label="サイトマップ">'+['concept','works','design','material','journal','request'].map(id=>`<a href="#${id}" data-close>${id.toUpperCase()}</a>`).join('')+'</nav>'
};
works.forEach(work=>pages[work.id]=()=>intro('WORKS',work.title)+image(work.id,work.title)+`<p class="dialog-text">${work.subtitle}</p><p class="dialog-text">${work.text}</p><p class="local-note">この住宅は、ブランドの世界観を表現するための架空の施工事例です。</p>`);
articles.forEach(article=>pages[article.id]=()=>intro('JOURNAL / '+article.category,article.title)+`<p class="article-meta">${article.date}</p>`+image(article.image,article.title)+`<p class="dialog-text">${article.text.replaceAll('\n','<br>')}</p>`);
function closeDialog(){dialog.close();}
document.addEventListener('click',event=>{
  const link=event.target.closest('[data-dialog]');
  if(link && pages[link.dataset.dialog]) {
    event.preventDefault();setMenu(false);
    if(!dialog.open) returnFocus=link;
    content.innerHTML=pages[link.dataset.dialog]();
    if(!dialog.open)dialog.showModal();
    dialog.scrollTop=0;document.body.classList.add('locked');document.querySelector('.dialog-close').focus();
  }
  if(event.target.closest('[data-close]')) closeDialog();
});
document.querySelector('.dialog-close').addEventListener('click',closeDialog);
dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)closeDialog();}});
dialog.addEventListener('close',()=>{document.body.classList.remove('locked');if(returnFocus?.isConnected){const target=returnFocus.getClientRects().length?returnFocus:menuButton;target.focus({preventScroll:true});}});
content.addEventListener('submit',event=>{if(!event.target.matches('.preview-form'))return;event.preventDefault();const status=event.target.querySelector('.form-status');status.textContent='入力形式を確認しました。これはデモのため、資料請求・お問い合わせは送信されていません。';status.focus();});
