interface CardBodyProps {
    title: string;
    text: string;
}

function CardBody({ title, text }: CardBodyProps) {
    return (
        <>
            <h5 className="card-title">{title}</h5>
            <p className="card-text">{text}</p>
            
        </>
    );
}

export default CardBody;