function ChildComponent(props) {
  const { name, age } = props;
  return (
    <div>
      <p>Child Component</p>
      <p>
        My name is {name} and {age} years old.
      </p>
    </div>
  );
}

export default ChildComponent;
