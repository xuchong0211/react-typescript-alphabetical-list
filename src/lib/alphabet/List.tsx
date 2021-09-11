import React, { FC, useRef, useState } from "react";
import "./style.css";

const charStr = "*ABCDEFGHIJKLMNOPQRSTUVWXYZ#";
const boxClientTop = 0;

export interface DataType {
  id: string;
  name: string;
  [key: string]: any;
}

export interface DataAlphabetType extends DataType{
  first: boolean;
  [key: string]: any;
}

const List = (props: { data: DataAlphabetType[]; item: FC<{ item: AnyObject }> }) => {
  const [isTouching, setIsTouching] = useState(false);
  const [lastChar, setLastChar] = useState("A");
  const charBarRef = useRef(null);
  const countryListRef = useRef(null);

  const getChar = (clientY: number) => {
    const charHeight = charBarRef.current.offsetHeight / charStr.length;
    const index = Math.floor((clientY - boxClientTop) / charHeight);
    return charStr[index];
  };

  const gotoChar = (char: string) => {
    if (char === lastChar) {
      return false;
    }
    setLastChar(char);
    if (char === "*") {
      // @ts-ignore
      countryListRef.current.scrollTop = 0;
    } else if (char === "#") {
      // @ts-ignore
      countryListRef.current.scrollTop = countryListRef.current.scrollHeight;
    }
    const target = document.querySelector('[data-key="' + char + '"]');
    if (target) {
      target.scrollIntoView();
    }
  };

  const touchStart = (e: any) => {
    setIsTouching(true);
    const char = getChar(e.touches[0].clientY);
    gotoChar(char);
  };

  const touchMove = (e: any) => {
    // e.preventDefault();
    const char = getChar(e.touches[0].clientY);
    gotoChar(char);
  };

  const touchEnd = (e: any) => {
    // e.preventDefault();
    setIsTouching(false);
  };

  const Component = props.item;

  return (
    <div className="alphabet-list">
      <div className="alphabet-list-border" ref={countryListRef}>
        {props.data.map((item, index) => {
          const { first, ...rest } = item;
          return (
            <div key={"list_" + index}>
              {item.first && <div data-key={item.name.slice(0, 1)}></div>}
              <Component item={rest} />
            </div>
          );
        })}
        <div className="char-list-border">
          <ul
            className="char-list"
            ref={charBarRef}
            onTouchStart={touchStart}
            onTouchMove={touchMove}
            onTouchEnd={touchEnd}
          >
            {charStr.split("").map((char, index) => {
              return (
                <li className="char-item" key={index}>
                  {char}
                </li>
              );
            })}
          </ul>
        </div>
        {isTouching && <div className="char-tip">{lastChar}</div>}
      </div>
    </div>
  );
};

export default List;
