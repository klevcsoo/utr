export function NumberInput(props: {
    value: number
    onValue(value: number): void
    placeholder?: string
    min?: number
    max?: number
    onSubmit?(): void
}) {
    return (
        <input type="number" value={props.value} min={props.min} max={props.max}
               className="max-w-sm h-8 px-2 border-2 rounded-md
               border-slate-200 bg-slate-100 focus:outline-none focus:border-blue-400"
               placeholder={props.placeholder}
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