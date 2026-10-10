// たいど意識度チェック
// たいどは技術。16問（はい／いいえ）で、4つの技術（気づく・決める・保つ・届ける）を0〜4で数え、
// 合計（0〜16）で意識度のレベルを、いちばん低い技術で「次に伸ばす技術」を出す。
// 文言はこのファイルの上の QUESTIONS・SKILLS・LEVELS を直せば変わる。回答はどこにも送らず、保存もしない。
(()=>{'use strict';
const FORM='https://docs.google.com/forms/d/e/1FAIpQLSd0KixjZ9qp4IN2YhDHNsjw01QhMLWU0YslcL0QJP-TNa-7_g/viewform';

// a=気づく b=決める c=保つ d=届ける。yes が「足す」なら +1、「引く」なら -1
const QUESTIONS=[
 ['a',+1,'話しているときの自分の表情を、だいたい想像できる。'],
 ['b',+1,'場面ごとに「ここではこうふるまう」と決めていることがある。'],
 ['c',+1,'気分が悪い日も、あいさつや言葉づかいは変えない。'],
 ['d',+1,'相手によって、話し方や距離感を変えている。'],
 ['a',-1,'「怖い」「怒ってる？」と言われて、驚いたことがある。'],
 ['b',-1,'その場の空気で、ふるまいが大きく変わる。'],
 ['c',-1,'疲れていると、つい口調がきつくなる。'],
 ['d',+1,'自分の話に、相手がのってくる手ごたえがある。'],
 ['a',+1,'自分のくせ（口ぐせ・腕組み・ため息など）を3つ言える。'],
 ['b',+1,'大事な場面の前に、自分のたいどを考えておくことがある。'],
 ['c',+1,'いやなことがあっても、次の人には切り替えて接することができる。'],
 ['d',-1,'言い方ひとつで、ぎくしゃくすることがある。'],
 ['a',+1,'機嫌が悪いとき、それが表に出ているか自分でわかる。'],
 ['b',-1,'苦手な人の前で、どうふるまうかを決めていない。'],
 ['c',-1,'一度崩れると、その日は立て直せないことが多い。'],
 ['d',+1,'会議や打ち合わせで、ほかの人からも意見が出る。'],
];

// 4つの技術
const SKILLS={
 a:{name:'気づく',en:'NOTICE',icon:'i-q',desc:'自分がいま、どんなたいどをしているかに気づく。',
    grow:'たいどは、自分ではいちばん見えにくい。まずは「気づく」ところから。人に映してもらうと、早く見えるようになります。',
    tip:'今日いちど、話している自分の顔をスマホのインカメラで10秒だけ見てみる。思っていた顔と、ちがうかもしれません。',
    svc:'1on1・コーチング'},
 b:{name:'決める',en:'DECIDE',icon:'i-check',desc:'場面ごとに、どうふるまうかを先に決めておく。',
    grow:'たいどは、その場で考えると揺れます。場面ごとに一文だけ先に決めておくと、迷う時間が減って、自分を守れます。',
    tip:'明日いちばん気が重い場面を1つ選んで、「そこでのたいど」を一文だけ決めておく（例：「会議では、最初に一回うなずく」）。',
    svc:'理念・クレドづくり／チームビルディング・研修'},
 c:{name:'保つ',en:'KEEP',icon:'i-loop',desc:'しんどい日も、たいどを崩さない。崩れても戻す。',
    grow:'しんどい日こそ、たいどの出番です。崩れたときの「戻し方」を一つ持っておくと、毎日が少し楽になります。',
    tip:'崩れそうなときの合図（深呼吸を1回、水を一口など）を一つ決めておく。たいどは、戻し方まで含めて技術です。',
    svc:'1on1・コーチング'},
 d:{name:'届ける',en:'REACH',icon:'i-swap',desc:'相手に合わせて使い分け、お互いに乗りあえる。',
    grow:'たいどは、ひとりでは決まりません。相手やチームと一緒に整えると、お互いのたいどが、お互いを乗せていきます。',
    tip:'次の打ち合わせで、自分が話す前に「どう思う？」と1回だけ聞いてみる。相手のたいどが、少し変わることがあります。',
    svc:'社内コミュニティづくり／採用広報・SNS'},
};

// 意識度のレベル（合計 0〜16）
const LEVELS=[
 {min:0, name:'レベル1　自動運転',lead:'たいどは、まだ自動で動いています。',
  body:'たいどを意識しないまま、毎日がすぎている状態です。悪いことではありません。ただ、自分では気づかないところで、損をしたり、疲れたりしているかもしれません。たいどは技術なので、ここからいちばん伸びます。'},
 {min:6, name:'レベル2　気づきはじめ',lead:'たいどに、気づきはじめています。',
  body:'ときどき、自分のたいどを意識できています。次は、場面ごとに決めておくこと。決めたたいどは、気分が乗らない日の自分を守ってくれます。'},
 {min:10,name:'レベル3　使い分け',lead:'場面に合わせて、たいどを使い分けています。',
  body:'たいどを技術として使えている状態です。チームや相手と一緒に整えると、自分だけでなく、まわりも楽になります。それは、もうマネジメントです。'},
 {min:13,name:'レベル4　たいど上手',lead:'たいどを、技術として持っています。',
  body:'自分のたいどに気づき、決め、保ち、届けられています。この技術は、時期や相手が変わると、ずれていきます。いまのうちに言葉にしておくと、まわりにも渡せます。'},
];

const $=s=>document.querySelector(s);
const app=$('#diag');if(!app)return;
let answers=[],i=0;
const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const inline=root=>root.querySelectorAll('svg.ic').forEach(svg=>{const u=svg.querySelector('use');if(!u)return;const sym=document.querySelector(u.getAttribute('href'));if(!sym)return;svg.setAttribute('viewBox',sym.getAttribute('viewBox'));sym.querySelectorAll('path').forEach(p=>{const c=p.cloneNode(true);c.setAttribute('pathLength','1');svg.appendChild(c)});u.remove();requestAnimationFrame(()=>svg.classList.add('drawn'))});

function start(){answers=[];i=0;render()}
function render(){
  if(i>=QUESTIONS.length)return result();
  const q=QUESTIONS[i];
  app.innerHTML=`<div class="q-head"><p class="q-count">${i+1} <span>/ ${QUESTIONS.length}</span></p><div class="q-bar" role="progressbar" aria-label="進み具合" aria-valuemin="0" aria-valuemax="${QUESTIONS.length}" aria-valuenow="${i}"><span style="width:${i/QUESTIONS.length*100}%"></span></div></div>
  <h2 class="q-text" tabindex="-1">${esc(q[2])}</h2>
  <div class="q-btns"><button type="button" class="q-yes" data-a="1">はい</button><button type="button" class="q-no" data-a="0">いいえ</button></div>
  ${i?'<button type="button" class="q-back">← ひとつ戻る</button>':''}`;
  app.querySelector('.q-text').focus({preventScroll:true});
  app.querySelectorAll('[data-a]').forEach(b=>b.addEventListener('click',()=>{answers[i]=+b.dataset.a;i++;render()}));
  const back=app.querySelector('.q-back');back&&back.addEventListener('click',()=>{i--;render()});
}
function score(){
  const s={a:0,b:0,c:0,d:0};
  QUESTIONS.forEach((q,n)=>{const yes=answers[n]===1;if((q[1]>0&&yes)||(q[1]<0&&!yes))s[q[0]]++});
  return s; // 各0〜4
}
function result(){
  const s=score(),total=s.a+s.b+s.c+s.d,L=[...LEVELS].reverse().find(l=>total>=l.min);
  const order=['a','b','c','d'];
  const low=order.reduce((m,k)=>s[k]<s[m]?k:m,'a'), high=order.reduce((m,k)=>s[k]>s[m]?k:m,'a');
  const W=SKILLS[low], H=SKILLS[high];
  const bar=k=>`<div class="r-bar"><p><span class="en">${SKILLS[k].en}</span>${SKILLS[k].name}</p><div class="r-track"><span style="--w:${s[k]/4*100}%"></span></div><p class="r-num">${s[k]}<small>/4</small></p></div>`;
  const summary=`【たいど意識度チェック】${L.name.replace('　',' ')}（${total}/16）気づく${s.a}・決める${s.b}・保つ${s.c}・届ける${s.d}`;
  const formUrl=FORM+'?usp=pp_url&entry.326506747='+encodeURIComponent(summary+'\n30分の相談を希望します。\n');
  const lineId=document.body.dataset.lineId||'', lineBase=document.body.dataset.lineUrl||'';
  const lineUrl=lineId?'https://line.me/R/oaMessage/'+encodeURIComponent(lineId)+'/?'+encodeURIComponent(summary+'\n30分の相談を希望します。'):lineBase;
  const shareText=`たいど意識度チェックで「${L.name.replace('　',' ')}」でした。`;
  const shareUrl='https://twitter.com/intent/tweet?text='+encodeURIComponent(shareText)+'&url='+encodeURIComponent(location.href.split('#')[0].split('?')[0]);
  app.innerHTML=`<div class="r">
  <p class="r-kicker">あなたのたいどの意識度は</p>
  <h2 class="r-name" tabindex="-1">${L.name}</h2>
  <p class="r-score"><strong>${total}</strong><small>/16</small></p>
  <p class="r-lead">${L.lead}</p>
  <div class="r-bars">${order.map(bar).join('')}</div>
  <div class="r-why"><p>${L.body}</p></div>
  <div class="r-grow"><h3>次に伸ばす技術：<span>${W.name}</span></h3><p>${W.grow}</p>${s[high]>s[low]?`<p class="r-strong">いちばん育っているのは「${H.name}」。${H.desc}</p>`:''}</div>
  <div class="r-tip"><h3>今日からできる、小さな練習</h3><p>${W.tip}</p></div>
  <div class="r-outside"><h3>外の人が入ると、早くなる</h3><p>たいどは、自分ではいちばん見えにくい技術です。スポーツにコーチがいるように、外から映してもらうと、気づくのも、決めるのも早くなります。社内では言いにくいことも、利害のない人になら話せます。</p><p class="g-svc">合いそうなしごと：${W.svc}</p></div>
  <div class="r-cta"><p>この結果をもとに、30分（無料）で、あなたと職場のたいどの話を聞かせてください。</p>
  <div class="contact-ways"><a class="way-btn way-line" data-line href="${lineUrl}" target="_blank" rel="noopener noreferrer"><svg class="ic" aria-hidden="true"><use href="#i-line"/></svg><span><strong>結果をLINEで送る</strong><small>友だち追加して、そのまま相談へ</small></span></a><a class="way-btn" href="${formUrl}" target="_blank" rel="noopener noreferrer"><svg class="ic" aria-hidden="true"><use href="#i-mail"/></svg><span><strong>結果をフォームで送る</strong><small>レベルと点数が入った状態で開きます</small></span></a></div>
  <p class="r-more"><a class="more" href="${document.getElementById('service')?'#service':'index.html#service'}">しごとを見る</a></p>
  <p class="note">LINE・フォームに入るのはチェックの結果（レベルと点数）だけです。回答そのものは、どこにも送っていません。</p></div>
  <div class="r-foot"><a class="share" href="${shareUrl}" target="_blank" rel="noopener noreferrer">結果を X でシェアする ↗</a><button type="button" class="q-back r-again">もう一度やる</button></div>
  <p class="note">このチェックは心理検査ではありません。たいどを技術として見るための、きっかけです。</p>
  </div>`;
  inline(app);
  window.taidoLine&&window.taidoLine(app);
  app.querySelector('.r-name').focus({preventScroll:true});
  app.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
  requestAnimationFrame(()=>app.querySelector('.r-bars').classList.add('on'));
  app.querySelector('.r-again').addEventListener('click',start);
}
document.querySelectorAll('[data-diag-start]').forEach(b=>b.addEventListener('click',()=>{document.querySelector('.diag-intro').hidden=true;app.hidden=false;start();app.scrollIntoView({block:'start'})}));
})();
