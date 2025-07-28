import { DeleteOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Tag, Typography } from "antd";
const { Title } = Typography;

interface GestacaoInfoCardProps {
    numero: number;
    status: string;
    inicio: string;
    fim: string;
    onClick: () => void;
    onDelete: () => void;
}


const GestacaoInfoCard : React.FC<GestacaoInfoCardProps> = ({ numero, status, inicio, fim, onClick, onDelete }) => {

    return (
        <div className="p-5 border-[1px] border-neutral-400/20 flex flex-col w-full gap-2.5 rounded-[4px]"
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

            <Popconfirm title="Excluir gestação?" okText="Sim" cancelText="Não" onConfirm={onDelete}>
                <Button danger type="text" icon={<DeleteOutlined />} />
            </Popconfirm>

            </div>

           <div className=" w-full text-center">            
            
                <Tag className="!m-0" color="green" style={{ width: "100%", textAlign: "center" }}>{status}</Tag>
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
                    Início: {inicio} 
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
                    Fim: {fim}
                </Title>
           </div>
        </div>
    );

}

export default GestacaoInfoCard;