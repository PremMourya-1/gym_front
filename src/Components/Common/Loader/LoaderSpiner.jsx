function LoaderSpiner({ hw = 16, className }) {
  return (
    <div
      style={{ height: hw, width: hw }}
      className={`spiner m-auto ${className} `}
    ></div>
  );
}

export default LoaderSpiner;
