import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import {
    mensagensService,
    type MensagensPaginatedResponse,
} from "../api/mensagensService";

export const useMensagens = (gestacaoId: string) => {
    const queryClient = useQueryClient();

    const query = useInfiniteQuery<MensagensPaginatedResponse>({
        queryKey: ["mensagens", gestacaoId],
        queryFn: ({ pageParam = 1 }) =>
            mensagensService.getByGestacao(gestacaoId, pageParam as number),
        enabled: !!gestacaoId,
        refetchInterval: 5000,
        getNextPageParam: (lastPage) => {
            const { currentPage, totalPages } = lastPage.meta;
            return currentPage < totalPages ? currentPage + 1 : undefined;
        },
        initialPageParam: 1,
    });

    const invalidateMensagens = () => {
        queryClient.invalidateQueries({
            queryKey: ["mensagens", gestacaoId],
        });
    };

    return {
        ...query,
        invalidateMensagens,
    };
};
