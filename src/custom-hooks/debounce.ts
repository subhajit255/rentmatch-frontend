import { useEffect, useState } from "react"

const useDebounce = (value = '', delay = 500) => {
    const [debouncevalue, setDebounceValue] = useState('');

    useEffect(() => {
        const handler = setTimeout(async () => {
            if (value === '') {
                setDebounceValue('');
                return;
            }
            setDebounceValue(value)
        }, delay);

        return () => {
            clearTimeout(handler)
        }
    }, [value]);

    return debouncevalue
}

export default useDebounce;