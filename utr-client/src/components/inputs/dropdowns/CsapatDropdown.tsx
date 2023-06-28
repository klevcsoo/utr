import {GenericDropdown} from "./GenericDropdown";
import {useCsapatokList} from "../../../hooks/csapatok/useCsapatokList";
import {LoadingSpinner} from "../../LoadingSpinner";
import {useMemo} from "react";
import {CommonDropdownProps} from "../../../types/componentProps/common/CommonDropdownProps";

export function CsapatDropdown(props: CommonDropdownProps<number>) {
    const [csapatok, loadingCsapatok] = useCsapatokList();

    const options = useMemo<{ [id: string]: string }>(() => {
        const out: { [id: string]: string } = {
            "NaN": "-"
        };

        csapatok.forEach(value => {
            out[String(value.id)] = value.nev;
        });

        return out;
    }, [csapatok]);

    return loadingCsapatok || !csapatok ? (
        <LoadingSpinner scale={30}/>
    ) : (
        <GenericDropdown options={options}
                         selected={String(props.selected)}
                         onSelect={value => {
                             props.onSelect(parseInt(value));
                         }}/>
    );
}
