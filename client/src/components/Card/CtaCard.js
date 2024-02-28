const CtaCard = ({ headline, text, cta }) => {
  return (
    <div className="card-cta">
      <div className="cta">
        <div className="cta__img">
          <img src="/img/logo-white.png" alt="Natours logo" />
        </div>
        <div className="cta__content">
          <h2 className="heading-secondary">{headline}</h2>
          <p className="cta__text">{text}</p>
        </div>
        <div>{cta}</div>
      </div>
    </div>
  );
};

export default CtaCard;
