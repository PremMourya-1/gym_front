function LoaderSpiner({ hw = 20, color }) {
  return (
    <div
      style={{ height: hw, width: hw }}
      className={` ${color && "color"} spiner m-auto`}
    ></div>
  );
}

export default LoaderSpiner;
