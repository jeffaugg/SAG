import { Chat } from "../../../../components";
import { useCurrentUser } from "../../../auth/hooks/authHooks";

interface ChatGestacaoProps {
    gestacaoId: string | null;
}

const ChatGestacao: React.FC<ChatGestacaoProps> = ({ gestacaoId }) => {
    const { data: user } = useCurrentUser();

    if (!gestacaoId || !user) {
        return (
            <div className="flex flex-col bg-white rounded-lg w-1/5 p-4">
                <p>Dados insuficientes para carregar o chat</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col bg-white rounded-lg w-1/5 max-h-full p-4 overflow-auto">
            <Chat gestacaoId={gestacaoId} currentUserId={user.id} />
        </div>
    );
};

export default ChatGestacao;
