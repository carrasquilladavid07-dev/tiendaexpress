import type { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

function Card({ children }: Props) {
    return (
        <div className="card" style={{ width: "18rem" }}>
            <div className="card-body">
                {children}
            </div>
        </div>
    );
}

export default Card;