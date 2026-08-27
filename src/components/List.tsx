import { useState } from "react";

interface Props {
    data: string[];
    onSelect?: (item: string) => void;
}

function List({ data, onSelect }: Props) {

    const [index, setIndex] = useState(-1);

    const handleClick = (item: string, i: number) => {
        setIndex(i);
        onSelect?.(item);
    };

    return (
        <ul className="list-group">
            {data.map((item, i) => (
                <li
                    key={i}
                    className={
                        index === i
                            ? "list-group-item active"
                            : "list-group-item"
                    }
                    onClick={() => handleClick(item, i)}
                >
                    {item}
                </li>
            ))}
        </ul>
    );
}

export default List;