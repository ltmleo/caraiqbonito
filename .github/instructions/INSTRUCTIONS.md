---
name: carai-q-bonito
description: >
  Gera o conjunto completo de arquivos Markdown para um novo destino no site de viagens
  "Carai Q Bonito!" (projeto Docusaurus). Use esta skill sempre que o usuário pedir para
  adicionar um destino, cidade, país ou local turístico ao site — mesmo que ele não mencione
  "skill" ou "Docusaurus" explicitamente. Triggers típicos: "adiciona Berlim", "cria os
  arquivos para Tokyo", "quero colocar Lisboa no site", "gera o conteúdo para Paris",
  "novo destino: Roma". A skill gera todos os 7 arquivos obrigatórios de uma vez (ou
  individualmente se solicitado), com conteúdo denso, embasado e agradável de ler —
  sempre com um breve resumo no início de cada seção. Inclui geração do destiny.json e
  importação do CityCard na página principal.
---

# ✈️ Carai Q Bonito! — Gerador de Destinos

## 📦 O que esta skill faz

Gera o conjunto completo de arquivos para um destino no site **Carai Q Bonito!**, seguindo rigorosamente a estrutura de pastas e os padrões de conteúdo do projeto.

Cada destino exige **7 arquivos obrigatórios** (incluindo `destiny.json`) + estrutura de pastas correta.

---

## 🔄 Fluxo de Trabalho

### 🔍 1. Pesquisa antes de escrever

**SEMPRE** use web search para embasar o conteúdo antes de gerar os arquivos. Pesquise:
- 📜 História da cidade e do país (datas, personagens, eventos-chave)
- 🗼 Principais pontos turísticos (com endereços, horários, curiosidades)
- 🤯 Fatos inusitados e curiosidades verificáveis
- 🧳 Dicas práticas atualizadas (transporte, moeda, clima, idioma)
- 🎬 Material cultural complementar (filmes, livros, músicas ambientadas no local)

Use múltiplas buscas. Priorize fontes primárias: sites oficiais de turismo, Wikipedia (PT e EN), museus, guias reconhecidos (Lonely Planet, Atlas Obscura, Time Out).

### 🗂️ 2. Identificar a localização na hierarquia

Determine o caminho correto:
```
destinos/[continente]/[regiao]/[cidade]/
```

Exemplos:
- 🇩🇪 Berlim → `destinos/europa/central/berlim/`
- 🇯🇵 Tokyo → `destinos/asia/leste-asiatico/tokyo/`
- 🇦🇷 Buenos Aires → `destinos/america-do-sul/cone-sul/buenos-aires/`

### ✍️ 3. Gerar os arquivos

Gere **todos os 7 arquivos** de uma vez, na ordem abaixo. Se o usuário pedir apenas um arquivo específico, gere só aquele.

---

## 📂 Os 7 Arquivos Obrigatórios

### 📄 Arquivo 0: `destiny.json` — Dados do Destino

Gerado **antes** do `[cidade].md`. Contém todos os dados estruturados do destino para alimentar o componente `CityCard`.

```json
{
  "name": "[Cidade]",
  "country": "[País]",
  "flag": "[emoji da bandeira]",
  "tagline": "[Uma frase de efeito que capture a essência do destino]",
  "heroImage": "[URL de imagem de alta qualidade do Wikimedia Commons ou similar]",
  "currency": "[símbolo da moeda, ex: €, $, ¥]",
  "stayDays": "[X–Y dias recomendados]",
  "stats": [
    { "id": "populacao", "label": "População", "value": "[valor]" },
    { "id": "area", "label": "Área", "value": "[X km²]" },
    { "id": "idioma", "label": "Idioma", "value": "[idioma principal]" },
    { "id": "moeda", "label": "Moeda", "value": "[nome da moeda (símbolo)]", "sub": "1 [SIGLA] ≈ R$ [valor]" },
    { "id": "fuso", "label": "Fuso horário", "value": "UTC[±X]", "sub": "[diferença em relação ao BRT]" },
    { "id": "aeroporto", "label": "Aeroporto", "value": "[código IATA]", "sub": "[Nome do Aeroporto]" }
  ],
  "weather": {
    "current": { "season": "[estação atual]", "temp": "[temp média atual] °C" },
    "seasons": [
      { "name": "Primavera", "icon": "🌸", "temp": "[X–Y °C]", "desc": "[descrição curta]" },
      { "name": "Verão", "icon": "☀️", "temp": "[X–Y °C]", "desc": "[descrição curta]" },
      { "name": "Outono", "icon": "🍂", "temp": "[X–Y °C]", "desc": "[descrição curta]" },
      { "name": "Inverno", "icon": "❄️", "temp": "[X–Y °C]", "desc": "[descrição curta]" }
    ]
  },
  "idealMonths": [[números dos meses ideais para visitar, ex: 4, 5, 6]],
  "costs": {
    "budget": [valor em moeda local/dia],
    "mid": [valor],
    "comfort": [valor],
    "note": "Valores em [moeda] por pessoa/dia, incluindo hospedagem, alimentação e transporte local."
  },
  "tips": [
    { "icon": "🎟️", "text": "[dica prática com <strong> para termos-chave]" },
    { "icon": "🏛️", "text": "[dica sobre atração principal]" },
    { "icon": "💶", "text": "[dica sobre dinheiro/pagamentos]" },
    { "icon": "🚲", "text": "[dica de transporte local]" },
    { "icon": "🌙", "text": "[dica sobre vida noturna ou horários]" }
  ]
}
```

**💡 Notas sobre o destiny.json:**
- `heroImage`: busque imagem de alta qualidade no Wikimedia Commons — prefira paisagens urbanas icônicas
- `stayDays`: indique o intervalo realista (ex: `"3–5"`, `"5–7"`)
- `tips`: use HTML com `<strong>` para destacar termos-chave dentro do texto
- `idealMonths`: array com números (1 = janeiro, 12 = dezembro)

---

### 📄 Arquivo 1: `[cidade].md` — Página Principal

```markdown
---
sidebar_position: 1
title: [Cidade]
---

import CityCard from '@site/src/components/DestinyCard';
import [cidade] from './destiny.json';

<CityCard city={[cidade]} />

# 🌍 [Cidade]

> **Em poucas palavras:** [2-3 frases capturando a essência do lugar — o que o torna único, qual sentimento ele evoca.]

[Introdução geral: 3-4 parágrafos envolventes sobre a cidade. Voz autoral, não enciclopédica. Fale sobre atmosfera, contradições, por que vale a pena ir.]

## 🏰 Resumo histórico

[2-3 parágrafos com os pontos mais marcantes da história. Funciona como teaser para o arquivo history.md.]

→ [Leia a história completa](./history.md)

## 👀 O que não perder

[Lista rápida com links para must-to-see.md e nice-to-see.md]

- ⭐ [Imperdíveis](./must-to-see.md)
- 🗺️ [Vale a Visita](./nice-to-see.md)

## 🎭 Para entrar no clima

🎬 **Filmes:** [lista de filmes ambientados ou sobre o local]  
📺 **Séries:** [lista de séries relevantes]  
📚 **Livros:** [obras literárias ambientadas no local ou sobre sua cultura]  
🎵 **Músicas:** [artistas ou álbuns que capturam o espírito do lugar]

---

*Fontes: [lista de fontes usadas neste arquivo]*
```

---

### 📄 Arquivo 2: `history.md` — História

```markdown
# 🏛️ História

> **Resumo:** [2-3 frases com o arco histórico essencial da cidade — origem, momento de maior relevância, situação atual.]

## ⚔️ [Período ou Era 1, ex: "Origens e Fundação"]

[2-3 parágrafos densos. Inclua datas, personagens históricos, contexto político e cultural. Conecte com o que o viajante verá hoje.]

## 🔥 [Período ou Era 2]

[Continua o fio narrativo histórico...]

## 🏙️ [Período ou Era 3 — mais recente]

[Como a história moldou a cidade que existe hoje.]

## 🌐 O país por trás da cidade

[1-2 parágrafos sobre o contexto histórico nacional relevante para entender a cidade.]

---

*Fontes: [lista de fontes — Wikipedia, museus, livros de história, sites oficiais]*
```

**💡 Dicas de conteúdo para history.md:**
- 📖 Narre como uma história, não como linha do tempo seca
- 🔗 Conecte o passado ao presente: "É por isso que hoje você vê..."
- 👑 Inclua personagens humanos (reis, artistas, revolucionários)
- 🏛️ Mencione eventos que o viajante pode "visitar" (museus, monumentos)

---

### 📄 Arquivo 3: `must-to-see.md` — Imperdíveis

```markdown
# ⭐ Imperdíveis

> **Resumo:** [1-2 frases sobre o que define os pontos imperdíveis desta cidade — o que os torna únicos ou insubstituíveis.]

## 📍 [Nome do Ponto Turístico 1]

[2-3 parágrafos: por que é imperdível, história do local, o que esperar, melhor hora para visitar, dica insider.]

📸 [Fotos no Google Maps](https://www.google.com/maps/search/[nome+do+local])

## 📍 [Nome do Ponto Turístico 2]

[Mesmo formato...]

📸 [Fotos no Google Maps](https://www.google.com/maps/search/[nome+do+local])

[Repita para 4-6 atrações imperdíveis]

---

*Fontes: [sites oficiais dos locais, guias de viagem, Wikipedia]*
```

**💡 Dicas de conteúdo para must-to-see.md:**
- 🎓 Seja generoso com contexto histórico e cultural de cada atração
- 🕵️ Adicione detalhes que só quem pesquisou sabe (horário de menor movimento, ângulo fotográfico, entrada gratuita em certos dias)
- ❓ Evite apenas descrever o que é — diga **por que** importa

---

### 📄 Arquivo 4: `nice-to-see.md` — Vale a Visita

```markdown
# 🗺️ Vale a Visita

> **Resumo:** [1-2 frases sobre o perfil dessas atrações — para quem tem tempo extra ou quer fugir do turismo de massa.]

## 📍 [Nome da Atração 1]

[1-2 parágrafos: o que é, por que vale, para quem é ideal.]

📸 [Fotos no Google Maps](https://www.google.com/maps/search/[nome+do+local])

[Repita para 4-6 atrações secundárias]

---

*Fontes: [fontes utilizadas]*
```

---

### 📄 Arquivo 5: `curiosities.md` — Curiosidades

```markdown
# 🤩 Curiosidades

> **Resumo:** [1-2 frases sobre o tipo de surpresas que este destino guarda — históricas, absurdas, deliciosas.]

- 🧩 **[Título da curiosidade]:** [Desenvolvimento em 2-4 frases. Seja específico — números, datas, nomes reais tornam a curiosidade mais impactante.]

- 😲 **[Título da curiosidade]:** [...]

- 🍽️ **[Título da curiosidade]:** [...]

[Mínimo de 10 curiosidades. Mix de: históricas, arquitetônicas, gastronômicas, comportamentais, linguísticas, inusitadas.]

---

*Fontes: [fontes para as curiosidades — Atlas Obscura, Wikipedia, livros, reportagens]*
```

**💡 Dicas de conteúdo para curiosities.md:**
- ✅ Priorize curiosidades verificáveis (não lendas urbanas sem embasamento)
- 🦶 Inclua pelo menos 2-3 que o viajante pode "experimentar" no local
- 🎨 Varie os temas: arquitetura, gastronomia, língua, política, personalidades

---

### 📄 Arquivo 6: `food.md` — Comida

```markdown
# 🍽️ Comida

> **Resumo:** [1-2 frases sobre a identidade gastronômica da cidade — o que define sua culinária e o que o viajante não pode deixar de provar.]

## 🥘 [Prato típico 1]

[2-3 parágrafos: origem do prato, ingredientes principais, onde encontrar a melhor versão, variações regionais.]

📸 ![Nome do prato](https://[link para imagem do prato no Wikimedia Commons ou similar])

## 🍺 [Prato ou bebida típica 2]

[Mesmo formato...]

[Repita para 5-8 itens gastronômicos — inclua pratos, sobremesas e bebidas]

## 🍴 Onde comer

[2-3 parágrafos sobre os tipos de estabelecimentos típicos: mercados, bistrôs, restaurantes tradicionais, street food. Inclua faixa de preço.]

---

*Fontes: [sites de gastronomia, guias locais, Wikipedia, blogs culinários]*
```

**💡 Dicas de conteúdo para food.md:**
- 🌍 Contextualize a gastronomia dentro da cultura local (influências históricas, imigração, clima)
- 📸 Inclua imagens reais dos pratos como links diretos (Wikimedia Commons, arquivos de domínio público)
- 💸 Indique a faixa de preço aproximada em BRL quando possível
- 🏅 Mencione pratos com reconhecimento internacional (Patrimônio Imaterial da UNESCO, Michelin, etc.)

---

### 📄 Arquivo 7: `tips.md` — Dicas

```markdown
# 💡 Dicas

> **Resumo:** [1-2 frases com o essencial prático — o que faz mais diferença para o viajante que chega pela primeira vez.]

## 🚇 Chegando e se locomovendo

[Transporte do aeroporto, metrô/ônibus/trem, aplicativos úteis, passes de transporte, táxi vs. ride-sharing.]

## ☀️ Melhor época para visitar

[Clima por estação, eventos especiais, temporada alta vs. baixa, dicas de quando ir e quando evitar.]

## 💸 Dinheiro e pagamentos

[Moeda local, taxa de câmbio aproximada em BRL, se cartão é aceito em geral, quanto levar em espécie, gorjeta (costume ou não).]

## 🗣️ Idioma

[Língua oficial, se inglês resolve, expressões básicas úteis em 5-6 palavras, gentilezas culturais relacionadas ao idioma.]

## 🔒 Segurança

[Reputação geral, bairros a evitar, golpes comuns para turistas, dicas de segurança pessoal.]

## 📶 Conectividade

[Chip local vs. roaming, apps essenciais (mapas, tradução, transporte), Wi-Fi público.]

## 🙏 Cultura e etiqueta

[Costumes locais importantes, o que não fazer, vestuário em locais religiosos, horários de funcionamento (ex: siesta), mentalidade local.]

---

*Fontes: [sites de turismo oficiais, relatos de viajantes, Lonely Planet, consulados]*
```

---

## ✅ Padrões de Qualidade — Checklist

Antes de entregar os arquivos, verifique:

- [ ] 📄 O `destiny.json` foi gerado com todos os campos obrigatórios preenchidos
- [ ] 🃏 O `[cidade].md` importa corretamente `CityCard` e `destiny.json`
- [ ] 📝 Cada arquivo `.md` começa com um **resumo em 1-3 frases** (bloco `> `)
- [ ] 💎 O conteúdo é **denso mas acessível** — parágrafos ricos, não listas genéricas
- [ ] 🔗 Todas as informações têm **fontes listadas no final** do arquivo
- [ ] 📸 Os links de fotos usam o formato Google Maps search (must/nice-to-see) ou links diretos de imagem (food.md)
- [ ] 🧭 Todos os links internos entre arquivos terminam com `.md` (ex: `[Imperdíveis](./must-to-see.md)`, `[Leia a história completa](./history.md)`)
- [ ] 📌 O frontmatter `sidebar_position: 1` e `title:` estão presentes **apenas** no arquivo principal `[cidade].md`
- [ ] 📁 A pasta segue a hierarquia `destinos/[continente]/[regiao]/[cidade]/`
- [ ] 🇧🇷 O idioma é **Português do Brasil** em todos os arquivos
- [ ] 🎙️ O tom é **autoral e envolvente** — não um verbete de enciclopédia

---

## 🗃️ Estrutura de Pastas Gerada

```
destinos/
└── [continente]/
    └── [regiao]/
        ├── _category_.yaml        ← criar se não existir
        └── [cidade]/
            ├── destiny.json        ← dados estruturados do CityCard
            ├── [cidade].md         ← sidebar_position: 1 (importa destiny.json + CityCard)
            ├── history.md
            ├── must-to-see.md
            ├── nice-to-see.md
            ├── curiosities.md
            ├── food.md
            └── tips.md
```

**_category_.yaml** (modelo):
```yaml
label: '[Nome da Região]'
position: [número]
```

---

## 🎤 Tom e Voz

O site se chama **"Carai Q Bonito!"** — o nome já diz tudo. A voz deve ser:

- 🔥 **Entusiasmada, mas culta** — não um folder turístico, não uma tese acadêmica
- 🔎 **Específica** — detalhes concretos valem mais que generalidades
- 🫂 **Humana** — o leitor deve sentir que um amigo viajado está contando
- 🚀 **Instigante** — após ler, a pessoa deve querer ir *agora*

❌ Evite: "a cidade é famosa por...", "não deixe de visitar...", "imperdível para os turistas..."  
✅ Prefira: contexto, história, por que aquilo existe, o que significa para quem vive lá.
