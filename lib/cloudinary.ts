import { Cloudinary } from '@cloudinary/url-gen';
import type { Database, Tables } from '@/types';


// export const cld = new Cloudinary({
//   cloud: { cloudName: runtimeConfig.public.CLOUDINARY_CLOUD_NAME as string },
//   url: { secure: true },
// });

export const buildImageSrc = (url: string) => {
  if (!url) return undefined;

  const runtimeConfig = useRuntimeConfig();
  const cloudName = runtimeConfig.public.CLOUDINARY_CLOUD_NAME as string;
  return `https://res.cloudinary.com/${cloudName}/image/upload/${url}`;
};

export const searchExistingImages = async (image: string) => {
  // return await cloudinary.v2.search.expression(`public_id:${image}`)
  //   .max_results(1)
  //   .execute();
};

export const destroyExisting = async (user: Tables<'profiles'>) => {
  const supabase = useSupabaseClient<Database>();
  // destroy in cloudinary
  if (user.image) {
    // await cloudinary.v2.uploader.destroy(
    //   user.image,
    //   (destroyError: UploadApiErrorResponse, destroyResult: UploadApiResponse) => {
    //     console.log(
    //       '***** Cloudinary: deleting existing avatar: ',
    //       destroyResult,
    //       destroyError,
    //     );
    //   },
    // );
  }

  return await supabase
    .from('profiles')
    .update({ image: null })
    .eq('id', user.id)
    .select()
    .single();
};

export const fetchAuthImages = async () => {
  // const res = await cloudinary.v2.api.resources({
  //   resource_type: 'image',
  //   max_results: 12,
  //   prefix: 'gear_closet/auth_pages',
  //   type: 'upload',
  //   transformation: [
  //     { fetch_format: 'auto' },
  //   ],
  // });

  // if (res?.resources) {
  //   return res.resources.map((image: any) => {
  //     const img = cld.image(image.public_id);
  //     return img.resize(Resize.scale()
  //       .width(500))
  //       .toURL();
  //   });
  // }
  // return [];
};

interface UploadInterface {
  id: string;
  file: string | File;
}
export const upload = async (input: UploadInterface) => {
  // return await cloudinary.v2.uploader.upload(
  //   input.file as string,
  //   {
  //     resource_type: 'auto',
  //     folder: import.meta.env.NUXT_CLOUDINARY_AVATARS_PATH,
  //     context: `user_id=${input.id}`,
  //   },
  //   async (uploadError: UploadApiErrorResponse | undefined, uploadResult: UploadApiResponse | undefined) => {
  //     console.log('***** Cloudinary: uploading new avatar: ', uploadResult, uploadError);

  //     if (uploadError || !uploadResult) {
  //       return { message: 'Error uploading new image to Cloudinary', path: undefined };
  //     }

  //     // update user with new image public_id
  //     const { error: updatedUserError } = await supabase
  //       .from('users')
  //       .update({ image: uploadResult.public_id })
  //       .eq('id', input.id)
  //       .select()
  //       .single();

  //     if (updatedUserError) {
  //       return { message: 'Error updating user avatar', path: 'updateAvatar: upload new image' };
  //     }
  //   },
  // );
};
