const useAuthLayout = () => {
  const runtimeConfig = useRuntimeConfig();
  const cloudName = runtimeConfig.public.cloudinaryCloudName;
  const folder = runtimeConfig.public.cloudinaryAuthPagesPath;
  const rand = Math.round(Math.random() * 13 + 1);
  const publicId = `${folder}/background${rand}`;

  const backgroundImage = reactive({
    fill: logoColor(publicId),
    image: `https://res.cloudinary.com/${cloudName}/image/upload/f_auto/${publicId}`,
  });

  return { backgroundImage };
};

export default useAuthLayout;
