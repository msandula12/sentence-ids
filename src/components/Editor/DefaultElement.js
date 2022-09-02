import "./DefaultElement.css";

const DefaultElement = ({ attributes, children }) => {
  return (
    <p className="DefaultElement" {...attributes}>
      {children}
    </p>
  );
};

export default DefaultElement;
