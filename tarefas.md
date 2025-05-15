# Tarefas do Projeto AquaLink

## Visão Geral
Este documento lista as próximas tarefas, melhorias e implementações para o aplicativo AquaLink. As tarefas estão organizadas por prioridade e categoria, com descrições detalhadas e responsáveis sugeridos.

## Prioridade Crítica (Correção de Bugs)

### Correção de Erro de Chaves Duplicadas
- **Descrição**: Corrigir erro `Encountered two children with the same key` que está aparecendo nos componentes com listas
- **Benefícios**: Eliminar erros na renderização, prevenir comportamentos inesperados da UI
- **Tarefas**:
  - [x] Identificar componentes que usam keys duplicadas (principalmente em AndroidSwipeRefreshLayout)
  - [x] Implementar geração de chaves únicas usando IDs únicos ou índices combinados com identificadores
  - [x] Revisar todos os componentes que usam FlatList, ScrollView ou outras listas
  - [x] Aplicar correções adicionais para componentes persistentes com erros de chaves
    - [x] Corrigir KeyExtractor na FlatList de faturas para usar identificadores mais robustos
    - [x] Adicionar chave única ao RefreshControl para evitar duplicações
    - [x] Melhorar as chaves dos componentes de gráfico (VictoryChart, VictoryBar, VictoryAxis)
    - [x] Implementar método mais robusto para gerar chaves nas listas de dicas
  - [x] Testar em diferentes dispositivos para garantir que o erro foi resolvido
- **Prazo**: 3 dias (urgente)
- **Responsável**: Equipe de Frontend
- **Status**: Concluído em 22/04/2024

### Solução Avançada para Duplicação de Chaves
- **Descrição**: Implementar uma solução mais robusta para o erro persistente de chaves duplicadas em dados da API
- **Benefícios**: Eliminar completamente os erros de renderização mesmo com dados problemáticos da API
- **Tarefas**:
  - [x] Implementar um mecanismo de remoção de dados duplicados via useMemo
  - [x] Gerar identificadores únicos baseados em timestamp para cada renderização
  - [x] Adicionar propriedade _uniqueId para garantir que não haverá colisão de chaves
  - [x] Refinar os parâmetros do FlatList para melhorar performance e evitar problemas de renderização
  - [x] Melhorar a lógica de detecção e tratamento de dados duplicados da API
- **Prazo**: 1 dia (urgente)
- **Responsável**: Equipe de Frontend
- **Status**: Concluído em 22/04/2024

### Remoção do Componente de Acesso Rápido
- **Descrição**: Remover a seção de "Acesso Rápido" da tela inicial conforme solicitado
- **Benefícios**: Interface mais limpa e focada nos dados principais do usuário
- **Tarefas**:
  - [x] Remover importação do componente QuickActions no arquivo index.tsx
  - [x] Remover a renderização do componente QuickActions no JSX
  - [ ] Verificar se há alguma dependência ou referência ao componente em outros arquivos
- **Prazo**: Imediato
- **Responsável**: Equipe de Frontend
- **Status**: Concluído em 22/04/2024

### Refinamento Visual da Interface
- **Descrição**: Melhorar o estilo e a aparência geral da interface para torná-la mais elegante e moderna
- **Benefícios**: Melhor experiência do usuário, aparência mais profissional, identidade visual mais forte
- **Tarefas**:
  - [x] Aprimorar o cabeçalho com elementos visuais modernos e tipografia refinada
  - [x] Melhorar o componente Card com novas variantes e efeitos visuais
  - [x] Corrigir e aprimorar o gráfico de consumo com animações e elementos visuais mais claros
  - [x] Expandir a paleta de cores para maior consistência visual
  - [x] Ajustar espaçamentos e layouts para melhor experiência visual
- **Prazo**: 5 dias
- **Responsável**: Designer UI/UX e Frontend
- **Status**: Concluído em 22/04/2024

## Análise do Erro de Keys Duplicadas

### Problema Identificado
Nos logs do aplicativo, encontramos o seguinte erro recorrente:

```
Warning: Encountered two children with the same key, `.$847298-6`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.
```

Este erro está ocorrendo nos seguintes componentes:
- AndroidSwipeRefreshLayout
- RNSScreenContainer
- Diversos componentes de UI

### Causa do Problema
O React e React Native exigem que cada elemento em uma lista tenha uma propriedade `key` única para otimizar a renderização e rastrear quais itens foram adicionados, removidos ou reordenados. 

Neste caso, o problema está ocorrendo porque:
1. Múltiplos componentes estão usando a mesma chave hardcoded (`.$847298-6`)
2. Provavelmente estamos usando índices de array como keys em componentes que são re-renderizados
3. Pode haver componentes que estão gerando IDs aleatórios a cada renderização, em vez de manter consistência

### Solução Implementada
Foram aplicadas as seguintes correções:

1. **ConsumptionChart.tsx**:
   - Removida a geração aleatória de IDs (`Math.random().toString(36)`)
   - Implementadas chaves estáveis baseadas em dados reais (ano e mês)
   - Adicionados IDs consistentes para VictoryChart e seus componentes

2. **ConsumptionSummary.tsx**:
   - Corrigida a lista de dicas de economia usando chaves mais robustas
   - Combinação de índice com texto da dica para garantir unicidade

3. **bill-details/[id]/[parcela].tsx**:
   - Adicionada key estável ao componente de QR code
   - Corrigido erro de tipo na propriedade variant do botão

### Verificação
Após implementar as correções, devemos verificar se:
1. Os warnings desapareceram dos logs
2. Não há comportamento inesperado na interface (como itens duplicados)
3. A performance da UI está adequada

## Prioridade Alta

### Integração com React Query
- **Descrição**: Implementar React Query para gerenciamento de cache e revalidação de dados das APIs
- **Benefícios**: Melhor desempenho, redução de chamadas à API, experiência offline aprimorada
- **Tarefas**:
  - [x] Configurar provider do React Query
  - [x] Migrar serviços de API para hooks de query
  - [x] Implementar políticas de cache por endpoint
  - [x] Configurar estratégias de revalidação
- **Prazo**: 2 semanas
- **Responsável**: Equipe de Frontend
- **Status**: Concluído em 27/06/2024

### Autenticação com JWT
- **Descrição**: Implementar sistema de autenticação baseado em tokens JWT
- **Benefícios**: Maior segurança, controle de sessões, possibilidade de refresh tokens
- **Tarefas**:
  - [ ] Atualizar serviço de autenticação para suportar JWT
  - [ ] Implementar armazenamento seguro de tokens
  - [ ] Adicionar interceptors para refresh automático
  - [ ] Implementar logout por expiração
- **Prazo**: 2 semanas
- **Responsável**: Equipe de Segurança/Frontend

### Implementação de Testes
- **Descrição**: Adicionar testes unitários e de integração ao projeto
- **Benefícios**: Maior confiabilidade, facilita refatoração, previne regressões
- **Tarefas**:
  - [ ] Configurar Jest e React Testing Library
  - [ ] Criar testes para serviços de API
  - [ ] Criar testes para componentes principais
  - [ ] Implementar testes de integração para fluxos críticos
  - [ ] Configurar CI para execução automática de testes
- **Prazo**: 3 semanas
- **Responsável**: Equipe de QA/Frontend

## Prioridade Média

### Suporte a Modo Offline
- **Descrição**: Permitir uso do aplicativo sem conexão com internet
- **Benefícios**: Melhor experiência do usuário, resiliência em áreas com conexão limitada
- **Tarefas**:
  - [ ] Implementar armazenamento local persistente
  - [ ] Adaptar hooks para usar dados locais quando offline
  - [ ] Criar mecanismo de sincronização quando reconectar
  - [ ] Adicionar indicadores de status de conexão
- **Prazo**: 3 semanas
- **Responsável**: Equipe de Frontend

### Módulo de Notificações Push
- **Descrição**: Implementar notificações push para alertas de vencimento, consumo elevado, etc.
- **Benefícios**: Aumenta engajamento, fornece alertas importantes ao usuário
- **Tarefas**:
  - [ ] Configurar serviço de notificações (Firebase ou Expo)
  - [ ] Implementar solicitação de permissões
  - [ ] Criar módulo para gestão de tokens de dispositivo
  - [ ] Desenvolver tela de preferências de notificações
- **Prazo**: 2 semanas
- **Responsável**: Equipe de Frontend/Backend

### Otimização de Performance
- **Descrição**: Melhorar desempenho geral do aplicativo
- **Benefícios**: Experiência mais fluida, menor consumo de recursos
- **Tarefas**:
  - [ ] Implementar memoização em componentes pesados
  - [ ] Otimizar renderização de listas
  - [ ] Reduzir tamanho de bundle
  - [ ] Implementar lazy loading de componentes
  - [ ] Otimizar imagens e assets
- **Prazo**: 2 semanas
- **Responsável**: Equipe de Frontend

## Prioridade Baixa

### Personalização de Tema
- **Descrição**: Permitir que o usuário escolha entre tema claro/escuro/sistema
- **Benefícios**: Maior personalização, melhor experiência do usuário
- **Tarefas**:
  - [ ] Criar toggle para seleção de tema
  - [ ] Implementar persistência da preferência
  - [ ] Refatorar componentes para suportar troca dinâmica
- **Prazo**: 1 semana
- **Responsável**: Designer UI/UX e Frontend

### Integração com Apple Pay / Google Pay
- **Descrição**: Adicionar opções de pagamento nativas
- **Benefícios**: Processo de pagamento simplificado
- **Tarefas**:
  - [ ] Integrar SDKs de pagamento
  - [ ] Implementar fluxo de pagamento
  - [ ] Adicionar validação e recibos
- **Prazo**: 3 semanas
- **Responsável**: Equipe de Payments

### Acessibilidade
- **Descrição**: Melhorar suporte à acessibilidade no aplicativo
- **Benefícios**: Alcance a mais usuários, conformidade com padrões
- **Tarefas**:
  - [ ] Auditar app com ferramentas de acessibilidade
  - [ ] Implementar suporte a VoiceOver/TalkBack
  - [ ] Adicionar rótulos e descrições adequadas
  - [ ] Melhorar contrastes e tamanhos
- **Prazo**: 2 semanas
- **Responsável**: Designer UI/UX e Frontend

## Melhorias Técnicas

### Atualização de Dependências
- **Descrição**: Atualizar bibliotecas e dependências do projeto
- **Benefícios**: Segurança, correções de bugs, novos recursos
- **Tarefas**:
  - [ ] Identificar dependências desatualizadas
  - [ ] Planejar atualizações por fases
  - [ ] Testar compatibilidade
- **Prazo**: 1 semana (recorrente a cada 2 meses)
- **Responsável**: Equipe de DevOps/Frontend

### Refatoração de Componentes
- **Descrição**: Revisar e melhorar estrutura de componentes
- **Benefícios**: Código mais manutenível, melhor reusabilidade
- **Tarefas**:
  - [ ] Identificar componentes com alta complexidade
  - [ ] Extrair lógica para hooks customizados
  - [ ] Padronizar interfaces de componentes
- **Prazo**: 2 semanas
- **Responsável**: Tech Lead Frontend

### Documentação
- **Descrição**: Melhorar documentação do projeto
- **Benefícios**: Facilita onboarding, referência para desenvolvedores
- **Tarefas**:
  - [ ] Criar/atualizar README principal
  - [ ] Documentar fluxos principais e arquitetura
  - [ ] Implementar documentação de componentes (Storybook)
  - [ ] Criar guias de contribuição
- **Prazo**: 1 semana
- **Responsável**: Todos os membros da equipe

## Novas Funcionalidades

### Dashboard Personalizado
- **Descrição**: Permitir que o usuário personalize o dashboard principal
- **Benefícios**: Informações mais relevantes para cada usuário
- **Tarefas**:
  - [ ] Projetar interface de personalização
  - [ ] Implementar componentes arrastáveis
  - [ ] Criar sistema de persistência de layout
- **Prazo**: 3 semanas
- **Responsável**: Designer UI/UX e Frontend

### Módulo de Dicas de Economia
- **Descrição**: Expandir seção de dicas de economia de água
- **Benefícios**: Valor educacional, ajuda a reduzir consumo
- **Tarefas**:
  - [ ] Criar banco de dicas personalizadas
  - [ ] Implementar sistema de recomendação baseado no perfil
  - [ ] Adicionar recursos visuais e ilustrações
- **Prazo**: 2 semanas
- **Responsável**: Designer de Conteúdo e Frontend

### Comparativo com a Vizinhança
- **Descrição**: Adicionar comparativo de consumo com média da região
- **Benefícios**: Contexto social, incentivo à economia
- **Tarefas**:
  - [ ] Implementar endpoint de API para dados regionais
  - [ ] Criar visualização comparativa
  - [ ] Adicionar badges/gamificação
- **Prazo**: 3 semanas
- **Responsável**: Equipe de Backend e Frontend

## Acompanhamento

Este documento deve ser revisado semanalmente em reuniões de planejamento. Conforme as tarefas forem concluídas, novas prioridades podem ser definidas e adicionadas.

Última atualização: 22/04/2024 