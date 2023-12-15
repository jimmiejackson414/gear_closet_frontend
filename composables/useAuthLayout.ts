import { Cloudinary } from '@cloudinary/url-gen';
import { logoColor } from '@/helpers';

const useAuthLayout = async  () => {
  const runtimeConfig = useRuntimeConfig();
  const cloudName = runtimeConfig.public.cloudinaryCloudName;

  const cld = new Cloudinary({
    cloud: { cloudName },
    url: { secure: true },
  });

  const fetchImage = async () => {
    const rand = Math.round(Math.random() * (14 - 1) + 1);
    const newImage = cld.image(`${runtimeConfig.public.cloudinaryAuthPagesPath}/background${rand}`);
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