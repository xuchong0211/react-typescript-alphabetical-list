import React, {FC, PropsWithChildren, useMemo} from "react";
import List, {DataAlphabetType, DataType} from "./List";

export const SampleItem = ({ item }: { item: DataType }) => {
  return (
    <div className="item" key={item.id}>
      <div>{item.name}</div>
      <div>{item.description}</div>
    </div>
  );
};


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
  return sorted.map((item) => {
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
};

export default ({ data, children }: PropsWithChildren<{ data: any[] }>) => {
  const list = useMemo(() => assignFirst(data), []);
  return <List data={list} item={children as FC} />;
};
