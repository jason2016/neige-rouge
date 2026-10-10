// Apres `vite build --mode recette` : la page de test doit avoir SES manifestes et SES icones, et ne
// jamais pointer vers la production (les <link> du HTML sont ecrits en dur « /neige-rouge/… »).
// Echoue bruyamment si un chemin de production subsiste.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DIR = "dist-recette";
const PROD = "/neige-rouge/";
const RECETTE = "/neige-rouge/recette/";
const versRecette = (s) => s.split(PROD).join(RECETTE).split(RECETTE + "recette/").join(RECETTE);

for (const f of readdirSync(DIR).filter((f) => f.endsWith(".html"))) {
  let html = versRecette(readFileSync(join(DIR, f), "utf8"));
  html = html.replace("<head>", '<head>\n    <meta name="robots" content="noindex,nofollow">');
  html = html.replace(/<title>/, "<title>TEST · ");
  writeFileSync(join(DIR, f), html);
}
for (const f of readdirSync(DIR).filter((f) => /^manifest.*\.json$/.test(f))) {
  const m = JSON.parse(versRecette(readFileSync(join(DIR, f), "utf8")));
  m.name = "TEST " + m.name;
  if (m.short_name) m.short_name = "TEST " + m.short_name;
  if (m.id) m.id = versRecette(m.id);
  m.scope = RECETTE;
  writeFileSync(join(DIR, f), JSON.stringify(m, null, 2));
}
// Verification : plus aucun « /neige-rouge/ » qui ne soit pas « /neige-rouge/recette/ » dans HTML et manifestes.
const restes = [];
for (const f of readdirSync(DIR).filter((f) => f.endsWith(".html") || /^manifest.*\.json$/.test(f))) {
  const t = readFileSync(join(DIR, f), "utf8");
  for (const m of t.matchAll(/\/neige-rouge\/(?!recette\/)[^"'\s]*/g)) restes.push(`${f}: ${m[0]}`);
}
if (restes.length) { console.error("CHEMINS DE PRODUCTION RESTANTS :\n" + restes.join("\n")); process.exit(1); }
console.log("post-recette : HTML et manifestes pointent tous vers", RECETTE);
