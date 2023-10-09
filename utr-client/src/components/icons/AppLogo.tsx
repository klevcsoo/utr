import {ReactComponent as Logo} from "../../assets/utr_logo.svg";
import {AppLogoProps} from "../../types/componentProps/icons/AppLogoProps";

export default function AppLogo(props: AppLogoProps) {
    return (
        <Logo style={{
            transform: `scale(${props.scale}%)`
        }} className={props.className}/>
    );
}
