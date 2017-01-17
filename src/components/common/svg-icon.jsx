const iconSVGData = require('../../../public/imgs/icons/svg/index.js');

const IconSVG = (props) => (
  <svg
      className={ props.className }
      viewBox="0 0 72 72"
      width={ props.width }
      height={ props.height }
  >
      { props.title && <title id="title">{ props.title }</title>}
      <g dangerouslySetInnerHTML={ { __html: iconSVGData[props.name] } } />
  </svg>
);
