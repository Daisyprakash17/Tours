import Button from '../Button/Button';

const Submit = (props) => {
  const { submitText } = props;
  return (
    <div className="form__group">
      <Button color={'green'} value={submitText} />
    </div>
  );
};

export default Submit;
