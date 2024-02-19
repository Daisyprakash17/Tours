const Form = ({ title, onSubmit, children }) => {
  return (
    <form className="form" onSubmit={onSubmit}>
      <h2 className="heading-secondary ma-bt-lg">{title}</h2>
      {children}
    </form>
  );
};

export default Form;
