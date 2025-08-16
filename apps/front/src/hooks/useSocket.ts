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
        onReceiveMessage,
        offReceiveMessage,
    };
};
