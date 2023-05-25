export function LoadingSpinner(props: {
    scale?: number
}) {
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
