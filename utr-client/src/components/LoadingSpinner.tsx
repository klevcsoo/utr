import {LoadingSpinnerProps} from "../types/componentProps/LoadingSpinnerProps";

export function LoadingSpinner(props: LoadingSpinnerProps) {
    return (
        <div className="lds-spinner" style={{
            transform: `scale(${props.scale ?? 100}%)`
        }}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
}
