export function TextInput(props: {
    value: string
    onValue(val: string): void
    password?: boolean
    onSubmit?: () => void
}) {
    return (
        <input type={props.password ? "password" : "text"} value={props.value}
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
