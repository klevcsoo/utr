import {ReactComponent as Logo} from "../../../assets/utr_logo.svg";

export interface AppLogoProps {
    scale?: number;
    className?: string;
}

export function AppLogo(props: AppLogoProps) {
    return (
        <Logo style={{
            transform: `scale(${props.scale}%)`
        }} className={props.className}/>
    );
}
