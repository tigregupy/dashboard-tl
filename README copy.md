# Jira dashboard gadget de indicadores de entregas e bugs para os times da Gupy

Este projeto é um app Forge escrito em JavaScript, para documentação e tutoriais acesse [developer.atlassian.com/platform/forge](https://developer.atlassian.com/platform/forge).

Toda sua estrutura se baseia nas definições de apps com Custom UI, para saber mais sobre acesse [developer.atlassian.com/platform/forge/custom-ui](https://developer.atlassian.com/platform/forge/custom-ui/).

Sua interface foi construída utilizando componentes do design system da Atlassian [atlassian.design/components](https://atlassian.design/components)

## Requisitos
Acesse [Set up Forge](https://developer.atlassian.com/platform/forge/set-up-forge/) para instruções de como configurá-lo.

## Quick start
- Instale as dependências:
```
npm run install-all
```

- Modifique o app editando o arquivo `src/index.js` ou os arquivos em `static/src`

- Rode os testes:
```
npm test
```

- Faça o build dos estáticos:
```
npm run build-app
```

- Faça o build do app:
```
forge deploy
```

- Instale o app no Jira:
```
forge install
```

- Para desenvolver localmente visualizando as modificações diretamente no Jira rode em sequência:
```
1. npm run build-app
2. forge deploy
3. npm run start-app
4. forge tunnel
```
Após isso toda modificação feita no app ou nos estáticos atualizarão automaticamente enquanto o tunnel estiver ativo.

- Para publicar uma versão em produção:
```
forge deploy -e production
forge install --upgrade -e production
```

## Notas
- Use o comando `forge deploy` quando você deseja persistir as mudanças de código.
- Use o comando `forge install` quando você quer instalar seu app em um novo site.
- Quando o app está instalado em um site, o site pegará as novas modificações do app após o deploy sem ser necessário rodar o comando de install novamente.

## Filtros aplicados nas colunas
- Epics done: `project = '${project}' AND type = 'Epic' AND (status = 'Done' OR status = 'Concluido' OR status = 'Concluído') AND resolved >= '${startDate}' AND resolved < '${endDate}'`

- Issues done: `project = '${project}' AND type != 'Epic' AND type not in subTaskIssueTypes() AND (status = 'Done' OR status = 'Concluido' OR status = 'Concluído') AND resolved >= '${startDate}' AND resolved < '${endDate}'`

- Tasks & Stories done: `project = '${project}' AND (type = 'Tarefa' OR type = 'Task' OR type = 'Story' OR type = 'Story - Feature' OR type = 'Story - Improvement' OR type = 'Story - Maintenance') AND (status = 'Done' OR status = 'Concluido' OR status = 'Concluído') AND resolved >= '${startDate}' AND resolved < '${endDate}'`

- Stories done: `project = '${project}' AND (type = 'Story' OR type = 'Story - Feature' OR type = 'Story - Improvement' OR type = 'Story - Maintenance') AND (status = 'Done' OR status = 'Concluido' OR status = 'Concluído') AND resolved >= '${startDate}' AND resolved < '${endDate}'`

- Issues done alinhadas com a estratégia: `project = '${project}' AND parentEpic in (${epicKey}) AND type != 'Epic' AND type != 'Issue' AND type != 'Bug' AND type not in subTaskIssueTypes() AND status != 'Cancelado' AND status != 'Cancelled' AND resolved >= '${startDate}' AND resolved < '${endDate}'`

- Issues done NÃO alinhadas com a estratégia: `project = '{project}' AND (parentEpic in (${epicKey}) OR type = 'Issue' OR type = 'Bug' OR 'Epic Link' is EMPTY) AND type != 'Epic' AND type not in subTaskIssueTypes() AND status != 'Cancelado' AND status != 'Cancelled' AND resolved >= '${startDate}' AND resolved < '${endDate}'`

- Alinhamento estratégico: `totalStrategicTasksDone / totalTasksDone`

- Sub-tasks done: `project = '${project}' AND type in subTaskIssueTypes() AND (status = 'Done' OR status = 'Concluido' OR status = 'Concluído') AND resolved >= '${startDate}' AND resolved < '${endDate}'`

- Bugs resolvidos: `project = '${project}' AND (type = 'Bug' OR type = 'Issue') AND (status = 'Done' OR status = 'Concluido' OR status = 'Concluído') AND resolved >= '${startDate}' AND resolved < '${endDate}'`

- Bugs criados: `project = '${project}' AND (type = 'Bug' OR type = 'Issue') AND created >= '${startDate}' AND created < '${endDate}' AND status != 'Cancelado' AND status != 'Cancelled'`

- Bugs criados NI: `project = '${project}' AND (type = 'Bug' OR type = 'Issue') AND created >= '${endDate}' AND created < '${startDate}' AND 'Bug Origin[Dropdown]' = 'New Implementation' AND status != 'Cancelado' AND status != 'Cancelled'`

- Bugs criados LS: `project = '${project}' AND (type = 'Bug' OR type = 'Issue') AND created >= '${endDate}' AND created < '${startDate}' AND 'Bug Origin[Dropdown]' = 'Legacy Structure' AND status != 'Cancelado' AND status != 'Cancelled'`

- Bugs criados SF: `project = '${project}' AND (type = 'Bug' OR type = 'Issue') AND created >= '${endDate}' AND created < '${startDate}' AND 'Bug Origin[Dropdown]' = 'Stable Feature' AND status != 'Cancelado' AND status != 'Cancelled'`

- Incidentes (P0): `project = '${project}' AND (type = 'Bug' OR type = 'Issue') AND 'Criticidade [Radio Buttons]' = 'P0' AND created >= '${startDate}' AND created < '${endDate}' AND status != 'Cancelado' AND status != 'Cancelled'`

- Taxa de bugs: `(totalBugsCreated / totalTasksDone) * 1000`

- Taxa de bugs NI: `(totalBugsNICreated / totalTasksStoriesDone) * 100`

- Média bugs criados/mês: `totalBugsCreated / ${month}`

## Exemplo Gadget
<img width="1416" alt="image" src="https://github.com/gupy-io/jira-dashboard-gadget-bu-rs-issues-analysis/assets/2110047/2e243a26-7fca-4e66-a3e7-65cb8806233b">

<img width="1421" alt="image" src="https://github.com/gupy-io/jira-dashboard-gadget-bu-rs-issues-analysis/assets/2110047/50726e58-5388-4010-9160-518dff3b4b67">

```
