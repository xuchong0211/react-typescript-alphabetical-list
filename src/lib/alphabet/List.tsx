import React, {FC, useMemo, useRef, useState} from "react";
import "./style.css";

export interface PropsInterface {
  data: DataAlphabetType[];
  renderItem: FC<{ item: AnyObject }>;
  topOffset :number;
}

export interface DataType {
  name: string;
  [key: string]: any;
}

export interface DataAlphabetType extends DataType{
  first: boolean;
  [key: string]: any;
}

const List = (props: PropsInterface) => {
  const {topOffset = 0} = props;
  const [isTouching, setIsTouching] = useState<boolean>(false);
  const [lastChar, setLastChar] = useState<string>("A");
  const charStr = useMemo(() => {
    console.log("calculate char index");
    const charStr = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ*";
    return charStr;
  }, [props.data]);
  const charBarRef = useRef(null);
  const countryListRef = useRef(null);

  const getChar = (clientY: number) => {

    // @ts-ignore
    const charHeight = charBarRef.current.offsetHeight / charStr.length;
    const index = Math.floor((clientY - topOffset) / charHeight);
    return charStr[index];
  };

  const gotoChar = (char: string) => {
    // console.log("char 1111111111111111111111111", char);
    if (char === lastChar) {
      return false;
    }
    setLastChar(char);

    if (char === "#") {
      // @ts-ignore
      countryListRef.current.scrollTop = 0;
    } else if (char === "*") {
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
    e.preventDefault();
    const char = getChar(e.touches[0].clientY);
    gotoChar(char);
  };

  const touchEnd = (e: any) => {
    e.preventDefault();
    setIsTouching(false);
  };

  const ItemComponent = props.renderItem;

  return (
    <div className="alphabet-list">
      <div className="alphabet-list-border" ref={countryListRef}>
        {props.data.map((item, index) => {
          const { first, ...rest } = item;
          const { name } = rest;
          const divProps : any = {key : "alphabet_list_" + index};
          if (item.first) {
            divProps["data-key"] = item.name.slice(0, 1);
          }
          return (
            <div {...divProps}>
              {
                (name === "#" ) ? null : (name === "*" ) ? null :
                    <ItemComponent item={rest} />
              }
            </div>
          );
        })}
        <div className="char-list-border" style={{paddingTop: topOffset}}>
          <ul
            className="char-list"
            ref={charBarRef}
            onTouchStart={touchStart}
            onTouchMove={touchMove}
            onTouchEnd={touchEnd}
          >
            {charStr.split("").map((char, index) => {
              return (
                <li className="char-item" key={"alphabet_list_char_"+index}>
                  {char === "*" ? "..." : char}
                </li>
              );
            })}
          </ul>
        </div>
        {isTouching && <div className="char-tip">{lastChar === "*" ? "..." : lastChar}</div>}
      </div>
    </div>
  );
};

export default List;
