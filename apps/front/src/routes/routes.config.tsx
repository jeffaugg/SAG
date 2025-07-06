import {
    AppstoreOutlined,
    DashboardOutlined,
    HomeOutlined,
    MedicineBoxOutlined,
    SettingOutlined,
    TeamOutlined,
    UserOutlined,
} from "@ant-design/icons";
import type { RouteDefinition } from "../contexts/NavigationContext";
import { ROLES } from "../utils/permission-utils";

const ALL_ROLES = [ROLES.ADMIN, ROLES.MEDICO, ROLES.ENFERMEIRO];
const CLINICAL_STAFF = [ROLES.MEDICO, ROLES.ENFERMEIRO];

export const routes: RouteDefinition[] = [
    {
        path: "/",
        label: "Dashboard",
        icon: <DashboardOutlined />,
    },
    {
        path: "/gestacoes",
        label: "Gestações",
        icon: <MedicineBoxOutlined />,
        children: [
            {
                path: "/gestacoes",
                label: "Todas Gestações",
                requiredRoles: ALL_ROLES,
            },
            {
                path: "/gestacoes/cadastrar",
                label: "Cadastrar Gestação",
                requiredRoles: CLINICAL_STAFF,
            },
            {
                path: "/gestacoes/:id",
                label: "Detalhes da Gestação",
                requiredRoles: ALL_ROLES,
                isVisible: false,
            },
        ],
    },
    {
        path: "/pacientes",
        label: "Pacientes",
        icon: <TeamOutlined />,
        children: [
            {
                path: "/pacientes",
                label: "Todos Pacientes",
                requiredRoles: ALL_ROLES,
            },
            {
                path: "/pacientes/cadastrar",
                label: "Cadastrar Paciente",
                requiredRoles: [ROLES.ENFERMEIRO, ROLES.ADMIN],
            },
            {
                path: "/pacientes/:id",
                label: "Detalhes do Paciente",
                requiredRoles: ALL_ROLES,
                isVisible: false,
            },
        ],
    },
    {
        path: "/ubs",
        label: "Unidades Básicas",
        icon: <HomeOutlined />,
        requiredRoles: [ROLES.ADMIN],
        children: [
            {
                path: "/ubs",
                label: "Todas UBSs",
            },
            {
                path: "/ubs/cadastrar",
                label: "Cadastrar UBS",
            },
            {
                path: "/ubs/:id",
                label: "Detalhes da UBS",
                isVisible: false,
            },
        ],
    },
    {
        path: "/policlinicas",
        label: "Policlínicas",
        icon: <AppstoreOutlined />,
        requiredRoles: [ROLES.ADMIN],
        children: [
            {
                path: "/policlinicas",
                label: "Todas Policlínicas",
            },
            {
                path: "/policlinicas/cadastrar",
                label: "Cadastrar Policlínica",
            },
            {
                path: "/policlinicas/:id",
                label: "Detalhes da Policlínica",
                isVisible: false,
            },
        ],
    },
    {
        path: "/usuarios",
        label: "Usuários",
        icon: <UserOutlined />,
        requiredRoles: [ROLES.ADMIN],
        children: [
            {
                path: "/usuarios",
                label: "Todos Usuários",
            },
            {
                path: "/usuarios/cadastrar",
                label: "Cadastrar Usuário",
            },
            {
                path: "/usuarios/:id",
                label: "Detalhes do Usuário",
                isVisible: false,
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
