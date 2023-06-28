import {NumberInputProps} from "../../../types/componentProps/inputs/NumberInputProps";

export function NumberInput(props: NumberInputProps) {
    return (
        <input type="number" value={props.value} min={props.min} max={props.max}
               className="max-w-xs h-8 px-2 border-2 rounded-md
               border-slate-200 bg-slate-100 focus:outline-none focus:border-blue-400
               disabled:opacity-50"
               placeholder={props.placeholder} disabled={props.disabled}
               onChange={event => {
                   const val = parseInt(event.currentTarget.value);
                   const inRange = val >= (props.min ?? -Infinity) &&
                       val <= (props.max ?? Infinity);
                   if (!!val) {
                       if (inRange) {
                           props.onValue(val);
                       }
                   }
               }}
               onKeyDown={event => {
                   if (event.code === "Enter" && props.onSubmit) {
                       props.onSubmit();
                   } else if (!["ArrowUp", "ArrowDown"].includes(event.code)) {
                       event.preventDefault();
                   }
               }}/>
    );
}
