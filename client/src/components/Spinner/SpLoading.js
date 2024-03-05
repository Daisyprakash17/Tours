const SpLoading = ({ centered }) => {
  return (
    <div className={`spinner${centered ? ' centered' : ''}`}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default SpLoading;
