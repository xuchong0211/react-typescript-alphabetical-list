import React, {
  PropsWithChildren,
  ReactElement,
  useMemo
} from "react";
import List, {DataAlphabetType, DataType} from "./List";

const assignFirst = (list: DataType []) : DataAlphabetType[] => {
  const obj: AnyObject = {};
  const sorted = list.sort((a: DataType, b: DataType) => {
    if (a.name > b.name) {
      return 1;
    }
    if (b.name > a.name) {
      return -1;
    }
    return 0;
  });
  const result = sorted.map((item) => {
    let first = false;
    const firstChar = item.name.slice(0, 1);
    if (obj[firstChar]) {
      first = false;
    } else {
      first = true;
      obj[firstChar] = true;
    }
    return { ...item, first };
  });
  return [{ name:"#", first:true }, ...result, { name:"*", first:true }];
};

export default ({ data, indexTopOffset, children }: { data: any[], children: ReactElement, indexTopOffset? : number } ) => {

  indexTopOffset = indexTopOffset === undefined ? 0 : indexTopOffset;
  const list = useMemo(() => assignFirst(data), []);
  //todo throw exception if children is an array.
  const item = useMemo(() => (props: PropsWithChildren<AnyObject>) => {
    const childProps = children?.props || {};
    return <children.type {...{...props, ...childProps}}/>;
  }, []);
  return <List data={list} item={item} topOffset={indexTopOffset}/>;
};
