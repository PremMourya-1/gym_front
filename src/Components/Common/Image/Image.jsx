import { COMMON_IMAGE_URL } from "../../../Service/service";

function Image({ className, url, alt, defaultClass = true, dynamic = true }) {
  return (
    <img
      className={`${className} ${
        defaultClass && "h-full w-full object-cover"
      } `}
      src={dynamic ? `${COMMON_IMAGE_URL}${url}` : url}
      alt={alt}
    />
  );
}

export default Image;
