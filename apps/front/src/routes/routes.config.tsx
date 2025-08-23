
import {
    DashboardOutlined,
    HomeOutlined,
    MedicineBoxOutlined,
    SettingOutlined,
    TeamOutlined,
} from "@ant-design/icons";
import type { RouteDefinition } from "../contexts/NavigationContext";
import { ROLES } from "../utils/permission-utils";

const ALL_ROLES = [ROLES.ADMIN, ROLES.MEDICO, ROLES.ENFERMEIRO];
const CLINICAL_STAFF = [ROLES.MEDICO, ROLES.ENFERMEIRO];

export const routes: RouteDefinition[] = [
    // {
    //     path: "/",
    //     label: "Dashboard",
    //     icon: <DashboardOutlined />,
    // },
    // {
    //     path: "/gestacoes",
    //     label: "Gestações",
    //     icon: <MedicineBoxOutlined />,
    // },
    {
        path: "/pacientes",
        label: "Pacientes",
        icon: <TeamOutlined />,
    },
    {
        path: "/",
        label: "Administração",
        icon: <HomeOutlined />,
        requiredRoles: [ROLES.ADMIN],
        children: [
            {
                path: "/ubs",
                label: "Gerenciar UBS",
            },
            {
                path: "/policlinicas",
                label: "Gerenciar Policlínicas",
            },
            {
                path: "/usuarios",
                label: "Gerenciar Usuários",
            },
        ],
    },
    {
        path: "/configuracoes",
        label: "Configurações",
        icon: <SettingOutlined />,
        requiredRoles: [ROLES.ADMIN],
    },
];

export default routes;
