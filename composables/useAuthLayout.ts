import cld from '@/lib/cloudinary';
import { logoColor } from '@/helpers';

const useAuthLayout = async  () => {
  const fetchImage = async () => {
    const rand = Math.round(Math.random() * (14 - 1) + 1);
    const newImage = cld.image(`${import.meta.env.VITE_CLOUDINARY_AUTH_PAGES_PATH}/background${rand}`);
    return {
      image: newImage.format('auto')
        .toURL(),
      fill: logoColor(newImage),
    };
  };

  const backgroundImage = reactive(await fetchImage());

  return { backgroundImage };
};

export default useAuthLayout;