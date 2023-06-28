import {CommonChildrenOnlyProps} from "./common/CommonChildrenOnlyProps";
import {UserRole} from "../UserRole";

export interface ProtectedViewProps extends CommonChildrenOnlyProps {
    role?: UserRole;
}
