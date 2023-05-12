export function TextInput(props: {
    value: string
    onValue(val: string): void
    password?: boolean
    placeholder?: string
    onSubmit?: () => void
}) {
    return (
        <input type={props.password ? "password" : "text"} value={props.value}
               className="max-w-sm h-8 px-2 border-2 rounded-md
               border-slate-200 bg-slate-100 focus:outline-none focus:border-sky-400"
               placeholder={props.placeholder}
               onChange={event => {
                   props.onValue(event.currentTarget.value);
               }}
               onKeyDown={event => {
                   if (event.code === "Enter" && props.onSubmit) {
                       props.onSubmit();
                   }
               }}/>
    );
}
