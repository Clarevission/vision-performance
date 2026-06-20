// â•â•â•â• PRODUCTS DATA â•â•â•â•
const allProducts=[
  {id:1,name:'Performance Frame Alpha',col:'Professional Performance',price:185,badge:'pro',desc:'Lightweight titanium for executives and engineers.',shape:'rect',photo:'https://images.unsplash.com/photo-1766998224439-9f048ed4d687?auto=format&fit=crop&w=600&h=600&q=85'},
  {id:2,name:'Performance Frame Vector',col:'Professional Performance',price:210,badge:'new',desc:'Ergonomic spring hinges for all-day comfort.',shape:'rect',photo:'https://images.unsplash.com/photo-1617791932882-a70117e3564d?auto=format&fit=crop&w=600&h=600&q=85'},
  {id:3,name:'Executive Titanium Series',col:'Professional Performance',price:320,badge:'pro',desc:'Ultra-lightweight premium titanium construction.',shape:'round',photo:'https://images.unsplash.com/photo-1588937094793-5aee482cd9a0?auto=format&fit=crop&w=600&h=600&q=85'},
  {id:4,name:'Command Frame Pro',col:'Professional Performance',price:245,badge:'',desc:'Professional rectangular with polarized option.',shape:'rect',photo:'https://images.unsplash.com/photo-1589176449149-71f7ea77ec25?auto=format&fit=crop&w=600&h=600&q=85'},
  {id:5,name:'Digital Focus Frame',col:'Digital Eye Performance',price:195,badge:'new',desc:'Built-in blue light blocking for screen use.',shape:'rect',photo:'https://images.unsplash.com/photo-1646084081219-1090f72a531c?auto=format&fit=crop&w=600&h=600&q=85'},
  {id:6,name:'ScreenGuard Series',col:'Digital Eye Performance',price:215,badge:'',desc:'Anti-fatigue design with AR coatings included.',shape:'rect',photo:'https://images.unsplash.com/photo-1603578119639-798b8413d8d7?auto=format&fit=crop&w=600&h=600&q=85'},
  {id:7,name:'Remote Work Pro',col:'Digital Eye Performance',price:185,badge:'',desc:'Lightweight design for home office workers.',shape:'oval',photo:'https://images.unsplash.com/photo-1608906709312-fe17f7c1a5a6?auto=format&fit=crop&w=600&h=600&q=85'},
  {id:8,name:'TechVision Elite',col:'Digital Eye Performance',price:230,badge:'new',desc:'Full blue light protection with HD lenses.',shape:'round',photo:'https://images.unsplash.com/photo-1608539733377-5557e02926b5?auto=format&fit=crop&w=600&h=600&q=85'},
  {id:9,name:'Industrial Pro Safety Frame',col:'Industrial Prescription Safety',price:240,badge:'csa',desc:'CSA Z94.3 certified for industrial environments.',shape:'sport',photo:'https://images.unsplash.com/photo-1702625835613-ad7fa6bb5194?auto=format&fit=crop&w=600&h=600&q=85'},
  {id:10,name:'ImpactShield Safety Series',col:'Industrial Prescription Safety',price:260,badge:'csa',desc:'High-impact for construction and oil & gas.',shape:'sport',photo:'https://images.unsplash.com/photo-1593854519602-687eae339d57?auto=format&fit=crop&w=600&h=600&q=85'},
  {id:11,name:'CSA Compliance Collection',col:'Industrial Prescription Safety',price:275,badge:'csa',desc:'Full CSA compliance. Anti-fog and scratch coating.',shape:'sport',photo:'https://images.unsplash.com/photo-1754747197440-0bbf8a0ac1a9?auto=format&fit=crop&w=600&h=600&q=85'},
  {id:12,name:'WorkSite Shield Pro',col:'Industrial Prescription Safety',price:250,badge:'csa',desc:'Wraparound for manufacturing and mining.',shape:'sport',photo:'https://images.unsplash.com/photo-1759757548364-0edce6779baa?auto=format&fit=crop&w=600&h=600&q=85'},
  {id:13,name:'Lunettes Signature No.1',col:'Lunettes Signature',price:230,badge:'new',desc:'Design-forward frame for the discerning professional.',shape:'oval',photo:'https://images.unsplash.com/photo-1769414123505-d53607809609?auto=format&fit=crop&w=600&h=600&q=85'},
  {id:14,name:'Lunettes Heritage Frame',col:'Lunettes Signature',price:250,badge:'',desc:'Classic silhouette in premium acetate.',shape:'round',photo:'https://images.unsplash.com/photo-1769414608525-64438594c59c?auto=format&fit=crop&w=600&h=600&q=85'},
  {id:15,name:'Lunettes Moderne',col:'Lunettes Signature',price:265,badge:'',desc:'Contemporary handcrafted acetate frame.',shape:'oval',photo:'https://images.unsplash.com/photo-1582142407894-ec85a1260a46?auto=format&fit=crop&w=600&h=600&q=85'},
  {id:16,name:'Lunettes Executive',col:'Lunettes Signature',price:290,badge:'',desc:'Refined luxury for senior professionals.',shape:'rect',photo:'https://images.unsplash.com/photo-1769414761120-a186e3bad614?auto=format&fit=crop&w=600&h=600&q=85'},
  {id:17,name:'Lens Cleaning Kit',col:'Accessories',price:18,badge:'',desc:'Complete solution with microfiber cloth.',shape:'acc',photo:'https://images.unsplash.com/photo-1599243439680-1af420953c23?auto=format&fit=crop&w=600&h=600&q=85'},
  {id:18,name:'Anti-Fog Spray',col:'Accessories',price:15,badge:'',desc:'Long-lasting formula. 60ml bottle.',shape:'acc',photo:'https://images.unsplash.com/photo-1517948430535-1e2469d314fe?auto=format&fit=crop&w=600&h=600&q=85'},
  {id:19,name:'Hard Case',col:'Accessories',price:25,badge:'',desc:'Protective hard shell with magnetic closure.',shape:'acc',photo:'https://images.unsplash.com/photo-1632986636900-a57d247122a2?auto=format&fit=crop&w=600&h=600&q=85'},
  {id:20,name:'Microfiber Cloth Pack',col:'Accessories',price:12,badge:'',desc:'Pack of 3 premium microfiber cloths.',shape:'acc',photo:'https://images.unsplash.com/photo-1576420782660-c3be90691e29?auto=format&fit=crop&w=600&h=600&q=85'},
  {id:21,name:'Blue Light Screen Protector',col:'Accessories',price:20,badge:'',desc:'Anti-blue light film for laptop screens.',shape:'acc',photo:'https://images.unsplash.com/photo-1726626258806-09db08d3b5c1?auto=format&fit=crop&w=600&h=600&q=85'},
];

// â•â•â•â• CANVAS DRAWING â•â•â•â•
const FRAME_COLORS={'Professional Performance':'#0A1F44','Digital Eye Performance':'#2F5D8C','Industrial Prescription Safety':'#F97316','Lunettes Signature':'#1A3A5C','Accessories':'#4A5568'};
function drawFrame(canvas,shape,col){
  const ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height;
  ctx.clearRect(0,0,w,h);ctx.fillStyle='#EEF2F8';ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='rgba(47,93,140,0.06)';ctx.lineWidth=1;
  for(let i=0;i<w;i+=20){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,h);ctx.stroke();}
  for(let i=0;i<h;i+=20){ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(w,i);ctx.stroke();}
  const fc=FRAME_COLORS[col]||'#0A1F44';
  ctx.strokeStyle=fc;ctx.fillStyle=fc+'1A';ctx.lineWidth=3;
  if(shape==='rect'){ctx.beginPath();ctx.roundRect(w*.08,h*.36,w*.36,h*.28,7);ctx.fill();ctx.stroke();ctx.beginPath();ctx.roundRect(w*.56,h*.36,w*.36,h*.28,7);ctx.fill();ctx.stroke();ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(w*.44,h*.5);ctx.lineTo(w*.56,h*.5);ctx.stroke();ctx.beginPath();ctx.moveTo(w*.08,h*.5);ctx.lineTo(w*.02,h*.56);ctx.stroke();ctx.beginPath();ctx.moveTo(w*.92,h*.5);ctx.lineTo(w*.98,h*.56);ctx.stroke();}
  else if(shape==='round'){const r=w*.18;ctx.beginPath();ctx.arc(w*.28,h*.5,r,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.beginPath();ctx.arc(w*.72,h*.5,r,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(w*.46,h*.5);ctx.lineTo(w*.54,h*.5);ctx.stroke();ctx.beginPath();ctx.moveTo(w*.1,h*.5);ctx.lineTo(w*.03,h*.56);ctx.stroke();ctx.beginPath();ctx.moveTo(w*.9,h*.5);ctx.lineTo(w*.97,h*.56);ctx.stroke();}
  else if(shape==='oval'){ctx.beginPath();ctx.ellipse(w*.27,h*.5,w*.19,h*.16,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.beginPath();ctx.ellipse(w*.73,h*.5,w*.19,h*.16,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(w*.46,h*.5);ctx.lineTo(w*.54,h*.5);ctx.stroke();ctx.beginPath();ctx.moveTo(w*.08,h*.5);ctx.lineTo(w*.02,h*.56);ctx.stroke();ctx.beginPath();ctx.moveTo(w*.92,h*.5);ctx.lineTo(w*.98,h*.56);ctx.stroke();}
  else if(shape==='sport'){ctx.lineWidth=3.5;[[w*.07,w*.43],[w*.57,w*.93]].forEach(([x1,x2])=>{ctx.beginPath();ctx.moveTo(x1,h*.38);ctx.lineTo(x1,h*.62);ctx.quadraticCurveTo(x1,h*.7,x1+8,h*.7);ctx.lineTo(x2-8,h*.7);ctx.quadraticCurveTo(x2,h*.7,x2,h*.62);ctx.lineTo(x2,h*.38);ctx.quadraticCurveTo(x2,h*.3,x2-8,h*.3);ctx.lineTo(x1+8,h*.3);ctx.quadraticCurveTo(x1,h*.3,x1,h*.38);ctx.closePath();ctx.fill();ctx.stroke();});ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(w*.43,h*.5);ctx.lineTo(w*.57,h*.5);ctx.stroke();ctx.beginPath();ctx.moveTo(w*.07,h*.5);ctx.lineTo(w*.01,h*.56);ctx.stroke();}
  else{ctx.fillStyle=fc+'30';ctx.fillRect(w*.18,h*.22,w*.64,h*.56);ctx.strokeStyle=fc;ctx.lineWidth=2;ctx.strokeRect(w*.18,h*.22,w*.64,h*.56);ctx.fillStyle=fc;ctx.font=`700 ${w*.28}px Montserrat`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('VP',w/2,h/2);}
}
function productCardHTML(p,prefix='c'){
  const bm={new:'badge-new',csa:'badge-csa',pro:'badge-pro'};
  const imgEl=p.photo
    ?'<img src="'+p.photo+'" alt="'+p.name+'" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;">'
    :'<canvas id="'+prefix+p.id+'" width="320" height="320" aria-hidden="true"></canvas>';
  return`<div class="product-card" role="listitem"><div class="product-img">${imgEl}${p.badge?`<div class="product-badge ${bm[p.badge]||''}">${p.badge==='csa'?'CSA Compliant':p.badge==='new'?'New':'Pro'}</div>`:''}<button class="product-wishlist" onclick="showToast('Saved to wishlist')" aria-label="Add to wishlist">â™¡</button></div><div class="product-info"><div class="product-collection">${p.col}</div><div class="product-name">${p.name}</div><div class="product-desc">${p.desc}</div><div class="product-footer"><div class="product-price">$${p.price}</div><button class="add-to-cart-btn" onclick="addToCart(${p.id})">Add to Cart</button></div></div></div>`;
}
function renderTo(id,filter='all',limit=null){
  const el=document.getElementById(id);if(!el)return;
  let prods=filter==='all'?allProducts:allProducts.filter(p=>p.col===filter);
  if(limit)prods=prods.slice(0,limit);
  el.innerHTML=prods.map(p=>productCardHTML(p,'h')).join('');
  prods.forEach(p=>setTimeout(()=>{const c=document.getElementById(`h${p.id}`);if(c)drawFrame(c,p.shape,p.col);},30));
}
function filterHomeProds(btn,f){document.querySelectorAll('.col-tab').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false');});btn.classList.add('active');btn.setAttribute('aria-selected','true');renderTo('homeProdsGrid',f,8);}
function filterShop(f){
  document.querySelectorAll('.shop-sidebar .sb-links a').forEach(a=>a.classList.remove('sb-active'));
  const ids={all:'sbf-all','Professional Performance':'sbf-pp','Digital Eye Performance':'sbf-dep','Industrial Prescription Safety':'sbf-ips','Lunettes Signature':'sbf-ls','Accessories':'sbf-acc'};
  const el=document.getElementById(ids[f]);if(el)el.classList.add('sb-active');
  const prods=f==='all'?allProducts:allProducts.filter(p=>p.col===f);
  document.getElementById('shopCount').textContent=prods.length;
  const g=document.getElementById('shopGrid');g.innerHTML=prods.map(p=>productCardHTML(p,'s')).join('');
  prods.forEach(p=>setTimeout(()=>{const c=document.getElementById(`s${p.id}`);if(c)drawFrame(c,p.shape,p.col);},30));
}

// â•â•â•â• CART â•â•â•â•
let cart=[];
function addToCart(id){
  const p=allProducts.find(x=>x.id===id);
  const ex=cart.find(x=>x.id===id);
  if(ex)ex.qty++;else cart.push({...p,qty:1});
  updateCart();showToast(`${p.name} added to cart`);
  if(!document.getElementById('cartSidebar').classList.contains('open'))toggleCart();
}
function updateCart(){
  const count=cart.reduce((s,i)=>s+i.qty,0);
  document.getElementById('cartBadge').textContent=count;
  const total=cart.reduce((s,i)=>s+i.price*i.qty,0);
  document.getElementById('cartSub').textContent=`$${total.toFixed(2)}`;
  document.getElementById('cartTotalAmt').textContent=`$${total.toFixed(2)}`;
  const body=document.getElementById('cartBody');
  if(!cart.length){body.innerHTML='<div class="cart-empty">Your cart is empty.</div>';return;}
  body.innerHTML=cart.map(item=>`<div class="cart-line"><div class="cart-line-img">${item.photo?'<img src="'+item.photo+'" alt="'+item.name+'" style="width:100%;height:100%;object-fit:cover;border-radius:12px;display:block;">':'<canvas id="cc'+item.id+'" width="160" height="120" aria-hidden="true" style="border-radius:12px;"></canvas>'}</div><div><div class="cart-line-name">${item.name}</div><div class="cart-line-col">${item.col}</div><div class="cart-qty"><button class="qty-b" onclick="changeQty(${item.id},-1)" aria-label="Decrease quantity">âˆ’</button><span class="qty-n">${item.qty}</span><button class="qty-b" onclick="changeQty(${item.id},1)" aria-label="Increase quantity">+</button></div></div><div class="cart-line-price">$${(item.price*item.qty).toFixed(2)}</div></div>`).join('');
  cart.forEach(item=>setTimeout(()=>{const c=document.getElementById(`cc${item.id}`);if(c)drawFrame(c,item.shape,item.col);},30));
}
function changeQty(id,d){const i=cart.findIndex(x=>x.id===id);cart[i].qty+=d;if(cart[i].qty<=0)cart.splice(i,1);updateCart();}
function toggleCart(){document.getElementById('cartSidebar').classList.toggle('open');document.getElementById('cartOverlay').classList.toggle('open');}

// â•â•â•â• NAVIGATION â•â•â•â•
function navigate(page,collection=null){
  document.querySelectorAll('.page').forEach(p=>{
    const isActive=p.id===`page-${page}`;
    p.classList.toggle('active',isActive);
    p.setAttribute('aria-hidden',String(!isActive));
  });
  document.querySelectorAll('.nav-links a').forEach(a=>a.classList.remove('nav-active'));
  const target=document.getElementById(`page-${page}`);
  if(target){window.scrollTo({top:0,behavior:'smooth'});}
  const nl=document.getElementById(`nl-${page}`);if(nl)nl.classList.add('nav-active');
  if(page==='home')renderTo('homeProdsGrid','all',8);
  if(page==='shop'){filterShop(collection||'all');}
  setTimeout(()=>triggerReveals(),120);
}

// â•â•â•â• PATH SELECTOR (B2B/B2C) â•â•â•â•
function setPath(type,btn){
  document.querySelectorAll('.path-btn').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-pressed','false');});
  btn.classList.add('active');btn.setAttribute('aria-pressed','true');
  document.getElementById('hero-b2c').style.display=type==='b2c'?'block':'none';
  document.getElementById('hero-b2b').style.display=type==='b2b'?'block':'none';
}

// â•â•â•â• ROI CALCULATOR â•â•â•â•
const VP_PRICES={10:220,50:190,150:165};
function calcROI(){
  const emp=parseInt(document.getElementById('roiEmp').value);
  const cost=parseInt(document.getElementById('roiCost').value);
  const freq=parseInt(document.getElementById('roiFreq').value);
  document.getElementById('roiEmpVal').textContent=emp;
  document.getElementById('roiCostVal').textContent=`$${cost}`;
  document.getElementById('roiFreqVal').textContent=`${freq} yr${freq>1?'s':''}`;
  const vpUnit=emp>=150?165:emp>=50?190:220;
  const annualCurrent=(emp*cost)/freq;
  const annualVP=(emp*vpUnit)/freq;
  const saving=Math.max(0,annualCurrent-annualVP);
  const pct=annualCurrent>0?Math.round((saving/annualCurrent)*100):0;
  document.getElementById('roiSaving').textContent=`$${Math.round(saving).toLocaleString()}`;
  document.getElementById('roiUnit').textContent=`$${vpUnit}`;
  document.getElementById('roiPct').textContent=`${pct}%`;
}
calcROI();

// â•â•â•â• FORMS â•â•â•â•
async function submitForm(type){
  const btn=document.querySelector(`[onclick="submitForm('${type}')"]`);
  const orig=btn?btn.innerHTML:'';
  if(btn){btn.disabled=true;btn.innerHTML='Sendingâ€¦';}
  const fields={
    mobile:{org:'#mc-org',contact:'#mc-contact',email:'#mc-email',phone:'#mc-phone',employees:'#mc-employees',date:'#mc-date',address:'#mc-address',notes:'#mc-notes'},
    corporate:{company:'#corp-company',contact:'#corp-contact',email:'#corp-email',phone:'#corp-phone',employees:'#corp-employees',date:'#corp-date',location:'#corp-location',notes:'#corp-notes'},
    contact:{name:'#ct-name',company:'#ct-company',email:'#ct-email',subject:'#ct-subject',message:'#ct-message'}
  };
  const data={};
  const map=fields[type]||{};
  for(const[k,sel]of Object.entries(map)){const el=document.querySelector(sel);if(el)data[k]=el.value;}
  try{
    const r=await fetch(`/api/${type}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
    const j=await r.json();
    if(r.ok){const msgs={mobile:"Mobile clinic request submitted! We'll contact you within 1 business day.",corporate:"Corporate program request submitted! A representative will be in touch shortly.",contact:"Message sent! We'll respond within 1 business day."};showToast(msgs[type]||j.message||'Submitted!');for(const[k,sel]of Object.entries(map)){const el=document.querySelector(sel);if(el)el.value='';}}
    else{showToast(j.error||'Something went wrong. Please try again.');}
  }catch(e){showToast('Our contact form requires the full server. For beta testing, please email info@visionperformanceinc.ca â€” we\'ll respond within 1 business day.');}
  finally{if(btn){btn.disabled=false;btn.innerHTML=orig;}}
}

// â•â•â•â• TOAST â•â•â•â•
let toastTimer;
function showToast(msg){clearTimeout(toastTimer);document.getElementById('toastMsg').textContent=msg;document.getElementById('toast').classList.add('show');toastTimer=setTimeout(()=>document.getElementById('toast').classList.remove('show'),3200);}

// â•â•â•â• MOBILE NAV â•â•â•â•
function toggleMobileNav(){
  const btn=document.getElementById('navHamburger');
  const drawer=document.getElementById('mobNavDrawer');
  const overlay=document.getElementById('mobNavOverlay');
  const open=drawer.classList.toggle('open');
  btn.classList.toggle('open',open);
  overlay.classList.toggle('open',open);
  btn.setAttribute('aria-expanded',String(open));
  drawer.setAttribute('aria-hidden',String(!open));
  drawer.setAttribute('aria-modal',open?'true':'false');
  document.body.style.overflow=open?'hidden':'';
}
// â•â•â•â• CHAT â•â•â•â•
const chatReplies={"Get a corporate quote":"Great! I'll connect you with our corporate team. Please fill out our quick form: [Industrial Programs â†’]","Book mobile clinic":"Sure! Our mobile clinic visits workplaces across Canada. Use the form on the Mobile Clinic page to schedule.","Shop eyewear":"Of course! Browse our collections at the Shop page â€” we have Professional, Digital Eye, Industrial Safety, and Lunettes ranges."};
function toggleChat(){
  const open=document.getElementById('chatPanel').classList.toggle('open');
  if(open){const notif=document.querySelector('.chat-notif');if(notif)notif.style.display='none';}
}
function chatReply(msg){addChatMsg(msg,'user');setTimeout(()=>{const reply=chatReplies[msg]||"Thanks for reaching out! A team member will follow up shortly.";addChatMsg(reply,'bot');},600);}
function sendChat(){const input=document.getElementById('chatInput');const msg=input.value.trim();if(!msg)return;addChatMsg(msg,'user');input.value='';setTimeout(()=>addChatMsg("Thank you for your message. Our team will follow up within 1 business day. In the meantime, feel free to browse our programs above.",'bot'),800);}
function addChatMsg(text,from){const msgs=document.getElementById('chatMessages');const div=document.createElement('div');div.className=`chat-msg ${from}`;div.textContent=text;msgs.appendChild(div);msgs.scrollTop=msgs.scrollHeight;}

// â•â•â•â• STICKY BAR â•â•â•â•
window.addEventListener('scroll',()=>{
  document.getElementById('stickyBar').classList.toggle('visible',window.scrollY>400);
  document.getElementById('navbar').classList.toggle('scrolled',window.scrollY>60);
});

// â•â•â•â• REVEAL ANIMATIONS â•â•â•â•
function triggerReveals(){
  document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el=>{
    const r=el.getBoundingClientRect();
    if(r.top<window.innerHeight*1.05)el.classList.add('in');
  });
}
const revealObs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in');}),{threshold:0.08});
document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el=>revealObs.observe(el));

// â•â•â•â• FOOTER INJECTION â•â•â•â•
function injectFooters(){
  const tpl=document.getElementById('footerTemplate');
  ['home','shop','mobile','industrial','book','about','contact','learn','portal','privacy'].forEach(page=>{
    const el=document.getElementById(`footer-${page}`);
    if(el&&tpl){el.appendChild(tpl.content.cloneNode(true));}
  });
}
injectFooters();

// â•â•â•â• ACCESSIBILITY: keyboard support for click-only elements â•â•â•â•
document.querySelectorAll('a[onclick]:not([href]),[role="button"],.audience-card,.path-card,.service-card,.industry-card,.resource-card,.learn-card,.book-option,.testimonial-card[onclick]').forEach(el=>{
  if(!el.hasAttribute('tabindex'))el.setAttribute('tabindex','0');
  if(!el.hasAttribute('role'))el.setAttribute('role','button');
});
document.addEventListener('keydown',e=>{
  if(e.key==='Enter'||e.key===' '){
    const el=e.target.closest('a[onclick]:not([href]),[role="button"][onclick],[onclick][tabindex]');
    if(el&&el===e.target){e.preventDefault();el.click();}
  }
});

// â•â•â•â• INIT â•â•â•â•
// Set aria-hidden on all inactive pages at load so screen readers only see page-home
document.querySelectorAll('.page:not(.active)').forEach(p=>p.setAttribute('aria-hidden','true'));
// Show PIPEDA privacy notice if not yet acknowledged
if(!localStorage.getItem('vp-privacy-ack')){const cb=document.getElementById('cookieBar');if(cb)cb.style.display='flex';}
renderTo('homeProdsGrid','all',8);
filterShop('all');
triggerReveals();
