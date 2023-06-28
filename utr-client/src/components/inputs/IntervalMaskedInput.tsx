import InputMask from "react-input-mask";

export function IntervalMaskedInput(props: {
    value: string | undefined
    onValue(val: string): void
    onSubmit?(): void
    disabled?: boolean
}) {
    return (
        <InputMask mask="9:99.999" value={props.value} onChange={event => {
            props.onValue(event.currentTarget.value);
        }} className="max-w-sm h-8 px-2 border-2 rounded-md border-slate-200
        bg-slate-100 focus:outline-none focus:border-blue-400 disabled:opacity-50"
                   onKeyDown={event => {
                       if (event.code === "Enter" && props.onSubmit) {
                           props.onSubmit();
                       }
                   }} disabled={props.disabled}>
        </InputMask>
    );
}
