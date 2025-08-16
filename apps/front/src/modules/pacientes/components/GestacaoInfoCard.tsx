import { DeleteOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Tag, Typography } from "antd";
const { Title } = Typography;

interface GestacaoInfoCardProps {
    numero: number;
    status: string;
    inicio: string;
    fim: string;
    isSelected?: boolean;
    onClick: () => void;
    onDelete: () => void;
}

const GestacaoInfoCard: React.FC<GestacaoInfoCardProps> = ({
    numero,
    status,
    inicio,
    fim,
    isSelected = false,
    onClick,
    onDelete,
}) => {
    const formatDate = (dateString: string): string => {
        if (!dateString) return "";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;

        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    };
    return (
        <div
            className={`p-5 border-[1px] flex flex-col w-full gap-2.5 rounded-[4px] transition-all duration-200 ${
                isSelected
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-neutral-400/20 hover:border-neutral-400/40 hover:shadow-sm"
            }`}
            onClick={onClick}
            style={{ cursor: "pointer" }}
        >
            <div className="flex w-full justify-between items-center">
                <Title
                    level={5}
                    style={{
                        textAlign: "center",
                        fontFamily: "Roboto",
                        fontSize: 16,
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: "24px",
                    }}
                    className="!m-0 text-black"
                >
                    {numero}ª Gestação
                </Title>

                <Popconfirm
                    title="Excluir gestação?"
                    okText="Sim"
                    cancelText="Não"
                    onConfirm={onDelete}
                >
                    <Button danger type="text" icon={<DeleteOutlined />} />
                </Popconfirm>
            </div>

            <div className=" w-full text-center">
                <Tag
                    className="!m-0"
                    color="green"
                    style={{ width: "100%", textAlign: "center" }}
                >
                    {status}
                </Tag>
            </div>

            <div className="flex w-full justify-between items-center">
                <Title
                    level={5}
                    className="!m-0"
                    style={{
                        textAlign: "center",
                        fontFamily: "Roboto",
                        fontSize: 12,
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: "20px",
                        color: "#D9D9D9",
                    }}
                >
                    Início: {formatDate(inicio)}
                </Title>

                <Title
                    level={5}
                    className="!m-0"
                    style={{
                        textAlign: "center",
                        fontFamily: "Roboto",
                        fontSize: 12,
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: "20px",
                        color: "#D9D9D9",
                    }}
                >
                    Fim: {formatDate(fim)}
                </Title>
            </div>
        </div>
    );
};

export default GestacaoInfoCard;
