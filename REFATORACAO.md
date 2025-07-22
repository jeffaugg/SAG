# Refatoração da Lógica de Busca

## Resumo das Mudanças

Foi criado um hook genérico `useSearchForm` que centraliza a lógica comum de busca e formulários para todos os módulos (Policlínicas, Usuários e UBS).

### Arquivos Modificados

1. **Novo hook genérico**: `/hooks/useSearchForm.ts`
   - Centraliza estado de modal, paginação, busca
   - Reutilizável para qualquer entidade com `id`

2. **Hooks refatorados**:
   - `/modules/policlinicas/hooks/usePoliclinicaForm.ts`
   - `/modules/usuarios/hooks/useUsuarioForm.ts`
   - `/modules/ubs/hooks/useUBSForm.ts`

3. **Types simplificados**:
   - Removido interfaces de paginação duplicadas
   - Mantido apenas tipos específicos de cada módulo

4. **Utilitários de busca**: `/utils/formatters.ts`
   - `normalizeSearchText()` - normaliza texto de busca
   - `createSearchFilter()` - filtro genérico para arrays

### Benefícios

- **DRY**: Elimina duplicação de código
- **Consistência**: Comportamento uniforme entre módulos
- **Manutenibilidade**: Mudanças centralizadas
- **Reutilização**: Fácil expansão para novos módulos
