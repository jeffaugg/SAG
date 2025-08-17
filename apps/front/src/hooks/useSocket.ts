import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = () => {
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        const socket = io(import.meta.env.VITE_API_END_POINT, {
            auth: {
                token: `Bearer ${token}`,
            },
        });

        socket.on("connect", () => {
            setIsConnected(true);
        });

        socket.on("disconnect", () => {
            setIsConnected(false);
        });

        socketRef.current = socket;

        return () => {
            socket.disconnect();
        };
    }, []);

    const joinGestacao = (gestacaoId: string) => {
        if (socketRef.current) {
            socketRef.current.emit("join-gestacao", gestacaoId);
        }
    };

    const sendMessage = (gestacaoId: string, conteudo: string) => {
        if (socketRef.current) {
            socketRef.current.emit("send-message", { gestacaoId, conteudo });
        }
    };

    const sendMessageWithFile = async (
        gestacaoId: string,
        conteudo: string,
        file: File,
    ) => {
        const formData = new FormData();
        formData.append("gestacao", gestacaoId);
        formData.append("tipo", "MIDIA");
        formData.append("texto", conteudo);
        formData.append("file", file);

        const token = localStorage.getItem("access_token");

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_END_POINT}/mensagens/with-file`,
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (response.ok) {
                const mensagem = await response.json();
                if (socketRef.current) {
                    socketRef.current.emit("message-sent", {
                        gestacaoId,
                        mensagem,
                    });
                }
                return mensagem;
            }
        } catch (error) {
            console.error("Erro ao enviar mensagem com arquivo:", error);
        }
    };

    const onReceiveMessage = (callback: (mensagem: any) => void) => {
        if (socketRef.current) {
            socketRef.current.on("receive-message", callback);
        }
    };

    const offReceiveMessage = () => {
        if (socketRef.current) {
            socketRef.current.off("receive-message");
        }
    };

    return {
        isConnected,
        joinGestacao,
        sendMessage,
        sendMessageWithFile,
        onReceiveMessage,
        offReceiveMessage,
    };
};
