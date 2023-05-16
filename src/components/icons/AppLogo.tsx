import {ReactComponent as Logo} from "../../assets/utr_logo.svg";

export function AppLogo(props: {
    scale?: number
    className?: string
}) {
    return (
        <Logo style={{
            transform: `scale(${props.scale}%)`
        }} className={props.className}/>
    );
}
