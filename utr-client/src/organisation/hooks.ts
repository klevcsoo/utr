import {useContext} from "react";
import {OrganisationContext} from "./index";

export function useOrganisationFromContext() {
    return useContext(OrganisationContext);
}
