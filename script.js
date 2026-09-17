const app=document.getElementById('app'),toast=document.getElementById('toast');
const restaurants=[
{id:'sushi-time',name:'Sushi Time',emoji:'🍣',rating:4.7,time:'25–40 мин',tags:['Суши','Японская'],desc:'Роллы, суши и горячие блюда.'},
{id:'green-bowl',name:'Green Bowl',emoji:'🥗',rating:4.8,time:'25–40 мин',tags:['Поке','Салаты'],desc:'Свежие боулы, салаты и полезные блюда.'},
{id:'pizza-house',name:'Pizza House',emoji:'🍕',rating:4.6,time:'30–45 мин',tags:['Пицца'],desc:'Пицца на тонком тесте и закуски.'},
{id:'burger-lab',name:'Burger Lab',emoji:'🍔',rating:4.6,time:'20–35 мин',tags:['Бургеры','Фастфуд'],desc:'Бургеры, картофель и комбо.'}
];
const foods=[
{id:1,restaurant:'sushi-time',name:'Филадельфия классикс',price:399,kcal:430,emoji:'🍣',rating:4.9,desc:'Лосось, сливочный сыр, огурец.'},
{id:2,restaurant:'sushi-time',name:'Рамен с курицей',price:390,kcal:610,emoji:'🍜',rating:4.7,desc:'Насыщенный бульон, лапша, курица и зелень.'},
{id:3,restaurant:'sushi-time',name:'Том ям с креветками',price:520,kcal:380,emoji:'🍲',rating:4.7,desc:'Острый тайский суп с креветками.'},
{id:4,restaurant:'green-bowl',name:'Поке с лососем',price:450,kcal:520,emoji:'🥗',rating:4.8,desc:'Лосось, авокадо, огурец, эдамаме, рис, соус и кунжут.'},
{id:5,restaurant:'green-bowl',name:'Салат Цезарь',price:349,kcal:360,emoji:'🥬',rating:4.8,desc:'Курица, салат, сухарики и соус цезарь.'},
{id:6,restaurant:'pizza-house',name:'Пицца Пепперони',price:590,kcal:820,emoji:'🍕',rating:4.7,desc:'Томатный соус, моцарелла и пепперони.'},
{id:7,restaurant:'burger-lab',name:'Бургер BBQ',price:490,kcal:780,emoji:'🍔',rating:4.6,desc:'Говядина, сыр, салат и фирменный BBQ-соус.'}
];
let cart=JSON.parse(localStorage.vkusgo_cart||'[]'),fav=JSON.parse(localStorage.vkusgo_fav||'[]'),profile=JSON.parse(localStorage.vkusgo_profile||'{"name":"Анастасия","phone":"+7 (999) 123-45-67","address":"ул. Ленина, 43","apartment":"Квартира 12","comment":""}'),messages=JSON.parse(localStorage.vkusgo_messages||'[]'),addresses=JSON.parse(localStorage.vkusgo_addresses||'[]');
if(!addresses.includes(profile.address))addresses.unshift(profile.address);
const save=()=>{localStorage.vkusgo_cart=JSON.stringify(cart);localStorage.vkusgo_fav=JSON.stringify(fav);localStorage.vkusgo_profile=JSON.stringify(profile);localStorage.vkusgo_messages=JSON.stringify(messages);localStorage.vkusgo_addresses=JSON.stringify(addresses)};
const money=n=>n.toLocaleString('ru-RU')+' ₽',count=()=>cart.reduce((s,x)=>s+x.qty,0),total=()=>cart.reduce((s,x)=>s+(foods.find(f=>f.id===x.id)?.price||0)*x.qty,0),restaurantById=id=>restaurants.find(r=>r.id===id);
function toastMsg(t){toast.textContent=t;toast.classList.add('show');clearTimeout(window.tt);window.tt=setTimeout(()=>toast.classList.remove('show'),1800)}
function add(id){let x=cart.find(a=>a.id===id);x?x.qty++:cart.push({id,qty:1});save();toastMsg('Добавлено в корзину')}
function changeQty(id,d){let x=cart.find(a=>a.id===id);if(x){x.qty+=d;if(x.qty<1)cart=cart.filter(a=>a.id!==id)}save();render('cart')}
function toggleFav(id){fav.includes(id)?fav=fav.filter(x=>x!==id):fav.push(id);save();toastMsg(fav.includes(id)?'Добавлено в избранное':'Удалено из избранного');render('favorites')}
function nav(a){return `<nav class="bottom-nav"><button class="${a==='home'?'active':''}" onclick="render('home')">⌂<small>Главная</small></button><button class="${a==='catalog'?'active':''}" onclick="render('catalog')">⌕<small>Рестораны</small></button><button class="${a==='cart'?'active':''}" onclick="render('cart')">🛍<small>Корзина ${count()?`(${count()})`:''}</small></button><button class="${a==='profile'?'active':''}" onclick="render('profile')">♙<small>Профиль</small></button></nav>`}
function header(t=''){return `<div class="topbar"><button class="back" onclick="render('home')">‹</button><b class="header-brand"><img src="icon.png" alt=""><span>${t||'Вкус<span>Го</span>'}</span></b><button class="cart-icon" aria-label="Корзина" onclick="render('cart')">🛍<span class="cart-badge" style="${count()?'display:flex':'display:none'}">${count()}</span></button></div>`}
function restaurantCard(r){return `<div class="restaurant" onclick="render('restaurant','${r.id}')"><div class="restaurant-img">${r.emoji}</div><div style="flex:1"><h3>${r.name}</h3><p class="muted">Доставка · ${r.time}</p><span>⭐ ${r.rating}</span><p class="muted">${r.tags.join(' · ')}</p></div><span>›</span></div>`}
function foodCard(f){return `<article class="food-card" onclick="render('food',${f.id})"><div class="food-img">${f.emoji}</div><div class="food-body"><h3>${f.name}</h3><div class="muted">⭐ ${f.rating} · ${f.kcal} ккал</div><div class="row"><b>${money(f.price)}</b><button class="plus" aria-label="Добавить ${f.name}" onclick="event.stopPropagation();add(${f.id})">+</button></div></div></article>`}
function addressPicker(){return `<div class="address-picker"><button class="location" onclick="document.getElementById('addressMenu').classList.toggle('open')">⌖ ${profile.address} <span>⌄</span></button><div id="addressMenu" class="address-menu">${addresses.map(a=>`<button onclick="chooseAddress('${a.replace(/'/g,"\\'")}')">⌖ ${a}</button>`).join('')}<button class="add-address" onclick="render('editProfile')">＋ Добавить адрес</button></div></div>`}
function chooseAddress(a){profile.address=a;save();render('home');toastMsg('Адрес выбран')}
function home(){return `<div class="screen">${header()}${addressPicker()}<div class="search">⌕<input placeholder="Найти ресторан или блюдо..." oninput="filterHome(this.value)"></div><div class="ai-banner" onclick="render('ai')"><div><h3>ИИ подберёт блюдо ✨</h3><p>Калории, предпочтения и идеи в одном чате</p></div><div class="ai-bot">✦</div></div><div class="cats">${['🍕 Пицца','🍣 Суши','🍔 Бургеры','🍜 Вок','🥗 Салаты'].map(x=>`<button onclick="render('catalog','${x.slice(2)}')">${x}</button>`).join('')}</div><div id="homeResults"><div class="section-head"><h2>Рестораны рядом</h2><span class="link" onclick="render('catalog')">Все →</span></div><div class="list">${restaurants.map(restaurantCard).join('')}</div></div>${nav('home')}</div>`}
function filterHome(q){let rs=restaurants.filter(r=>(r.name+' '+r.tags.join(' ')).toLowerCase().includes(q.toLowerCase()));let fs=foods.filter(f=>f.name.toLowerCase().includes(q.toLowerCase()));document.getElementById('homeResults').innerHTML=`<div class="section-head"><h2>Результаты</h2></div>${rs.map(restaurantCard).join('')}${fs.map(foodCard).join('')||(!rs.length?'Ничего не нашли':'')}`}
function catalog(filter=''){let rs=restaurants.filter(r=>!filter||r.tags.some(t=>t.toLowerCase().includes(filter.toLowerCase())));return `<div class="screen">${header('Рестораны')}<div class="search">⌕<input placeholder="Поиск ресторана..." oninput="catalogSearch(this.value)"></div><div class="chips">${['Все','Пицца','Суши','Бургеры','Поке'].map(x=>`<button onclick="render('catalog','${x==='Все'?'':x}')">${x}</button>`).join('')}</div><div id="catalogList" class="list">${rs.map(restaurantCard).join('')}</div>${nav('catalog')}</div>`}
function catalogSearch(q){document.getElementById('catalogList').innerHTML=restaurants.filter(r=>(r.name+' '+r.tags.join(' ')).toLowerCase().includes(q.toLowerCase())).map(restaurantCard).join('')||'Ничего не нашли'}
function restaurantPage(id){let r=restaurantById(id)||restaurants[0],fs=foods.filter(f=>f.restaurant===r.id);return `<div class="screen">${header(r.name)}<div class="detail-hero">${r.emoji}</div><div class="detail-sheet"><div class="row"><div><h1>${r.name}</h1><p class="muted">⭐ ${r.rating} · Доставка ${r.time}</p></div><button class="icon-btn" onclick="toggleRestaurantFav('${r.id}')">${fav.includes(r.id)?'♥':'♡'}</button></div><p>${r.desc}</p><div class="section-head"><h2>Меню ресторана</h2><button class="link" onclick="render('cart')">Корзина (${count()})</button></div><div class="menu-vertical">${fs.map(menuItem).join('')}</div></div>${nav('catalog')}</div>`}
function menuItem(f){return `<article class="menu-product" onclick="render('food',${f.id})"><div class="menu-product-img">${f.emoji}</div><div class="menu-product-body"><h3>${f.name}</h3><p>${f.desc}</p><div class="muted">⭐ ${f.rating} · ${f.kcal} ккал</div><div class="row menu-product-bottom"><b>${money(f.price)}</b><button class="plus" aria-label="Добавить ${f.name}" onclick="event.stopPropagation();add(${f.id})">+</button></div></div></article>`}
function toggleRestaurantFav(id){fav.includes(id)?fav=fav.filter(x=>x!==id):fav.push(id);save();render('restaurant',id)}
function food(id){let f=foods.find(x=>x.id===+id)||foods[0],r=restaurantById(f.restaurant);return `<div class="screen">${header()}<div class="detail-hero">${f.emoji}</div><div class="detail-sheet"><p class="link" onclick="render('restaurant','${r.id}')">${r.name} →</p><div class="row"><h1>${f.name}</h1><button class="icon-btn" onclick="toggleFav(${f.id})">${fav.includes(f.id)?'♥':'♡'}</button></div><p>${f.desc}</p><p class="muted">⭐ ${f.rating} · ${f.kcal} ккал</p><button class="primary" onclick="add(${f.id});render('cart')">Добавить в корзину · ${money(f.price)}</button></div></div>`}
function cartPage(){
  let body='';
  if(cart.length){
    body='<div class="cart-list">'+cart.map(x=>{let f=foods.find(y=>y.id===x.id),r=restaurantById(f.restaurant);return '<div class="cart-item"><span class="mini-img">'+f.emoji+'</span><div style="flex:1"><b>'+f.name+'</b><div class="muted">'+r.name+' · '+money(f.price)+'</div><div class="qty"><button onclick="changeQty('+f.id+',-1)">−</button>'+x.qty+'<button onclick="changeQty('+f.id+',1)">+</button></div></div><b>'+money(f.price*x.qty)+'</b></div>'}).join('')+'</div><div class="summary"><div class="total">Итого <b>'+money(total())+'</b></div><button class="primary" onclick="render(\'checkout\')">Оформить заказ</button></div>';
  }else{body='<div class="empty"><h2>Корзина пуста 🛍️</h2><button class="primary" onclick="render(\'catalog\')">Выбрать ресторан</button></div>';}
  return '<div class="screen">'+header('Корзина')+body+nav('cart')+'</div>';
}
function checkout(){return `<div class="screen">${header('Оформление')}<div class="checkout"><label>Адрес доставки<select id="addr">${addresses.map(a=>`<option ${a===profile.address?'selected':''}>${a}</option>`).join('')}</select></label><label>Квартира<input id="apt" value="${profile.apartment}"></label><label>Комментарий<textarea id="comment">${profile.comment}</textarea></label><button class="primary" onclick="profile.address=addr.value;profile.apartment=apt.value;profile.comment=comment.value;save();placeOrder()">Заказать · ${money(total())}</button></div></div>`}
function placeOrder(){cart=[];save();render('order');toastMsg('Заказ оформлен 🎉')}
function order(){return `<div class="screen">${header('Заказ принят')}<div class="empty"><div class="emoji">🛵</div><h2>Курьер уже в пути</h2><p>Примерно 30 минут до адреса: ${profile.address}</p><button class="primary" onclick="render('home')">На главную</button></div>${nav('home')}</div>`}
function ai(){return `<div class="screen">${header('ИИ-консультант')}<div class="chat" id="aichat"><div class="bubble bot">Привет! Напиши лимит калорий, цель или предпочтения. Например: «до 600 ккал», «белковый ужин» или «что заказать на двоих».</div></div><div class="quick">${['До 500 ккал','Белковый ужин','Что выбрать?'].map(x=>`<button onclick="askAI('${x}')">${x}</button>`).join('')}</div><div class="chat-input"><input id="aiinput" placeholder="Напишите сообщение..." onkeydown="if(event.key==='Enter')askAI()"><button onclick="askAI()">➤</button></div></div>`}
function askAI(q){q=q||document.getElementById('aiinput').value;if(!q)return;let chat=document.getElementById('aichat');chat.innerHTML+=`<div class="bubble user">${q}</div>`;let max=+(q.match(/\d+/)||[650])[0];let protein=/белк|сыт|ужин/i.test(q);let suggest=foods.filter(f=>f.kcal<=max).sort((a,b)=>protein?(a.kcal-b.kcal):(Math.abs(max-a.kcal)-Math.abs(max-b.kcal))).slice(0,3);chat.innerHTML+=`<div class="bubble bot">Подобрал варианты до ${max} ккал:<br>${suggest.map(f=>`${f.emoji} <b>${f.name}</b> — ${f.kcal} ккал, ${money(f.price)} <button onclick="add(${f.id})">Добавить</button>`).join('<br>')||'Попробуйте увеличить лимит калорий.'}</div>`;document.getElementById('aiinput').value='';chat.scrollTop=chat.scrollHeight}
function profilePage(){return `<div class="screen">${header('Профиль')}<div class="profile-card"><div class="avatar">👩🏻</div><h2>${profile.name}</h2><p class="muted">${profile.phone}</p></div><div class="profile-list"><div class="item" onclick="render('editProfile')">✎ <span>Мои данные и адреса</span> ›</div><div class="item" onclick="render('favorites')">♡ <span>Избранное (${fav.length})</span> ›</div><div class="item" onclick="render('support')">◌ <span>Поддержка</span> ›</div><div class="item" onclick="render('order')">▣ <span>Мои заказы</span> ›</div><div class="item logout" onclick="logout()">↪ <span>Выйти из аккаунта</span> ›</div></div>${nav('profile')}</div>`}
function editProfile(){return `<div class="screen">${header('Мои данные')}<div class="checkout"><label>Имя<input id="pname" value="${profile.name}"></label><label>Телефон<input id="pphone" value="${profile.phone}"></label><label>Адрес<input id="paddr" value="${profile.address}"></label><label>Квартира<input id="papt" value="${profile.apartment}"></label><button class="primary" onclick="Object.assign(profile,{name:pname.value,phone:pphone.value,address:paddr.value,apartment:papt.value});if(!addresses.includes(profile.address))addresses.unshift(profile.address);save();render('profile');toastMsg('Данные сохранены')">Сохранить</button></div></div>`}
function favorites(){let rs=restaurants.filter(r=>fav.includes(r.id)),fs=foods.filter(f=>fav.includes(f.id));return `<div class="screen">${header('Избранное')}<h2>Рестораны</h2><div class="list">${rs.map(restaurantCard).join('')||'<p class="muted">Пока нет избранных ресторанов.</p>'}</div><h2>Блюда</h2><div class="cards">${fs.map(foodCard).join('')||'<div class="empty">Добавляйте блюда сердечком ♥</div>'}</div>${nav('profile')}</div>`}
function support(){return `<div class="screen">${header('Поддержка')}<div class="chat" id="supportchat">${messages.map(m=>`<div class="bubble ${m.who}">${m.text}</div>`).join('')||'<div class="bubble bot">Здравствуйте! Чем можем помочь?</div>'}</div><div class="chat-input"><input id="supportinput" placeholder="Сообщение..." onkeydown="if(event.key==='Enter')sendSupport()"><button onclick="sendSupport()">➤</button></div></div>`}
function sendSupport(){let v=document.getElementById('supportinput').value.trim();if(!v)return;messages.push({who:'user',text:v},{who:'bot',text:'Спасибо! Специалист поддержки скоро ответит.'});save();render('support')}
function render(page,param){window.scrollTo(0,0);app.innerHTML=page==='home'?home():page==='catalog'?catalog(param):page==='restaurant'?restaurantPage(param):page==='food'?food(param):page==='cart'?cartPage():page==='checkout'?checkout():page==='order'?order():page==='ai'?ai():page==='profile'?profilePage():page==='editProfile'?editProfile():page==='favorites'?favorites():support()}
render('home');

function formatPhone(value){let d=value.replace(/\D/g,'');if(d.startsWith('8'))d='7'+d.slice(1);if(!d.startsWith('7'))d='7'+d;d=d.slice(0,11);let out='+7';if(d.length>1)out+=' ('+d.slice(1,4);if(d.length>=4)out+=')';if(d.length>=4)out+=' '+d.slice(4,7);if(d.length>=7)out+=' '+d.slice(7,9);if(d.length>=9)out+='-'+d.slice(9,11);return out;}
function bindPhoneMask(){const el=document.getElementById('authPhone');if(!el)return;el.addEventListener('input',()=>{el.value=formatPhone(el.value);});}
function logout(){localStorage.removeItem('vkusgo_account');render('auth','login');toastMsg('Вы вышли из аккаунта');}
// Photo-matched local authentication layer.
const authState=()=>JSON.parse(localStorage.vkusgo_account||'null');
function authScreen(mode='login',error=''){
 const reg=mode==='register';
 return `<div class="auth-screen"><div class="auth-inner">
 <div class="auth-brand"><img class="auth-logo" src="icon.png" alt="ВкусГо"><h1>ВкусГо</h1><p>Твоя еда. Умные рекомендации.</p></div>
 <div class="auth-tabs"><button class="${!reg?'active':''}" onclick="render('auth','login')">Вход</button><button class="${reg?'active':''}" onclick="render('auth','register')">Регистрация</button></div>
 ${error?`<div class="auth-error">${error}</div>`:''}
 <form class="auth-form" onsubmit="event.preventDefault();submitAuth('${mode}')">
 ${reg?`<label class="auth-field"><span>Имя</span><input id="authName" required placeholder="Ваше имя"></label>`:''}
 <label class="auth-field"><span>Номер телефона</span><input id="authPhone" required inputmode="tel" type="tel" placeholder="+7 (___) ___ __-__" value="${reg?'':(authState()?.phone||'')}"></label>
 <label class="auth-field"><span>Пароль</span><input id="authPass" required type="password" placeholder="Пароль"></label>
 ${reg?`<label class="auth-field"><span>Повторите пароль</span><input id="authPass2" required type="password" placeholder="Повторите пароль"></label>`:`<div class="auth-forgot" onclick="toastMsg('В демо-версии восстановление доступно через регистрацию')">Забыли пароль?</div>`}
 <button class="auth-submit" type="submit">${reg?'Зарегистрироваться':'Войти'}</button></form>
 <div class="auth-divider">или</div><div class="auth-socials"><button onclick="toastMsg('Вход через Apple в демо-версии')">●</button><button onclick="toastMsg('Вход через Telegram в демо-версии')">➤</button><button onclick="toastMsg('Вход через Google в демо-версии')">G</button><button onclick="toastMsg('Вход через VK в демо-версии')">VK</button></div>
 <p class="auth-terms">Продолжая, вы соглашаетесь с условиями использования и политикой конфиденциальности</p>
 </div></div>`;
}
function submitAuth(mode){
 const phone=document.getElementById('authPhone').value.trim(),pass=document.getElementById('authPass').value;
 if(mode==='register'){
  const name=document.getElementById('authName').value.trim(),pass2=document.getElementById('authPass2').value;
  if(pass!==pass2){app.innerHTML=authScreen('register','Пароли не совпадают');return;}
  localStorage.vkusgo_account=JSON.stringify({name,phone,pass});profile={...profile,name,phone};save();toastMsg('Регистрация выполнена');render('home');
 }else{
  const acc=authState();
  if(!acc||acc.phone!==phone||acc.pass!==pass){app.innerHTML=authScreen('login','Неверный номер телефона или пароль');return;}
  profile={...profile,name:acc.name,phone:acc.phone};save();toastMsg('Вы вошли в аккаунт');render('home');
 }
}
const originalRender=render;
render=function(page,param){if(page==='auth'){app.innerHTML=authScreen(param||'login');bindPhoneMask();return;} if(!authState()&&page!=='auth'){app.innerHTML=authScreen('login');return;} originalRender(page,param)};
if(!authState())render('auth','login');
