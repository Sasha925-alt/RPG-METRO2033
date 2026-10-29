//////////1//////////////////
let hp, maxHp;
let ammo, med, filters;
let moral = 0;
let hasKhan = false;
let hasBeacon = false;
//////////2////////////
const enemies = {
  rat:    { name: "Щур",             hp: 25, min: 3, max: 7,  reward: 3 },
  spider: { name: "Павук",           hp: 35, min: 5, max: 9,  reward: 5 },
  nosal:  { name: "Носаліс",         hp: 45, min: 6, max: 10, reward: 6 },
  guard:  { name: "Охоронець Рейху", hp: 55, min: 8, max: 12, reward: 8 },
  mutant: { name: "Мутант",          hp: 60, min: 9, max: 13, reward: 8 }
};
//////////3/////////////
function rnd(a, b) {
  return a + Math.floor(Math.random() * (b - a + 1));
}
//////////4///////////
function isDead() {
  return hp <= 0;
}
//////////5//////////////
function ask(text, options) {
  let out = "";
  if (hp !== undefined) {
    out = "HP " + hp + "/" + maxHp + " | Патрони " + ammo +
          " | Аптечки " + med + " | Фільтри " + filters + "\n-----------------\n";
  }
  out = out + text + "\n\n";
  for (let i = 0; i < options.length; i++) {
    out = out + (i + 1) + ") " + options[i] + "\n";
  }
  let n = Number(prompt(out));
  while (!(n >= 1 && n <= options.length)) {
    n = Number(prompt("Введи цифру від 1 до " + options.length + "\n\n" + out));
  }
  return n;
}
//////////6//////////////
function shop() {
  let leave = false;
  while (!leave) {
    let c = ask("Торговець: «Патрони єдина валюта».",
      ["Фільтр (5 патронів)", "Аптечка (8 патронів)", "Піти"]);
    if (c === 1 && ammo >= 5) {
      ammo = ammo - 5;
      filters = filters + 1;
      alert("Куплено фільтр.");
    } else if (c === 2 && ammo >= 8) {
      ammo = ammo - 8;
      med = med + 1;
      alert("Куплено аптечку.");
    } else if (c === 1 || c === 2) {
      alert("Не вистачає патронів.");
    } else {
      leave = true;
    }
  }
}
//////////7///////////////
function fight(e) {
  let enemyHp = e.hp;
  alert("Бій: " + e.name + "!");
  if (hasKhan && ammo > 0) {
    ammo = ammo - 1;
    let dmg = rnd(4, 8);
    enemyHp = enemyHp - dmg;
    alert("Хан стріляє поруч (-1 патрон). Ворогу -" + dmg + ".");
  }
  while (enemyHp > 0 && hp > 0) {
    let c = ask(e.name + ": " + enemyHp + " HP",
      ["Стріляти (-1 патрон)", "Ближній бій", "Аптечка (+40 HP)"]);
    if (c === 1) {
      if (ammo < 1) {
        alert("Немає патронів!");
        continue;
      }
      ammo = ammo - 1;
      if (Math.random() < 0.8) {
        let dmg = rnd(18, 26);
        enemyHp = enemyHp - dmg;
        alert("Влучив! -" + dmg);
      } else {
        alert("Схибив!");
      }
    } else if (c === 2) {
      let dmg = rnd(5, 9);
      enemyHp = enemyHp - dmg;
      alert("Удар! -" + dmg);
    } else {
      if (med < 1) {
        alert("Аптечок немає!");
        continue;
      }
      med = med - 1;
      hp = Math.min(maxHp, hp + 40);
      alert("Ти лікуєшся.");
    }
    if (enemyHp > 0) {
      let dmg = rnd(e.min, e.max);
      hp = hp - dmg;
      alert(e.name + " б'є: -" + dmg + " HP.");
    }
  }
  if (hp > 0) {
    ammo = ammo + e.reward;
    alert("Перемога! +" + e.reward + " патронів.");
  }
}
//////////8//////////////
function intro() {
  alert("МЕТРО 2033\n\nЯдерна війна знищила світ.\n" +
    "Вцілілі живуть у тунелях метро.\nТебе виховали на станції ВДНГ.");
}
//////////9/////////////
function chooseClass() {
  let c = ask("Обери стиль гри:",
    ["Сталкер (80 HP, 20 патронів)",
     "Інженер (90 HP, 2 аптечки)",
     "Солдат (120 HP, 2 фільтри)"]);
  if (c === 1) {
    maxHp = 80;  ammo = 20;  med = 1;  filters = 3;
  } else if (c === 2) {
    maxHp = 90;  ammo = 12;  med = 2;  filters = 3;
  } else {
    maxHp = 120; ammo = 10;  med = 1;  filters = 2;
  }
  hp = maxHp;
}
//////////10//////////////
function vdnh() {
  alert("Станція ВДНГ.\n\nЛюдей лякають Чорні: невідомі істоти з боку Останкіна.");
  let ready = false;
  while (!ready) {
    let c = ask("Мисливець, досвідчений рейнджер, просить дійти до Полісу й попередити лідерів.",
      ["Погодитись і вирушити",
       "Запитати, чому не піде сам",
       "Запитати про Чорних",
       "До торговця"]);
    if (c === 1) {
      ready = true;
    } else if (c === 2) {
      alert("Мисливець: «Я піду до Чорних. Хтось має дійти до Полісу, і це ти».");
    } else if (c === 3) {
      alert("Мисливець: «Від них болить голова, і з'являються дивні сни».");
    } else {
      shop();
    }
  }
  alert("Мисливець дає тобі фільтр і йде в темряву.");
  filters = filters + 1;
}
//////////11//////////////
function tunnel() {
  alert("Ти йдеш темним тунелем до Ботанічного саду.\nДесь капає вода. Ти не один.");
  const list = ["rat", "spider"];
  fight(enemies[list[rnd(0, 1)]]);
  if (isDead()) return;
  let found = rnd(3, 6);
  ammo = ammo + found;
  alert("Далі стоїть іржава скриня. Всередині " + found + " патронів.");
}
//////////12///////////
function khan() {
  if (isDead()) return;
  let c = ask("З темряви виходить чоловік у плащі. Це Хан.\n«Я проведу тебе. Але кожен бій коштує патрон».",
    ["Погодитись", "Піти самому"]);
  if (c === 1) {
    hasKhan = true;
    alert("Хан приєднується до тебе.");
  }
}
//////////13/////////////
function reich() {
  if (isDead()) return;
  let c = ask("Патруль Рейху перекрив перехід.",
    ["Пройти тихо (50%)", "Прорватися з боєм", "Віддати 5 патронів"]);
  if (c === 1) {
    if (Math.random() < 0.5) {
      alert("Ти непомітно проходиш повз патруль.");
    } else {
      hp = hp - 15;
      alert("Тебе помітили! Втеча коштувала 15 HP.");
    }
  } else if (c === 2) {
    fight(enemies.guard);
  } else {
    if (ammo >= 5) {
      ammo = ammo - 5;
      alert("Патруль бере патрони й пропускає тебе.");
    } else {
      alert("Патронів не вистачає. Доведеться пробиватись.");
      fight(enemies.guard);
    }
  }
}
//////////14/////////////
function refugee() {
  if (isDead()) return;
  let c = ask("Біля виходу сидить біженець і просить їжі.",
    ["Віддати 2 патрони (+1 мораль)",
     "Пройти повз",
     "Забрати в нього патрони (-1 мораль)"]);
  if (c === 1 && ammo >= 2) {
    ammo = ammo - 2;
    moral = moral + 1;
    alert("Біженець дякує тобі.");
  } else if (c === 3) {
    ammo = ammo + 3;
    moral = moral - 1;
    alert("Ти забираєш у нього 3 патрони. Він мовчки відвертається.");
  }
}
//////////15/////////////
function polis() {
  if (isDead()) return;
  alert("Поліс. Бібліотека. Вчені, книги й рейнджери.\nКомандир Міллер слухає тебе.");
  let heardPlan = false;
  let leave = false;
  while (!leave) {
    let c = ask("Міллер чекає.",
      ["Розповісти про Чорних", "Запитати про план", "До торговця", "Іти до бункера D6"]);
    if (c === 1) {
      alert("Міллер: «Вони з'явились біля ВДНГ. Це гірше, ніж я думав».");
    } else if (c === 2) {
      alert("Міллер: «У бункері D6 є ракети й маяк наведення.\n" +
        "Установиш маяк на вежі в Останкіні й натиснеш кнопку».");
      heardPlan = true;
    } else if (c === 3) {
      shop();
    } else if (heardPlan) {
      leave = true;
    } else {
      alert("Міллер: «Спершу вислухай план».");
    }
  }
}
//////////16//////////////
function d6() {
  if (isDead()) return;
  alert("Бункер D6. Секретна військова база. Усередині темно й тихо.");
  let searched = false;
  while (!hasBeacon) {
    let c = ask("У сейфі лежить маяк наведення.", ["Взяти маяк", "Обшукати бункер"]);
    if (c === 1) {
      hasBeacon = true;
      alert("Ти береш маяк.");
    } else if (!searched) {
      searched = true;
      ammo = ammo + 5;
      alert("Ти знаходиш 5 патронів.");
    } else {
      alert("Більше тут нічого немає.");
    }
  }
  alert("На виході з бункера на тебе нападає носаліс.");
  fight(enemies.nosal);
}
//////////17//////////////
function surface() {
  if (isDead()) return;
  alert("Ти виходиш на поверхню. Повітря отруйне.\nКожен крок зношує фільтр.");
  for (let step = 1; step <= 3; step++) {
    if (isDead()) return;
    if (filters > 0) {
      filters = filters - 1;
      alert("Фільтр зношується. Лишилось: " + filters + ".");
    } else {
      hp = hp - 8;
      alert("Фільтрів немає! Задихаєшся: -8 HP.");
    }
    if (step === 2 && !isDead()) {
      alert("Серед руїн рухається мутант!");
      fight(enemies.mutant);
    }
  }
}
//////////18/////////////////////
function finale() {
  if (isDead()) return;
  let c = ask("Ти біля вежі Останкіно. Угорі темні силуети.\nОдин Чорний дивиться на тебе і не нападає.",
    ["Піднятися й установити маяк", "Поговорити з Чорним"]);
  if (c === 2) {
    moral = moral + 1;
    alert("Ти бачиш видіння: вони хотіли діалогу. Вони хотіли допомогти.");
  }
  let pressed = false;
  while (!pressed && !isDead()) {
    let b = ask("Маяк встановлено. На ньому одна кнопка.\nРакети D6 чекають сигналу.",
      ["Натиснути кнопку", "Вагатися (-10 HP від радіації)"]);
    if (b === 1) {
      pressed = true;
    } else {
      hp = hp - 10;
    }
  }
  if (isDead()) return;
  let text = "Ти натискаєш кнопку.\n\n" +
    "Небо розривається. Ракети з D6 б'ють по Останкіну.\n" +
    "Вежа руйнується. Гніздо Чорних зникає у вогні.\n" +
    "Усі Чорні гинуть.\n\n" +
    "Світ здригається. Метро більше нічого не боїться...\nі нічого не розуміє.\n";
  if (moral >= 1) {
    text = text + "\nЛише потім ти розумієш: вони хотіли допомогти.\n";
  }
  alert(text + "\nКІНЕЦЬ: Знищення.");
}
//////////19///////////////
intro();
chooseClass();
const scenes = [vdnh, tunnel, khan, reich, refugee, polis, d6, surface, finale];
for (let i = 0; i < scenes.length; i++) {
  if (isDead()) break;
  scenes[i]();
}
if (isDead()) {
  alert("Світло гасне. Тунель дихає тобі в обличчя.\n\nМетро забирає всіх.\n\nКІНЕЦЬ: Провал.");
}


/*
1-2гравець і вороги
3-6	дані
7	Бій
8-9	вступ і вибір класу
10-18	9 сценарій
19	Запуск:
*/