import type { CargoType } from "../modules/auth/schemas/auth.schemas";

export const ROLES = {
    ADMIN: "ADM" as const,
    MEDICO: "Medico" as const,
    ENFERMEIRO: "Enfermeiro" as const,
};

export const ROLE_GROUPS = {
    ALL_ROLES: [ROLES.ADMIN, ROLES.MEDICO, ROLES.ENFERMEIRO] as CargoType[],
    CLINICAL_STAFF: [ROLES.MEDICO, ROLES.ENFERMEIRO] as CargoType[],
    ADMIN_ONLY: [ROLES.ADMIN] as CargoType[],
};

export const checkPermission = (
    userCargo: CargoType | undefined,
    requiredRoles?: CargoType[],
): boolean => {
    if (!requiredRoles || requiredRoles.length === 0) return true;
    if (!userCargo) return false;
    return requiredRoles.includes(userCargo);
};

export const formatPermissionInfo = (
    hasAccess: boolean,
    roles?: CargoType[],
): string => {
    if (!roles || roles.length === 0) return "Acesso para todos";

    const roleString = roles.join(", ");
    return hasAccess
        ? `Acesso autorizado (${roleString})`
        : `Requer: ${roleString}`;
};
