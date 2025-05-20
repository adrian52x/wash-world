import { WashSessionsAPI } from "@/api/WashSessionsAPI";
import { InsertWash } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useWashSessions = () => {
    const { data: washSessions } = useQuery({
        queryKey: ['userWashSessions'],
        queryFn: () => WashSessionsAPI.getUserWashSessions(),
    });

    return { washSessions };
};

export const useCreateWashSession = () => {
    const queryClient = useQueryClient();

    const createWashSession = useMutation({
        mutationFn: (washSession: InsertWash) => WashSessionsAPI.createWashSession(washSession),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userWashSessions'] });
        },
    });

    return {
        createWashSession
    };
};
