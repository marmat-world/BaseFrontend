import Minio from "minio";
import type { UploadedObjectInfo } from "minio";
import { getUploadConfig } from "@/api/other";

export const uploadFileWithMinio = (
  file: string,
  callBack: (err: Error, data: UploadedObjectInfo) => void
) => {
  getUploadConfig().then(res => {
    const minioClient = new Minio.Client({
      endPoint: "play.min.io",
      port: 9000,
      useSSL: true,
      accessKey: "",
      secretKey: ""
    });

    minioClient.makeBucket("europetrip", "us-east-1", err => {
      if (err) return console.log(err);

      const metaData = {
        "Content-Type": "application/octet-stream",
        "X-Amz-Meta-Testing": 1234,
        example: 5678
      };
      // Using fPutObject API upload your file to the bucket europetrip.
      minioClient.fPutObject(
        "europetrip",
        "photos-europe.tar",
        file,
        metaData,
        callBack
      );
    });
  });
};
