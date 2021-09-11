import React from "react";

const isArray = (obj) => typeof obj === "array";

const hasElementInArray = (object) => {
  try {
    return isArray(object) && object.length > 0;
  } catch (e) {
    console.log("has element in array error: ", e);
    return false;
  }
};

export const mapReactChildren = (children, toModifyChildren) => {
  if (hasElementInArray(children)) {
    return React.Children.map(children, (child) => {
      if (child) {
        return toModifyChildren(child);
      }
    });
  }
  return toModifyChildren(children);
};

export const MapChildren = (children, toModifyChildren) => {
  try {
    if (hasElementInArray(children)) {
      return children.map((child) => {
        if (child) {
          return toModifyChildren(child);
        }
      });
    }
  } catch (e) {
    console.log("map children error", e);
    return children;
  }
};

export const ComponentWrapper =
  (toModifyChildren) =>
  ({ children, ...props }) => {
    try {
      const updatedChildren = mapReactChildren(children, toModifyChildren);
      return <div {...props}>{updatedChildren}</div>;
    } catch (e) {
      console.log("wrap component error:", e);
      return <div {...props}>{children}</div>;
    }
  };

const setChildToReadOnly = (child) => {
  if (child.props) {
    if (child.props.name) {
      const { children, ...nextPorps } = child.props;
      return (
        <child.type
          {...nextPorps}
          readOnly={true}
          disabled={true}
          className={"form-readonly"}
        >
          {children}
        </child.type>
      );
    } else if (child.props.children) {
      const { props } = child;
      const { children, ...newProps } = props;

      return (
        <child.type {...newProps}>
          {isArray(children)
            ? mapReactChildren(children, setChildToReadOnly)
            : setChildToReadOnly(children)}
        </child.type>
      );
    }
  }
  return child;
};

export const ReadOnlyWrapper = ComponentWrapper(setChildToReadOnly);
