# STARQ — Landing Page

**"O CÓDIGO STARQ: A Iniciação Sombria do Homem Inquebrável"**

Landing page de vendas estática (HTML5 + CSS3 + JS Vanilla) com deploy automático no Cloudflare Pages via GitHub Actions.

---

## Stack

- HTML5 semântico
- CSS3 puro (zero frameworks)
- JavaScript Vanilla (zero dependências)
- Google Fonts: Cinzel Decorative + Crimson Pro
- CI/CD: GitHub Actions → Cloudflare Pages

---

## Deploy Passo a Passo

### 1. Criar projeto no Cloudflare Pages

1. Acesse [dashboard.cloudflare.com](https://dash.cloudflare.com)
2. Menu lateral → **Workers & Pages** → **Pages**
3. Clique em **Create a project**
4. Escolha **Connect to Git**

### 2. Conectar repositório GitHub ao Cloudflare Pages

1. Autorize a conexão com sua conta GitHub
2. Selecione o repositório desta landing page
3. Em **Build settings**:
   - Build command: *(deixar vazio — projeto estático)*
   - Build output directory: `/` (raiz)
4. Clique em **Save and Deploy**
5. Anote o **Account ID** exibido na URL do dashboard: `dash.cloudflare.com/<ACCOUNT_ID>/pages/...`

### 3. Adicionar Secrets no GitHub

No repositório GitHub, vá em:
**Settings → Secrets and variables → Actions → New repository secret**

Adicione os dois secrets abaixo:

| Nome | Valor |
|------|-------|
| `CLOUDFLARE_API_TOKEN` | Token gerado no passo 4 |
| `CLOUDFLARE_ACCOUNT_ID` | ID da sua conta Cloudflare |

### 4. Obter o API Token no Cloudflare

1. Acesse [dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Clique em **Create Token**
3. Use o template **Edit Cloudflare Workers** ou crie customizado com:
   - **Permissão**: `Cloudflare Pages — Edit`
   - **Recursos de conta**: Incluir sua conta
4. Clique em **Continue to summary** → **Create Token**
5. Copie o token gerado (aparece apenas uma vez) e salve no GitHub Secret `CLOUDFLARE_API_TOKEN`

### 5. Configurar domínio customizado starq.com.br

1. No Cloudflare Pages, abra o projeto `starq-landing`
2. Vá em **Custom domains** → **Set up a custom domain**
3. Digite `starq.com.br` e confirme
4. O Cloudflare vai exibir os registros DNS necessários (CNAME)

### 6. Apontar DNS da Hostinger para o Cloudflare

**Opção A — Transferir DNS completo para Cloudflare (recomendado):**

1. Adicione o domínio `starq.com.br` no Cloudflare:
   - [dash.cloudflare.com](https://dash.cloudflare.com) → **Add a site**
   - Siga o assistente e copie os 2 nameservers Cloudflare fornecidos
   - Exemplos: `aria.ns.cloudflare.com`, `leo.ns.cloudflare.com`
2. No painel da **Hostinger** (hpanel.hostinger.com):
   - Vá em **Domínios** → selecione `starq.com.br` → **DNS / Nameservers**
   - Troque pelos nameservers do Cloudflare
   - Propagação: 24–48h

**Opção B — Manter DNS na Hostinger (apenas CNAME):**

1. No painel da Hostinger, adicione um registro CNAME:
   - Nome: `@` (ou `www`)
   - Valor: `starq-landing.pages.dev`

### 7. Fluxo de Deploy Automático

```
git add .
git commit -m "feat: atualização"
git push origin main
```

↓ GitHub Actions dispara automaticamente  
↓ Cloudflare Pages faz o build e publica  
↓ Live em menos de 60 segundos

Acompanhe em: **GitHub → Actions** ou **Cloudflare Pages → Deployments**

### 8. Rollback para versão anterior

1. No Cloudflare Pages → **Deployments**
2. Localize o deployment desejado na lista
3. Clique nos 3 pontos `···` → **Rollback to this deployment**
4. Confirme — o rollback é instantâneo, sem rebuild

---

## Personalização Pendente

Antes de publicar, substitua os placeholders no `index.html`:

| Placeholder | O que substituir |
|-------------|-----------------|
| `R$ XX,00` (De) | Preço original riscado |
| `R$ XX,00` (Por) | Preço de venda |
| `X× de R$ X,XX` | Parcelamento |
| `href="#"` nos botões CTA | Link de pagamento (Hotmart, Kiwify, etc.) |
| `[EXEMPLO — SUBSTITUIR POR DEPOIMENTO REAL]` | Depoimentos reais dos clientes |
| `og:image` | URL da imagem Open Graph (1200×630px) |

---

## Estrutura de Arquivos

```
/
├── index.html              # Página principal
├── style.css               # Estilos (CSS puro, variáveis, responsivo)
├── main.js                 # Interatividade (cursor, canvas, scroll, FAQ)
├── .github/
│   └── workflows/
│       └── deploy.yml      # CI/CD GitHub Actions → Cloudflare Pages
└── README.md               # Este arquivo
```

---

## Performance

- Zero dependências JS externas
- Fontes via Google Fonts (preconnect configurado)
- Canvas desabilitado fora do viewport (IntersectionObserver)
- Partículas reduzidas em mobile
- Cursor customizado desabilitado em touch devices
- Alvo: Lighthouse > 90 em mobile

---

© 2025 STARQ. Todos os direitos reservados.
