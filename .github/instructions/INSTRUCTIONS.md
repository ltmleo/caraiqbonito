# Guia de Estrutura do Projeto - Carai Q Bonito!

Este documento serve como instrução para IAs entenderem como o projeto funciona e como devem ser estruturados os novos destinos.

## Visão Geral
**Carai Q Bonito!** é um site de viagens construído com **Docusaurus**. O objetivo é fornecer informações rápidas, curiosidades e dicas sobre diversos destinos ao redor do mundo.

## Estrutura de Pastas de Destinos
Todos os destinos estão localizados na pasta `/destinos` (configurada como o diretório base de documentos). A hierarquia segue este padrão:

`destinos/[continente]/[regiao]/[cidade]/`

### Arquivos Obrigatórios por Destino
Cada pasta de cidade (ex: `berlim/`) deve conter os seguintes arquivos:

1.  **`[cidade].md` (ex: `berlim.md`)**:
    -   **Função**: Página principal da cidade.
    -   **Frontmatter**: Deve conter `sidebar_position: 1`.
    -   **Conteúdo**: Introdução geral, resumo da história e links rápidos para seções.
    -   **Material complementar**: Filmes, livros, séries, músicas para entrar no clima do destino.

2.  **`history.md`**:
    - **T   ítulo**: História
    -   **Função**: História da cidade.
    -   **Conteúdo**: Resumo da história da cidade e do país.

3.  **`must-to-see.md`**:
    - **Título**: Imperdíveis
    -   **Função**: Destacar os pontos turísticos "obrigatórios" (imperdíveis).
    -   **Conteúdo**: Listas ou parágrafos com as atrações principais.
    -   **Observação**: Adicione link para fotos dos locais.

4.  **`nice-to-see.md`**:
    - **Título**: Vale a Visita
    -   **Função**: Atrações secundárias ou passeios alternativos.
    -   **Conteúdo**: Lugares que valem a pena se houver tempo extra.
    -   **Observação**: Adicione link para fotos dos locais.

5.  **`curiosities.md`**:
    - **Título**: Curiosidades
    -   **Função**: Fatos interessantes, históricos ou divertidos sobre o local.
    -   **Conteúdo**: Idealmente em formato de tópicos (bullet points).

6.  **`tips.md`**:
    - **Título**: Dicas
    -   **Função**: Dicas práticas para o viajante.
    -   **Conteúdo**: Transporte público, moeda, melhor época para visitar, idiomas, etc.

**IMPORTANTE**: Sempre forneça fontes para as informações fornecidas. Coloque as fontes no final de cada arquivo .md.

## Organização do Sidebar (Lateral)
-   O Docusaurus gera o sidebar automaticamente com base na estrutura de pastas.
-   Cada nível de pasta (continente, região) deve ter um arquivo `_category_.yaml` definindo o nome exibido no menu (ex: `label: 'Europa Central'`).
-   Dentro de uma cidade, os arquivos `.md` aparecerão no menu. O arquivo principal da cidade deve vir primeiro (`sidebar_position: 1`).

## Padrões de Conteúdo
-   As informações devem ser em **Português (Brasil)**.
-   Use Markdown padrão para formatação.
-   Ao usar imagens, coloque-as em `/static/img/destinos/[cidade]/` e referencie como `/img/destinos/[cidade]/nome.jpg`.

## Como Adicionar um Novo Destino (Exemplo)
Para adicionar "Paris":
1.  Criar `destinos/europa/ocidental/paris/`.
2.  Criar `paris.md`, `must-to-see.md`, `nice-to-see.md`, `curiosities.md` e `tips.md`.
3.  Verificar se `europa` e `ocidental` já possuem seus respectivos `_category_.yaml`.
4.  Preencher com conteúdo de qualidade seguindo os moldes de Berlim.
