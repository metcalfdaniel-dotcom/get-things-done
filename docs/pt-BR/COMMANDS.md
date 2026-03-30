# Referência de Comandos do GTD

Este documento descreve os comandos principais do GTD em Português.  
Para detalhes completos de flags avançadas e mudanças recentes, consulte também a [versão em inglês](../COMMANDS.md).

---

## Fluxo Principal

| Comando | Finalidade | Quando usar |
|---------|------------|-------------|
| `/gtd-new-project` | Inicialização completa: perguntas, pesquisa, requisitos e roadmap | Início de projeto |
| `/gtd-discuss-phase [N]` | Captura decisões de implementação | Antes do planejamento |
| `/gtd-ui-phase [N]` | Gera contrato de UI (`UI-SPEC.md`) | Fases com frontend |
| `/gtd-plan-phase [N]` | Pesquisa + planejamento + verificação | Antes de executar uma fase |
| `/gtd-execute-phase <N>` | Executa planos em ondas paralelas | Após planejamento aprovado |
| `/gtd-verify-work [N]` | UAT manual com diagnóstico automático | Após execução |
| `/gtd-ship [N]` | Cria PR da fase validada | Ao concluir a fase |
| `/gtd-next` | Detecta e executa o próximo passo lógico | Qualquer momento |
| `/gtd-fast <texto>` | Tarefa curta sem planejamento completo | Ajustes triviais |

## Navegação e Sessão

| Comando | Finalidade |
|---------|------------|
| `/gtd-progress` | Mostra status atual e próximos passos |
| `/gtd-resume-work` | Retoma contexto da sessão anterior |
| `/gtd-pause-work` | Salva handoff estruturado |
| `/gtd-session-report` | Gera resumo da sessão |
| `/gtd-help` | Lista comandos e uso |
| `/gtd-update` | Atualiza o GTD |

## Gestão de Fases

| Comando | Finalidade |
|---------|------------|
| `/gtd-add-phase` | Adiciona fase no roadmap |
| `/gtd-insert-phase [N]` | Insere trabalho urgente entre fases |
| `/gtd-remove-phase [N]` | Remove fase futura e reenumera |
| `/gtd-list-phase-assumptions [N]` | Mostra abordagem assumida pelo Claude |
| `/gtd-plan-milestone-gaps` | Cria fases para fechar lacunas de auditoria |

## Brownfield e Utilidades

| Comando | Finalidade |
|---------|------------|
| `/gtd-map-codebase` | Mapeia base existente antes de novo projeto |
| `/gtd-quick` | Tarefas ad-hoc com garantias do GTD |
| `/gtd-debug [desc]` | Debug sistemático com estado persistente |
| `/gtd-forensics` | Diagnóstico de falhas no workflow |
| `/gtd-settings` | Configuração de agentes, perfil e toggles |
| `/gtd-set-profile <perfil>` | Troca rápida de perfil de modelo |

## Qualidade de Código

| Comando | Finalidade |
|---------|------------|
| `/gtd-review` | Peer review com múltiplas IAs |
| `/gtd-pr-branch` | Cria branch limpa sem commits de planejamento |
| `/gtd-audit-uat` | Audita dívida de validação/UAT |

## Backlog e Threads

| Comando | Finalidade |
|---------|------------|
| `/gtd-add-backlog <desc>` | Adiciona item no backlog (999.x) |
| `/gtd-review-backlog` | Promove, mantém ou remove itens |
| `/gtd-plant-seed <ideia>` | Registra ideia com gatilho futuro |
| `/gtd-thread [nome]` | Gerencia threads persistentes |

---

## Exemplo rápido

```bash
/gtd-new-project
/gtd-discuss-phase 1
/gtd-plan-phase 1
/gtd-execute-phase 1
/gtd-verify-work 1
/gtd-ship 1
```
