// きもちとたいどの距離診断（距離があることを責めない。たいどで楽になれるところを示す）
// 18問（はい／いいえ）で、きもち（内）・たいど（表面）・作用（あいだ）を0〜6で数え、6つの型に分ける。
// 文言はこのファイルの上の QUESTIONS・TYPES・GOALS を直せば変わる。回答はどこにも送らず、保存もしない。
(()=>{'use strict';
const FORM='https://docs.google.com/forms/d/e/1FAIpQLSd0KixjZ9qp4IN2YhDHNsjw01QhMLWU0YslcL0QJP-TNa-7_g/viewform';

// k=きもち t=たいど e=作用。yes が「足す」なら +1、「引く」なら -1
const QUESTIONS=[
 ['k',+1,'やりたいことを、ひとことで言える。'],
 ['t',+1,'場面ごとに「ここではこうふるまう」と決めていることがある。'],
 ['e',+1,'自分の話に、相手がのってくる手ごたえがある。'],
 ['k',+1,'仕事で「これだけは大事にしたい」ことがある。'],
 ['t',+1,'初対面で「何をしている人？」と聞かれて、すぐ答えられる。'],
 ['e',-1,'言い方ひとつで、ぎくしゃくすることがある。'],
 ['k',-1,'「ほんとうはどうしたい？」と聞かれると、困る。'],
 ['t',+1,'気分が悪い日も、あいさつや言葉づかいは変えない。'],
 ['e',+1,'会議や打ち合わせで、ほかの人からも意見が出る。'],
 ['k',-1,'人に合わせて、自分の意見を変えることが多い。'],
 ['t',-1,'その場の空気で、ふるまいが大きく変わる。'],
 ['e',+1,'来てほしいお客さんや人が、来ている。'],
 ['k',+1,'最近、自分が何にうれしくなったか、説明できる。'],
 ['t',-1,'苦手な人の前で、どうふるまうかを決めていない。'],
 ['e',-1,'「思っていたのと違った」と言われたことがある。'],
 ['k',+1,'この1か月で、ひとりで考える時間をとった。'],
 ['t',+1,'大事な場面の前に、自分のたいどを考えておくことがある。'],
 ['e',+1,'最近、誰かに「それ、いいね」と言われた。'],
];

// ゴールとなるソリューション
const GOALS={
 s0:{name:'きもちが乗らない日も、たいどで運べる',desc:'朝、会議、お客さんの前。気分に左右されない、自分のたいどの型を持てる。',svc:'1on1・コーチング／チームビルディング・研修',icon:'i-heart'},
 s2:{name:'場面ごとのたいどが、決まる',desc:'お客さんの前、職場、はじめての人。場面ごとの「ちょうどいいふるまい」と、言うこと・言わないことが決まる。',svc:'理念・クレドづくり／チームビルディング・研修',icon:'i-person'},
 s3:{name:'ひとことの自己紹介が、決まる',desc:'名刺交換で「それ、どういうこと？」と聞き返される、ひとこと。',svc:'1on1・コーチング／ブランディング',icon:'i-talk'},
 s4:{name:'伝わる場所に、出せる',desc:'ホームページ、求人、SNS、店頭。合うお客さんと合う人が来る出し方。',svc:'採用広報・求人／ブランディング・ホームページ制作／SNS・発信の運用',icon:'i-out'},
 s5:{name:'職場で、乗りあえる',desc:'会議で意見が出る。言い方ひとつでぎくしゃくしない。お互いのたいどを、お互いがつくる。',svc:'社内コミュニティづくり／チームビルディング・研修',icon:'i-swap'},
 s6:{name:'ずれても、戻せる',desc:'相手からどう返ってきたかを月に一度見て、ずれたらたいどを直す。',svc:'SNS・発信の運用／1on1・コーチング（月に一度の見直し）',icon:'i-loop'},
 s1:{name:'きもちの奥が、言葉になる',desc:'乗らない日の奥にある、ほんとうに大事にしたいことを、自分の言葉で言える。',svc:'1on1・コーチング',icon:'i-book'},
};

// 6つの型。距離があることを責めない。たいどで楽になれるところを言う
const TYPES={
 maigo:{name:'きもち迷子型',fig:'slump',lead:'きもちが見えないときは、たいどから決めていい。',
   why:'「きもち」の点が低めでした。まわりに合わせるのが上手なぶん、自分がどうしたいかは後回しになりやすい。でも、きもちが決まるのを待たなくていい。場面ごとのたいどを先に決めておくと、迷う時間が減って、毎日が少し楽になります。きもちは、あとから追いついてくることもあります。',
   tip:'明日いちばん気が重い場面を1つ選んで、「そこでのたいど」を一文だけ決めておく（例：「会議では、最初に一回うなずく」）。',
   goals:['s0','s1']},
 muneuchi:{name:'胸の内型',fig:'still',lead:'きもちはあるのに、たいどをまだ決めていない。',
   why:'「きもち」ははっきりしているのに、「たいど」の点が低めでした。きもちがあるぶん、その日の気分や相手に合わせて、ふるまいが揺れやすいのかもしれません。たいどは技術なので、場面ごとに一文決めておくだけで、毎日が少し楽になることがあります。',
   tip:'いちばん揺れやすい場面を1つ選んで、「そこでのたいど」を一文だけ決めておく（例：「朝は、自分から先にあいさつする」）。',
   goals:['s2','s3','s4']},
 omote:{name:'たいど上手型',fig:'back',lead:'きもちと距離があっても、たいどで自分を運べている。',
   why:'「きもち」の点は低めでも、「たいど」はしっかり出ています。それは悪いことではなく、社会の中で自分を運ぶ技術を、もう持っているということ。ただ、ずっと同じ強さで続けると疲れます。どの場面でたいどを使い、どこで休むかを決めておくと、もっと楽になることがあります。',
   tip:'1週間のうち「たいどを使う場面」と「たいどを脱いでいい場面」を1つずつ書き出してみる。脱いでいい場所があると、たいどは長持ちしやすくなります。',
   goals:['s0','s2']},
 ippou:{name:'一方通行型',fig:'lean',lead:'きもちもたいどもあるのに、返ってこない。',
   why:'「きもち」も「たいど」も出ているのに、「作用」の点が低めでした。届かないのは、出している場所や言い方が、相手に合っていないからかもしれません。相手から見えるたいどを少し変えると、返ってくるものが変わることがあります。',
   tip:'来てほしいお客さん（人）を1人思い浮かべて、その人がふだん見ている場所を3つ書き出してみる。そこが、出しどころの候補です。',
   goals:['s4','s6']},
 surechigai:{name:'すれ違い型',fig:'back2',lead:'まわりと、乗りあえていない。',
   why:'「作用」の点が低めで、とくに職場や身近な人とのやりとりで、ぎくしゃくしやすい答えでした。たいどは、ひとりでは決まりません。お互いのたいどが、お互いをつくっています。チームで場面ごとのたいどを決めておくと、ぶつかる回数が減って、会社にいるのが少し楽になることがあります。',
   tip:'次の打ち合わせで、自分が話す前に「どう思う？」と1回だけ聞いてみる。相手のたいどが、少し変わることがあります。',
   goals:['s5','s0']},
 noriai:{name:'乗りあい型',fig:'up',lead:'きもち・たいど・作用が、そろっている。',
   why:'3つとも高めでした。たいどが相手に届き、返ってきています。この状態は、まわりや時期が変わるとずれていきます。いまのうちに、何がうまくいっているかを言葉にしておくと、ずれても戻せます。',
   tip:'うまくいっている理由を3つ書いて、チームや身近な人と見せあってみる。乗りあえている理由は、人によって違います。',
   goals:['s6','s4']},
};

const $=s=>document.querySelector(s);
const app=$('#diag');if(!app)return;
let answers=[],i=0;

const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const icon=(id,cls='ic')=>`<svg class="${cls}" aria-hidden="true"><use href="#${id}"/></svg>`;
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
  const s={k:0,t:0,e:0};
  QUESTIONS.forEach((q,n)=>{const yes=answers[n]===1;if((q[1]>0&&yes)||(q[1]<0&&!yes))s[q[0]]++});
  return s; // 各0〜6
}
function typeOf(s){
  const conflict=answers[5]===1&&answers[8]===0; // ぎくしゃくして、会議で意見も出ない（両方そろったときだけ）
  if(s.k<=2)return s.t>=4?'omote':'maigo';
  if(s.t<=2)return 'muneuchi';
  if(s.e<=2)return conflict?'surechigai':'ippou';
  if(s.e<=3&&conflict)return 'surechigai';
  return 'noriai';
}
function result(){
  const s=score(),key=typeOf(s),T=TYPES[key];
  const bar=(label,en,v)=>`<div class="r-bar"><p><span class="en">${en}</span>${label}</p><div class="r-track"><span style="--w:${v/6*100}%"></span></div><p class="r-num">${v}<small>/6</small></p></div>`;
  const summary=`【きもちとたいどの距離診断】${T.name}（きもち${s.k}・たいど${s.t}・作用${s.e}／6）`;
  const formUrl=FORM+'?usp=pp_url&entry.326506747='+encodeURIComponent(summary+'\n30分の相談を希望します。\n');
  const shareText=`きもちとたいどの距離診断で「${T.name}」でした。`;
  const shareUrl='https://twitter.com/intent/tweet?text='+encodeURIComponent(shareText)+'&url='+encodeURIComponent(location.href.split('#')[0].split('?')[0]);
  app.innerHTML=`<div class="r">
  <p class="r-kicker">あなたは</p>
  <h2 class="r-name" tabindex="-1">${T.name}</h2>
  <p class="r-lead">${T.lead}</p>
  <div class="r-bars">${bar('きもち','FEELING',s.k)}${bar('たいど','TAIDO',s.t)}${bar('作用','EFFECT',s.e)}</div>
  <p class="r-dist">きもちとたいどの距離：<strong>${Math.abs(s.k-s.t)}</strong>　${s.k-s.t>=2?'きもちが先で、たいどがまだ後ろにいます。':s.t-s.k>=2?'たいどが先に立って、あなたを運んでいます。':'きもちとたいどが、ほぼ重なっています。'}距離があるのは、悪いことではありません。</p>
  <div class="r-why"><h3>なぜ、この結果？ たいどで、どこが楽になる？</h3><p>${T.why}</p></div>
  <div class="r-tip"><h3>今日からできる、小さなたいど</h3><p>${T.tip}</p></div>
  <div class="r-goals"><h3>めざせるゴール</h3><ol>${T.goals.map(g=>`<li>${icon(GOALS[g].icon,'ic ic-l')}<div><p class="g-name">${GOALS[g].name}</p><p>${GOALS[g].desc}</p><p class="g-svc">たいどのしごと：${GOALS[g].svc}</p></div></li>`).join('')}</ol></div>
  <div class="r-cta"><p>この結果をもとに、30分（無料）で、あなたの毎日のたいどの話を聞かせてください。</p>
  <div class="actions"><a class="cta" href="${formUrl}" target="_blank" rel="noopener noreferrer">結果をもって、30分話す</a><a class="more" href="index.html#service">しごとを見る</a></div>
  <p class="note">フォームには診断の結果だけが入ります。回答そのものは、どこにも送っていません。</p></div>
  <div class="r-foot"><a class="share" href="${shareUrl}" target="_blank" rel="noopener noreferrer">結果を X でシェアする ↗</a><button type="button" class="q-back r-again">もう一度やる</button></div>
  <p class="note">この診断は心理検査ではありません。たいどで楽になれるところに気づくための、きっかけです。</p>
  </div>`;
  inline(app);
  app.querySelector('.r-name').focus({preventScroll:true});
  app.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
  requestAnimationFrame(()=>app.querySelector('.r-bars').classList.add('on'));
  app.querySelector('.r-again').addEventListener('click',start);
}
document.querySelectorAll('[data-diag-start]').forEach(b=>b.addEventListener('click',()=>{document.querySelector('.diag-intro').hidden=true;app.hidden=false;start();app.scrollIntoView({block:'start'})}));
})();
