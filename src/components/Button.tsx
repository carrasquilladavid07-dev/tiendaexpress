interface Props {
    children: string;
    onClick?: () => void;
    color?: string;
    disabled?: boolean;
}

function Button({
    children,
    onClick,
    color = "primary",
    disabled = false,
}: Props) {
    return (
        <button
            className={`btn btn-${color} me-2`}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
}

export default Button;