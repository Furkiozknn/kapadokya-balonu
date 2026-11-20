// Duman testi: sayfa açılıyor mu, konsolda hata var mı, oyun başlıyor mu, bir etkileşim durumu değiştiriyor mu,
// telefon görünümünde taşma var mı, v2.1 pencereleri ve eski kayıtla açılış çalışıyor mu.
// Depoya bağımlılık eklemez: `playwright` ya da `playwright-core` makinede kurulu olmalı.
//
// Kullanım:  node tools/duman.mjs [klasör]        (varsayılan: deponun kendisi)
// Ortam:     DUMAN_EXE=<tarayıcı exe>  kurulu bir Chromium/Edge kullanmak için (indirme yok)
//            DUMAN_PW=<bir dosya yolu>  playwright paketinin bulunacağı yeri göstermek için
// Çıkış kodu 0: hepsi geçti, 1: en az biri kaldı. Eski sürümle karşılaştırmak için aynı komutu eski klasörde çalıştır.
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname } from 'node:path';

const root = process.argv[2] ? process.argv[2] : join(dirname(fileURLToPath(import.meta.url)), '..');
const req = createRequire(process.env.DUMAN_PW || import.meta.url);
let pw; try { pw = req('playwright'); } catch (e) { pw = req('playwright-core'); }
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
const srv = createServer((q, r) => {
  let p = decodeURIComponent(new URL(q.url, 'http://x').pathname); if (p.endsWith('/')) p += 'index.html';
  const f = join(root, p);
  if (!existsSync(f) || !statSync(f).isFile()) { const nf = join(root, '404.html'); r.writeHead(404, { 'content-type': 'text/html; charset=utf-8' }).end(existsSync(nf) ? readFileSync(nf) : 'nf'); return; }
  r.writeHead(200, { 'content-type': MIME[extname(f)] || 'application/octet-stream' }).end(readFileSync(f));
});
await new Promise(r => srv.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${srv.address().port}/`;
const browser = await pw.chromium.launch({ executablePath: process.env.DUMAN_EXE || undefined, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
let failed = 0;
const ok = (c, msg) => { if (!c) failed++; console.log((c ? 'ok   ' : 'FAIL ') + msg); };

async function open(vp, mobile, seed) {
  const ctx = await browser.newContext({ viewport: vp, isMobile: mobile, hasTouch: mobile });
  await ctx.route(/goatcounter|gc\.zgo/, r => r.fulfill({ status: 200, body: '' }));
  if (seed) await ctx.addInitScript(([k, v]) => { try { if (!localStorage.getItem(k)) localStorage.setItem(k, v); } catch (e) { } }, seed);
  const page = await ctx.newPage(); const errs = [];
  page.on('pageerror', e => errs.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text().slice(0, 140)); });
  page.on('response', r => { if (r.status() >= 400 && !/fonts\./.test(r.url())) errs.push(r.status() + ' ' + r.url().slice(0, 80)); });
  await page.goto(base + '?low', { waitUntil: 'load' });
  await page.waitForFunction(() => window.__loaded, null, { timeout: 60000 });
  await page.waitForFunction(() => !document.getElementById('b-play').disabled, null, { timeout: 30000 }).catch(() => { });
  return { ctx, page, errs };
}
const overflow = page => page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
const hudOut = page => page.evaluate(() => [...document.querySelectorAll('#hud *')].filter(e => { const c = e.getBoundingClientRect(); return c.width > 0 && (c.right > innerWidth + 1 || c.left < -1); }).length);

// 1) masaüstü: açılış, oyun başlangıcı, etkileşim
{
  const { ctx, page, errs } = await open({ width: 1366, height: 768 }, false);
  ok(errs.length === 0, 'masaüstü: konsol hatası/404 yok' + (errs.length ? ' -> ' + errs.join(' | ') : ''));
  ok(await page.evaluate(() => !!document.querySelector('canvas')), 'masaüstü: WebGL tuvali var');
  ok(!(await overflow(page)), 'masaüstü: yatay taşma yok');
  await page.evaluate(() => window.kapadokyaDebug.startFlight(0));
  const a0 = await page.evaluate(() => (window.kapadokyaSim(0.1), window.kapadokya.alt));
  await page.keyboard.down('Space'); const a1 = await page.evaluate(() => (window.kapadokyaSim(8), window.kapadokya.alt)); await page.keyboard.up('Space');
  ok(await page.evaluate(() => window.kapadokya.screen) === 'play' && a1 > a0 + 3, `etkileşim: brülör irtifayı artırdı (${a0} -> ${a1} m)`);
  ok((await page.evaluate(() => window.kapadokya.errors.length)) === 0, 'oyun içi hata listesi boş');
  // sekme arka plana gidince kare üretimi durur (G.hidden) ve geri gelince devam eder
  await ctx.close();
}
// 2) telefon: taşma, uçuş sırasında üst çubuk
{
  const { ctx, page, errs } = await open({ width: 390, height: 844 }, true);
  ok(errs.length === 0, 'telefon: konsol hatası/404 yok' + (errs.length ? ' -> ' + errs.join(' | ') : ''));
  ok(!(await overflow(page)), 'telefon: ana menüde yatay taşma yok');
  await page.evaluate(() => window.kapadokyaDebug.startFlight(0)); await page.waitForTimeout(400);
  await page.evaluate(() => window.kapadokyaSim(2));
  const out = await hudOut(page);
  ok(out === 0, `telefon: üst çubuk ekran dışına taşmıyor (taşan öğe: ${out})`);
  await ctx.close();
}
// 3) v2.1: yeni pencereler + eski kayıtla açılış (kayıt anahtarı arena.kapadokya.save)
{
  const old = JSON.stringify({ stars: [3, 2], done: [true, true], best: [{ score: 80, fuel: 60 }, { score: 70, fuel: 40 }], last: 1, notes: [] });
  const { ctx, page, errs } = await open({ width: 390, height: 844 }, true, ['arena.kapadokya.save', old]);
  ok(errs.length === 0, 'eski kayıtla açılış: hata yok' + (errs.length ? ' -> ' + errs.join(' | ') : ''));
  const has = await page.evaluate(() => !!document.getElementById('b-karne') && !!document.getElementById('b-news') && !!document.getElementById('b-ver'));
  ok(has, 'v2.1: Pilot Karnesi, Yenilikler ve sürüm etiketi düğmeleri var');
  if (has) {
    await page.click('#b-karne'); await page.waitForTimeout(200);
    const k = await page.evaluate(() => ({ rows: document.querySelectorAll('#karne-table tr').length, on: document.querySelectorAll('#karne-ach .on').length, shown: !document.getElementById('ov-karne').hidden, wide: document.documentElement.scrollWidth > innerWidth + 1, tr: document.getElementById('karne-table').textContent.includes('80') }));
    ok(k.shown && k.rows === 13 && k.on >= 2 && k.tr && !k.wide, `Pilot Karnesi eski kayıtla doğru (satır ${k.rows}, açık başarım ${k.on})`);
    await page.keyboard.press('Escape'); await page.waitForTimeout(150);
    ok(await page.evaluate(() => document.getElementById('ov-karne').hidden && !document.getElementById('ov-title').hidden), 'Esc Karne penceresini kapatıp menüye döner');
    await page.click('#b-ver'); await page.waitForTimeout(200);
    ok(await page.evaluate(() => !document.getElementById('ov-news').hidden && document.querySelectorAll('#news-list li').length >= 3), 'sürüm etiketi Yenilikler penceresini açar');
    await page.click('#b-newsclose'); await page.waitForTimeout(150);
    const sz = await page.evaluate(() => ['b-ver', 'a-hub'].map(i => { const r = document.getElementById(i).getBoundingClientRect(); return Math.round(r.height); }));
    ok(sz.every(h => h >= 40), `dokunma hedefleri >= 40 px (${sz.join(', ')})`);
    ok(await page.evaluate(() => document.querySelector('a#a-hub').href === 'https://furkiozknn.github.io/'), '"Diğer oyunlar" bağlantısı merkez sayfaya gidiyor');
  }
  await ctx.close();
}
// 4) 404 sayfası
{
  const r = await fetch(base + 'yok-boyle-bir-sayfa.html');
  const body = await r.text();
  ok(r.status === 404 && /kapadokya-balonu\//.test(body) && /furkiozknn\.github\.io/.test(body), '404 sayfası oyuna ve merkez sayfaya dönüş bağlantısı veriyor');
}
await browser.close(); srv.close();
console.log(failed ? `\n${failed} kontrol kaldı` : '\nhepsi geçti');
process.exit(failed ? 1 : 0);
