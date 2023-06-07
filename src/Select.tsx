import { useEffect, useState, useRef } from "react";
import classes from "./Select.module.css";

//types
export type SelectOption = {
    value: string | number;
    label: string;
};
type SingleSelectProps = {
    multiple?: false;
    value?: SelectOption;
    onChange: (value: SelectOption | undefined) => void;
};
type MultipleSelectProps = {
    multiple: true;
    value: SelectOption[];
    onChange: (value: SelectOption[]) => void;
};
type SelectProps = {
    options: SelectOption[];
} & (SingleSelectProps | MultipleSelectProps);

const Select = ({ multiple, value, onChange, options }: SelectProps) => {
    // state
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    //utility functions
    const isOptionSelected = (option: SelectOption) => {
        return multiple ? value.includes(option) : option === value;
    };

    const clearOptions = () => {
        multiple ? onChange([]) : onChange(undefined);
    };

    const selectOption = (option: SelectOption) => {
        if (multiple) {
            if (value.includes(option)) {
                onChange(value.filter((o) => o !== option));
            } else {
                onChange([...value, option]);
            }
        } else {
            if (option !== value) onChange(option);
        }
    };

    //useEffect
    useEffect(() => {
        if (isOpen) setHighlightedIndex(0);
    }, [isOpen]);

    // Custom keyboard event handler
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.target !== containerRef.current) return;
            switch (e.code) {
                case "Enter":
                case "Space":
                    setIsOpen((prev) => !prev);
                    if (isOpen) selectOption(options[highlightedIndex]);
                    break;
                case "ArrowUp":
                case "ArrowDown": {
                    if (!isOpen) {
                        setIsOpen(true);
                        break;
                    }
                    const newValue =
                        highlightedIndex + (e.code === "ArrowDown" ? 1 : -1);
                    if (newValue >= 0 && newValue < options.length) {
                        setHighlightedIndex(newValue);
                    }
                    break;
                }
                case "Escape":
                    setIsOpen(false);
                    break;
            }
        };
        containerRef.current?.addEventListener("keydown", handler);
        return () => {
            containerRef.current?.removeEventListener("keydown", handler);
        };
    }, [isOpen, highlightedIndex, options]);

    return (
        <div
            ref={containerRef}
            onBlur={() => setIsOpen(false)}
            onClick={() => setIsOpen((prev) => !prev)}
            tabIndex={0}
            className={classes.container}
        >
            <span className={classes.value}>
                {multiple
                    ? value.map((v) => (
                          <button
                              className={classes["option-badge"]}
                              onClick={(e) => {
                                  e.stopPropagation(), selectOption(v);
                              }}
                              key={v.value}
                          >
                              {v.label}
                              <span className={classes["remove-btn"]}>
                                  &times;
                              </span>
                          </button>
                      ))
                    : value?.label}
            </span>
            <button
                onClick={(e) => {
                    e.stopPropagation(), clearOptions();
                }}
                className={classes["clear-btn"]}
            >
                &times;
            </button>
            <div className={classes.divider}></div>
            <div className={classes.caret}></div>
            <ul className={`${classes.options} ${isOpen ? classes.show : ""}`}>
                {options.map((option, index) => (
                    <li
                        onClick={(e) => (
                            e.stopPropagation(),
                            selectOption(option),
                            setIsOpen(false)
                        )}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        key={option.value}
                        className={`${classes.option} ${
                            isOptionSelected(option) ? classes.selected : ""
                        } ${
                            index === highlightedIndex
                                ? classes.highlighted
                                : ""
                        }
                        }`}
                    >
                        {option.label}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Select;
