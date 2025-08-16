import { SendOutlined } from "@ant-design/icons";
import { Button, Input, Space, Typography } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import type { Mensagem } from "../api/mensagensService";
import { useMensagens } from "../hooks/useMensagens";
import { useSocket } from "../hooks/useSocket";
import { LoadingSpinner } from "./index";

const { Text } = Typography;

interface ChatProps {
    gestacaoId: string;
    currentUserId: string;
}

const Chat: React.FC<ChatProps> = ({ gestacaoId, currentUserId }) => {
    const [messageText, setMessageText] = useState("");
    const [chatMessages, setChatMessages] = useState<Mensagem[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const {
        isConnected,
        joinGestacao,
        sendMessage,
        onReceiveMessage,
        offReceiveMessage,
    } = useSocket();
    const {
        data: messagesData,
        isLoading,
        invalidateMensagens,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useMensagens(gestacaoId);

    useEffect(() => {
        if (messagesData?.pages) {
            const allMessages = messagesData.pages
                .flatMap((page) => page.data || [])
                .sort(
                    (a, b) =>
                        new Date(a.createdAt).getTime() -
                        new Date(b.createdAt).getTime(),
                );
            setChatMessages(allMessages);
        }
    }, [messagesData]);

    useEffect(() => {
        if (isConnected && gestacaoId) {
            joinGestacao(gestacaoId);
        }
    }, [isConnected, gestacaoId, joinGestacao]);

    useEffect(() => {
        onReceiveMessage((mensagem: Mensagem) => {
            setChatMessages((prev) => {
                const exists = prev.some((msg) => msg._id === mensagem._id);
                if (!exists) {
                    invalidateMensagens();
                    return [...prev, mensagem];
                }
                return prev;
            });
        });

        return () => {
            offReceiveMessage();
        };
    }, [onReceiveMessage, offReceiveMessage, invalidateMensagens]);

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    const handleScroll = useCallback(
        (e: React.UIEvent<HTMLDivElement>) => {
            const { scrollTop } = e.currentTarget;
            if (scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        },
        [hasNextPage, isFetchingNextPage, fetchNextPage],
    );

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({
                behavior: "auto",
                block: "end",
            });
        }
    };

    const handleSendMessage = () => {
        if (messageText.trim() && isConnected) {
            sendMessage(gestacaoId, messageText);
            setMessageText("");
            invalidateMensagens();
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="flex flex-col h-full">
            <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto max-h-11/12"
                onScroll={handleScroll}
            >
                {isFetchingNextPage && (
                    <div className="text-center py-2">
                        <LoadingSpinner />
                    </div>
                )}
                {(chatMessages || []).map((mensagem) => (
                    <div
                        key={mensagem._id}
                        className={`mb-4 flex ${mensagem.remetente === currentUserId ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-xs ${mensagem.remetente === currentUserId ? "ml-auto" : "mr-auto"}`}
                        >
                            {mensagem.remetente !== currentUserId &&
                                mensagem.remetenteNome && (
                                    <Text className="text-xs font-medium text-gray-600 mb-1">
                                        {mensagem.remetenteNome}
                                    </Text>
                                )}
                            <div
                                className={`p-3 rounded-lg ${mensagem.remetente === currentUserId ? "bg-blue-500 text-white" : "bg-gray-100"}`}
                            >
                                <Text
                                    className={
                                        mensagem.remetente === currentUserId
                                            ? "text-white"
                                            : ""
                                    }
                                >
                                    {mensagem.conteudo.texto}
                                </Text>
                            </div>
                            <Text type="secondary" className="text-xs">
                                {new Date(
                                    mensagem.createdAt,
                                ).toLocaleTimeString()}
                            </Text>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="border-t p-4">
                <Space.Compact className="w-full">
                    <Input
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Digite sua mensagem..."
                        disabled={!isConnected}
                    />
                    <Button
                        type="primary"
                        icon={<SendOutlined />}
                        onClick={handleSendMessage}
                        disabled={!isConnected || !messageText.trim()}
                    />
                </Space.Compact>
                {!isConnected && (
                    <Text type="secondary" className="text-xs">
                        Conectando ao chat...
                    </Text>
                )}
            </div>
        </div>
    );
};

export default Chat;
