import {
    DownloadOutlined,
    FileOutlined,
    PaperClipOutlined,
    SendOutlined,
} from "@ant-design/icons";
import { Button, Image, Input, Space, Typography, message } from "antd";
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
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {
        isConnected,
        joinGestacao,
        sendMessage,
        sendMessageWithFile,
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

    const handleSendMessage = async () => {
        if ((messageText.trim() || selectedFile) && isConnected) {
            if (selectedFile && messageText.trim()) {
                await sendMessageWithFile(
                    gestacaoId,
                    messageText,
                    selectedFile,
                );
            } else if (selectedFile) {
                await sendMessageWithFile(gestacaoId, "", selectedFile);
            } else {
                sendMessage(gestacaoId, messageText);
            }
            setMessageText("");
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            invalidateMensagens();
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const isImage = file.type.startsWith("image/");
            const isPdf = file.type === "application/pdf";

            if (isImage || isPdf) {
                if (file.size <= 5 * 1024 * 1024) {
                    setSelectedFile(file);
                } else {
                    message.error("Arquivo muito grande. Máximo 5MB.");
                }
            } else {
                message.error("Apenas imagens e arquivos PDF são permitidos.");
            }
        }
    };

    const handleAttachClick = () => {
        fileInputRef.current?.click();
    };

    const handleDownloadFile = async (fileUrl: string, fileName?: string) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_END_POINT}/mensagens/file/${fileUrl}`,
            );
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = fileName || fileUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            message.error("Erro ao baixar o arquivo");
        }
    };

    const handleKeyPress = async (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            await handleSendMessage();
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
                                {mensagem.conteudo.imagemUrl && (
                                    <div className="mb-2 relative group">
                                        <Image
                                            src={`${import.meta.env.VITE_API_END_POINT}/mensagens/file/${mensagem.conteudo.imagemUrl}`}
                                            alt="Imagem enviada"
                                            className="max-w-full max-h-48 rounded"
                                            style={{ maxWidth: "200px" }}
                                            preview={{
                                                toolbarRender: () => (
                                                    <Button
                                                        type="primary"
                                                        icon={
                                                            <DownloadOutlined />
                                                        }
                                                        onClick={() =>
                                                            handleDownloadFile(
                                                                mensagem
                                                                    .conteudo
                                                                    .imagemUrl!,
                                                                `imagem.png`,
                                                            )
                                                        }
                                                    >
                                                        Baixar
                                                    </Button>
                                                ),
                                            }}
                                        />
                                    </div>
                                )}
                                {mensagem.conteudo.arquivoUrl && (
                                    <div className="mb-2">
                                        <Button
                                            variant="link"
                                            color={
                                                mensagem.remetente ===
                                                currentUserId
                                                    ? "default"
                                                    : "primary"
                                            }
                                            icon={<FileOutlined />}
                                            onClick={() =>
                                                handleDownloadFile(
                                                    mensagem.conteudo
                                                        .arquivoUrl!,
                                                    `arquivo.pdf`,
                                                )
                                            }
                                        >
                                            📄 Arquivo PDF
                                        </Button>
                                    </div>
                                )}
                                {mensagem.conteudo.texto && (
                                    <Text
                                        className={
                                            mensagem.remetente === currentUserId
                                                ? "text-white"
                                                : ""
                                        }
                                    >
                                        {mensagem.conteudo.texto}
                                    </Text>
                                )}
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
                {selectedFile && (
                    <div className="mb-2 p-2 bg-gray-50 rounded flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                            📎 {selectedFile.name}
                        </span>
                        <Button
                            size="small"
                            type="text"
                            onClick={() => setSelectedFile(null)}
                        >
                            ✕
                        </Button>
                    </div>
                )}
                <Space.Compact className="w-full">
                    <Button
                        icon={<PaperClipOutlined />}
                        onClick={handleAttachClick}
                        disabled={!isConnected}
                    />
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
                        disabled={
                            !isConnected ||
                            (!messageText.trim() && !selectedFile)
                        }
                    />
                </Space.Compact>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileSelect}
                    style={{ display: "none" }}
                />
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
