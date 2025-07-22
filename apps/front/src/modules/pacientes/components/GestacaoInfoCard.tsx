import { Typography } from "antd";
import { Tag } from "antd";
const { Title } = Typography;

const GestacaoInfoCard : React.FC = () => {

    return (
        <div className="p-5 border-[1px] border-neutral-400/20 flex flex-col w-full gap-2.5 rounded-[4px]">
           <div className="flex w-full justify-between">
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
                3ª Gestação
            </Title>

            <Tag className="!m-0" color="green">Em andamento</Tag>
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
                    Início: 05/2024 
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
                    Fim: 05/2024 
                </Title>
           </div>
        </div>
    );

}

export default GestacaoInfoCard;