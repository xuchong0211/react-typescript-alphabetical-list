import person from "./person";

export const getPersons = () => {
  return (person as AnyObject[]).map((item) => {
    return {
      name: item.name as string,
      data: item,
    };
  });
};
