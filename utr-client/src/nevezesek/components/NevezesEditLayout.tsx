import {DataEditComponentProps} from "../../utils/types";
import {NevezesEditData} from "../types";
import {CsapatSelect} from "../../csapatok/components/CsapatSelect";
import {UszoSelect} from "../../uszok/components/UszoSelect";
import {IntervalMaskedInput} from "./IntervalMaskedInput";
import {useTranslation} from "../../translations/hooks";

export function NevezesEditLayout(props: DataEditComponentProps<NevezesEditData>) {
    const t = useTranslation();

    return (
        <div className="grid grid-cols-2 gap-4">
            <CsapatSelect selected={props.data.csapatId}
                          onSelect={id => {
                              props.onData({...props.data, csapatId: id, uszoId: undefined});
                          }}/>
            <UszoSelect csapatId={props.data.csapatId} selected={props.data.uszoId}
                        onSelect={id => props.onData({...props.data, uszoId: id})}
                        disabled={!props.data.csapatId}/>
            {!!props.data.uszoId ? (
                <IntervalMaskedInput value={props.data.nevezesiIdo}
                                     onValue={val => props.onData({
                                         ...props.data,
                                         nevezesiIdo: val
                                     })}
                                     label={t("generic_label.nevezesi_ido")}/>
            ) : null}
        </div>
    );
}
