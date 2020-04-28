import React, {RefObject, useEffect, useRef} from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    minWidth?: number;
    maxWidth?: number;
    width?: number;
    value: string,
    inputRef?: RefObject<HTMLInputElement>,
}

export const Input: React.FC<InputProps> = (
    {
        minWidth = 60, width, maxWidth = 600, value,
        inputRef = React.createRef<HTMLInputElement>(), style, className,
        ...inputAttributes
    }) => {

    let trackerRef = useInputSizeTracker(inputRef, inputAttributes.placeholder, maxWidth, minWidth);
    let classNames = className ? `inputBox--input ${className}` : 'inputBox--input';

    return <div style={{display: 'inline-block'}}>
        <input style={{boxSizing: "content-box", ...style}} className={classNames} {...inputAttributes} ref={inputRef} value={value}/>
        <span style={{whiteSpace: 'pre', position: 'absolute', visibility: 'hidden', height: 0}}
              ref={trackerRef}>{value}</span>
    </div>
};

export const useInputSizeTracker = (inputRef: RefObject<HTMLInputElement>, placeholder: string | undefined, maxWidth: number, minWidth: number) => {
    const placeholderWidth = useRef(0);
    const trackerRef: React.RefObject<HTMLElement> = useRef(null);

    useEffect(() => {
        let input = inputRef?.current;
        let tracker = trackerRef.current;
        if (input && tracker) {
            let computedStyle = getComputedStyle(input);
            for (let key of ['font-size', 'font-family', 'font-weight', 'font-style', 'letter-spacing', 'text-transform']) {
                tracker.style.setProperty(key, computedStyle.getPropertyValue(key), computedStyle.getPropertyPriority(key));
            }

            if (placeholder) {
                tracker.innerText = placeholder;
                placeholderWidth.current = tracker.offsetWidth;
            }
        }
    }, []);

    useEffect(() => {
        if (inputRef?.current) {
            let placeHolderWidth = placeholderWidth.current;
            let trackerWidth = trackerRef?.current?.offsetWidth || 0;
            let width = Math.min(maxWidth, Math.max(trackerWidth, placeHolderWidth, minWidth)) + 10;
            inputRef.current.style.width = `${width}px`;
        }
    });

    return trackerRef;
}