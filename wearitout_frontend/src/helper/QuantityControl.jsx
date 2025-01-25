import React, { useState } from 'react';
import useDebounce from './useDebounce';

const QuantityControl = ({ initialQuantity = 1, onUpdate }) => {
    const [quantity, setQuantity] = useState(initialQuantity);
    const debouncedQuantity = useDebounce(quantity, 2000); // Debounce 2 giây

    const incrementQuantity = () => setQuantity(quantity + 1);
    const decrementQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : quantity);

    // Gọi callback `onUpdate` khi `debouncedQuantity` thay đổi
    React.useEffect(() => {
        if (debouncedQuantity !== initialQuantity) {
            onUpdate(debouncedQuantity);
        }
    }, [debouncedQuantity, onUpdate, initialQuantity]);

    return (
        <div className="d-flex rounded-4 overflow-hidden">
            <button
                type="button"
                onClick={decrementQuantity}
                className="quantity__minus border border-end border-gray-100 flex-shrink-0 h-48 w-48 text-neutral-600 flex-center hover-bg-main-600 hover-text-white"
            >
                <i className="ph ph-minus" />
            </button>
            <input
                type="number"
                className="quantity__input flex-grow-1 border border-gray-100 border-start-0 border-end-0 text-center w-32 px-4"
                value={quantity}
                min={1}
                readOnly
            />
            <button
                type="button"
                onClick={incrementQuantity}
                className="quantity__plus border border-end border-gray-100 flex-shrink-0 h-48 w-48 text-neutral-600 flex-center hover-bg-main-600 hover-text-white"
            >
                <i className="ph ph-plus" />
            </button>
        </div>
    );
};

export default QuantityControl;
