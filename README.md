# 💖 Feliz Dia das Mulheres — Página Personalizada

> Uma página web feita com amor para celebrar o Dia Internacional da Mulher, dedicada à pessoa mais especial da vida.

🌐 **Acesse ao vivo:** [william-kelvem94.github.io/DIA-DAS-MULHERES](https://william-kelvem94.github.io/DIA-DAS-MULHERES/)

---

## ✨ O que tem na página

| Recurso | Descrição |
|---|---|
| 💌 **Hero animado** | Título em caligrafia, emoji com heartbeat e subtítulo suave |
| ⌨️ **Typewriter** | Frases se digitam e apagam em loop automático |
| 💫 **Sparkles no clique** | Todo toque/clique na tela explode em emojis animados |
| 📊 **Barra de progresso** | Barra rosa/roxa no topo que cresce ao rolar a página |
| 🖼️ **Momentos foto + frase** | 5 fotos em destaque, cada uma com uma mensagem personalizada |
| 🎀 **Banners de destaque** | Frases especiais com fundo degradê rosa/roxo |
| 🖼️ **Galeria mosaico** | Todas as fotos do casal em layout de colagem clicável |
| 🔍 **Lightbox com navegação** | Abre qualquer foto em tela cheia; navega com setas ou teclado |
| 💜 **Carta final** | Mensagem íntima e humanizada escrita de coração |
| 💕 **Partículas flutuantes** | Corações rosas e estrelas douradas subindo em loop no fundo |
| 📱 **QR Code dinâmico** | Gerado automaticamente apontando para a URL da própria página |
| 📱 **100% responsivo** | Perfeito em celular, tablet e desktop |

---

## 🗂️ Estrutura do projeto

```
DIA DAS MULHERES/
├── css/               ← estilos compilados e versionados
│   └── style.<hash>.css
├── js/                ← scripts compilados e versionados
│   └── app.<hash>.js
├── scripts/           ← ferramentas de build e utilitários
│   ├── build.py       ← atualiza hashes e service worker
│   ├── convert_images.py
│   └── make_icons.py
├── index.html          ← página única completa
├── manifest.json       ← PWA
├── README.md
└── FOTOS MOZINHO/      ← pasta com todas as fotos do casal
    ├── WhatsApp Image 2026-03-07 at 11.36.02.jpeg
    └── ... (34 fotos no total)
```

---

## 🚀 Como usar / editar

### Pré-requisitos
Nenhum! É uma página 100% estática — HTML, CSS e JavaScript puro.

### Ver localmente
Abra o `index.html` diretamente no navegador (duplo clique).  
> O QR Code só funcionará corretamente quando hospedado em uma URL pública.

### Publicar no GitHub Pages
1. Faça push do repositório para o GitHub (incluindo a pasta `FOTOS MOZINHO`):
   ```bash
   git add .
   git commit -m "Atualização"
   git push
   ```
2. Em **Settings → Pages**, configure source como `main / (root)`.
3. Aguarde o deploy e acesse a URL gerada.

### Personalizar frases
Edite as seções `.moment-card` dentro do `index.html` — cada bloco tem uma tag de texto fácil de trocar.

### Adicionar/remover fotos
- Para as fotos de **destaque** (momentos), troque o `src` das `<img class="moment-photo">`.
- Para a **galeria mosaico**, edite o array `allPhotos` no bloco `<script>` em `js/app.<hash>.js` ou diretamente no `index.html` antes de rodar o `build.py`.

### Regenerar assets
Sempre que alterar `css/style.css` ou `js/app.js`, execute `python scripts/build.py` para criar os arquivos com hash e atualizar o `index.html` e o service worker.

### Imagens e otimização
O diretório **FOTOS MOZINHO/** contém os JPEG originais; para gerar versões WebP (mais leves) basta rodar:
```bash
python scripts/convert_images.py
```
Isso criará pares `.webp` ao lado de cada JPEG. O script ignora automaticamente arquivos já convertidos.

### Desativar partículas
Se o dispositivo estiver lento há um botão no menu de música (✨ Desligar partículas) que oculta o fundo animado e reduz o uso de CPU.

### Empacotar para uso offline
Caso você queira guardar uma cópia independente do site (por exemplo se o GitHub Pages for desativado), há um utilitário Python que cria um ZIP com todos os arquivos necessários. Basta correr:

```bash
python scripts/package_offline.py
```

O arquivo `offline.zip` resultante contém `index.html`, as pastas `css/`, `js/`, `assets/`, `FOTOS MOZINHO/` e outros recursos; ao descompactá‑lo e abrir `index.html` no navegador, a página funciona exatamente como on‑line.

### Observações adicionais
- O arquivo `app.js` foi removido da raiz, ele era apenas a fonte não minificada usada durante o desenvolvimento.
- O service worker adiciona automaticamente os arquivos CSS/JS gerados ao cache toda vez que você roda o `build.py`, garantindo funcionamento offline.

---

## 🛠️ Tecnologias usadas

Também inclui um pequeno script Python para gerar o arquivo `qrcode.png` (ver seção
anterior).  


- **HTML5 / CSS3** — layout, animações e efeitos visuais
- **JavaScript vanilla** — typewriter, partículas, lightbox, sparkles, QR code
- **[QRCode.js](https://davidshimjs.github.io/qrcodejs/)** — geração do QR Code no browser
- **Google Fonts** — Dancing Script + Playfair Display + Lato
- **GitHub Pages** — hospedagem gratuita

---

## 📸 Fotos

As fotos são pessoais e pertencem ao autor. Não estão licenciadas para uso de terceiros.

---

## 💡 Créditos

Desenvolvido com 💖 por **William Kelvem** para o Dia Internacional da Mulher, 8 de março de 2026.

---

*"O meu mundo ficou infinitamente melhor quando você entrou nele."*
<!-- commit adicional para mensagem detalhada ?? -->
