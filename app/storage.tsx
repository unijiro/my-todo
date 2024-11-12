// app/storage.tsx
import supabase from "../utils/supabase";

type UploadStorage = {
  fileList: FileList; 
  bucketName: string;
};

type UploadPathname = {
  path: string;
};

export const uploadStorage = async ({
  fileList, // file から fileList に変更
  bucketName,
}: UploadStorage): Promise<UploadPathname> => {
  // fileList から File オブジェクトを取得
  const file = fileList[0]; // 先頭のファイルをアップロード

  const filePath = `pics_folder/${file.name}`; // ファイルパスを変更

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, { // 変更したファイルパスを使用
      cacheControl: "3600",
      upsert: false,
    });
  if (error) throw error;
  return {
    path: data?.path ?? "", // nullではなく空文字列を返す
  };
};