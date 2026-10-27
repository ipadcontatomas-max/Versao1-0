# STUG Guarda — Auditoria e estado da versão

## A. Resumo executivo
Ponto de partida: planeador em HTML único, com dados STUG (130 paragens, 16 linhas, 154 viagens), mapa próprio + Leaflet, GPS, favoritos e modo escuro. Principais problemas encontrados: planeador só usava a paragem de origem mais próxima; pesquisa de destinos só por stop ou Nominatim com 1 resultado; sem PWA real (manifest gerado em runtime); etiquetas do mapa com contorno que engolia as letras com zoom; textos de horas a sobrepor-se; avisos de erro "crus"; sem foco visível nem ESC nos modais.
Estado final: todos estes pontos corrigidos e verificados no Chromium (ver F). A app **não está pronta para lançamento público** sem os pontos P0 (secção H).

## B. Alterações visuais
- Antes: cabeçalho simples e cartão branco com campos.
- Agora: cabeçalho com logótipo SVG; bloco "Para onde vais hoje?" com linhas estilizadas nas cores das linhas STUG (decorativas, não geográficas); planeador com trilho origem→destino, botão de inverter, localização atual, botão principal; atalhos (paragens perto, linhas e horários, mapa); aviso de origem dos dados.
- Resultados: cartão "A pé ou de autocarro" com recomendação (autocarro até 15 min mais lento), horas programadas separadas de estimativas.
- Emojis substituídos por ícones SVG (conversão automática). Modo escuro verificado em captura (390 px). Larguras 320–1024 px sem scroll horizontal.
- Não redesenhados em profundidade: modais, cartões da página Linhas e favoritos (só refinamento de estilos).

## C. Alterações técnicas (principais)
| Problema | Solução | Onde |
|---|---|---|
| Só 1 paragem de origem | Analisa até 14 paragens; alarga caminhada se não houver viagem | `plan()` |
| Pesquisa frágil | Normalização, variantes, fuzzy, Nominatim+Photon, ranking, recentes, estados | bloco "DESTINO LIVRE" |
| Sem PWA | `manifest.webmanifest`, `sw.js`, ícones, `offline.html`, registo do SW | pasta `STUG_PWA` |
| Contorno das etiquetas | stroke proporcional ao zoom | `scaleStops()` |
| Sobreposição de horas | colunas próprias para hora | CSS `.dep`, `.lcard` |
| Segurança | CSP, SRI no Leaflet, `esc()` com aspas, iframe com sandbox, favoritos validados, erros globais controlados | head + `esc` |
| Acessibilidade | foco visível, ESC, foco no modal, ARIA em pesquisa/avisos, alvos 44 px | CSS/JS |

## D. Auditoria de dados (executada)
130 paragens, 16 linhas, 154 viagens: 0 coordenadas fora da Guarda, 0 referências a paragens inexistentes, 0 paragens sem linha, 0 viagens com tamanho inconsistente, 0 tempos não monótonos, 0 depois da meia-noite. 40 nomes repetidos em paragens distintas (sentidos opostos — esperado). **Não foi possível confirmar os dados com a STUG**; nenhuma alteração foi feita aos dados.

## E. Funcionalidades preservadas
Planeamento, mapa de linhas e de ruas, GPS, favoritos, modo escuro, próximas partidas, linhas e horários, Google Maps (caminhos a pé e botão). Alterado: lista nativa de paragens do campo de destino (agora painel próprio); campo de origem mantém a lista nativa.

## F. Testes (Chromium/Playwright, local)
| Teste | Resultado | Observação |
|---|---|---|
| Erros JS ao carregar | Aprovado | 0 erros |
| Overflow horizontal 320/375/390/430/768/1024 | Aprovado | 0 px |
| GPS simulado → paragens próximas | Aprovado | 2 cartões |
| Sugestão com erro ("sequera") | Aprovado | Sequeira, Esc. Sequeira 1/2 |
| Erro de rede na pesquisa ("hosptial") | Aprovado | mensagem + "Tentar de novo" |
| Planeador (paragem de destino) | Aprovado | resultado com recomendação |
| 396 pares origem/destino (dados reais) | Aprovado | 329 com viagem; 67 sem, à hora do teste |
| Inverter origem/destino | Aprovado | |
| Favoritos | Aprovado | |
| Horas clicáveis na linha | Aprovado | 22 paragens realçadas |
| ESC fecha modal | Aprovado | |
| Service worker ativo + abrir offline | Aprovado | app abre com banner offline |
| Pesquisa real Nominatim/Photon ("LAVIE", hospital, guarda-gare) | **Não executado** | sem rede no ambiente; só testado com resultados simulados |
| Mapa Leaflet / tiles / Google embed | **Não executado** | sem rede |
| Android, iPhone, iPad reais | **Não executado** | |
| Contraste AA medido | **Não executado** | |
| Instalação PWA no telemóvel | **Não executado** | |

## G. Limitações conhecidas
- Só viagens diretas (sem transbordos); não há partidas do dia seguinte depois do último autocarro.
- Tempo a pé: distância em linha reta × 1,3 (estimativa).
- Linhas do mapa ligam paragens em linha reta; não são o traçado real das ruas e não estão identificadas como tal na legenda.
- Nominatim/Photon públicos e embed do Google Maps (sem chave) não são adequados a uso institucional em escala.
- Data da última verificação dos dados: por confirmar.

## H. Antes do lançamento
**P0:** confirmar horários/paragens com a STUG e registar a data; serviço de pesquisa próprio ou licenciado (e solução licenciada para caminhos a pé); testar em Android/iPhone reais; alojar em HTTPS; política de privacidade (localização, serviços externos).
**P1:** identificar na legenda que as linhas do mapa não seguem as ruas; partidas do dia seguinte; transbordos (se a STUG os permitir); redesenho de modais/Linhas/Favoritos; medir contraste AA; separar dados em JSON.
**P2:** tempo real (se a STUG tiver feed), notificações, versão em inglês.

## I. Avaliação preliminar (não é validação)
Interface 78 · Planeador 75 · Dados 60 (não confirmados) · Mobile 70 (sem dispositivos reais) · PWA 70 (SW testado só em localhost) · Segurança/privacidade 65 · Manutenção 55 (dados embebidos no HTML) · Preparação para lançamento 50.

## J. Ficheiros
`STUG_PWA/index.html` (app), `sw.js` (cache e atualização com consentimento; subir `V` a cada versão), `manifest.webmanifest`, `offline.html`, `icon-192/512/maskable`, `apple-touch-icon.png`. `PLANEADOR.html` = mesma app autónoma (offline/instalação só com os restantes ficheiros em HTTPS).
**Publicar:** colocar o conteúdo de `STUG_PWA` na raiz de um alojamento HTTPS (ex.: GitHub Pages/Netlify). **Testar localmente:** `python3 -m http.server -d STUG_PWA` e abrir `http://localhost:8000`.
