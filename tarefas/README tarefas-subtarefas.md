# Relatório de Tarefas e Subtarefas — Lawyer Eleven

Ferramenta em HTML (arquivo único, sem instalação) que gera um relatório de tarefas e subtarefas do sistema Eleven/Alkasoft, com filtros, visualização em tela e exportação para Excel.

## O que ela faz

- Faz login diretamente com seu e-mail e senha do Eleven.
- Busca as tarefas e subtarefas de acordo com os filtros escolhidos.
- Monta um relatório agrupado (tarefa superior → subtarefas) em uma nova aba.
- Permite imprimir o relatório ou baixar os dados em uma planilha `.xlsx`.

Não é um site nem precisa de servidor: é um arquivo `.html` que roda direto no navegador. Nenhum dado é armazenado — tudo é buscado na hora, a cada geração de relatório.

## Como usar

1. **Abra o arquivo** `relatorio_tarefas.html` no navegador (duplo clique ou arraste para uma aba).
2. **Faça login** com seu e-mail e senha do Eleven.
3. Na tela de filtros, preencha o que precisar:
   - **Situações** *(obrigatório)* — marque pelo menos uma: Em andamento, Pendente ou Finalizada.
   - **Data de início / vencimento / finalização** *(opcionais)* — cada uma com campo "Mín" e "Máx". Se deixar em branco, o relatório traz tarefas de todos os períodos.
   - **Encarregados** e **Solicitantes** *(opcionais)* — busque por nome (só traz colaboradores).
   - **Convidados** *(opcional)* — busca por nome entre clientes/contatos e colaboradores.
4. Clique em **Gerar Relatório**. Uma barra de progresso mostra o andamento da busca.
5. O relatório abre automaticamente em **uma nova aba**. Nela é possível:
   - 🖨️ **Imprimir** — abre a caixa de impressão do navegador.
   - ⬇️ **Baixar arquivo** — gera e baixa uma planilha `.xlsx` com os mesmos dados.
6. Para trocar os filtros, volte à aba original e use o botão **← Voltar**.

## Ícone de informação (i)

Os botões com o ícone "i" abrem uma janela explicando, em linguagem simples, como preencher os filtros e o que esperar ao gerar o relatório.

## Requisitos

- Navegador atualizado (Chrome, Edge ou Firefox).
- Login válido no Eleven com permissão de acesso a tarefas.
- **Pop-ups liberados** para este arquivo/site — o relatório abre em uma nova aba, e o navegador pode bloquear isso por padrão na primeira vez.

## Problemas comuns

| Sintoma | Causa provável | Solução |
|---|---|---|
| "E-mail ou senha inválidos" | Credenciais erradas ou sem acesso à API | Confirme o login no próprio Eleven primeiro |
| Nada abre ao clicar em "Gerar Relatório" | Pop-up bloqueado pelo navegador | Libere pop-ups para o site (ícone na barra de endereço) e gere novamente |
| Relatório vazio | Filtros muito restritivos | Revise datas e situações selecionadas |
| Barra de rolagem estranha nos filtros | Tela muito estreita | Aumente a janela ou use no desktop para melhor visualização |

## Observações técnicas

- Os dados vêm diretamente da API do Eleven/Alkasoft (`app-api-prod` e `busca-avancada-api-prod`), usando o token gerado no login.
- A busca é paginada automaticamente (100 tarefas por vez) até trazer tudo que bate com os filtros.
- A exportação para Excel usa a biblioteca `xlsx-populate`, carregada via CDN — é necessário estar conectado à internet.
