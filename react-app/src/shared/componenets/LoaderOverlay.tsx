import "../../App.css";
import loadingImg from "../../img/spinner-main.gif";

function LoaderOverlay({loading}: {loading: boolean}) {
  return (
    <>
      {loading && (
        <img className="contentCenter" src={loadingImg} alt="loading" />
      )}
    </>
  );
}

export default LoaderOverlay;
