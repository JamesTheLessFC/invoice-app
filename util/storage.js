import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  projectId: process.env.GOOGLE_PROJECTID,
  credentials: {
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
  },
});
const bucketName = process.env.GCS_BUCKET_NAME;
const invoiceBucket = storage.bucket(bucketName);

export const uploadFile = (doc, fileName) =>
  new Promise((resolve, reject) => {
    const file = invoiceBucket.file(fileName);
    doc.pipe(
      file
        .createWriteStream({
          metadata: {
            contentType: "application/pdf",
            cacheControl: "public, max-age=0",
            contentDisposition: `attachment; filename=${fileName};`,
          },
          resumable: false,
          public: true,
          predefinedAcl: "publicRead",
        })
        .on("error", function (err) {
          console.error(err);
          reject({
            name: "PDF Upload Error",
            message: `Unable to upload ${fileName}`,
          });
        })
        .on("finish", function () {
          console.log("PDF uploaded!");
          resolve(file.publicUrl());
        })
    );
  });

export const deleteFile = async (fileName) => {
  try {
    const file = invoiceBucket.file(fileName);
    await file.delete({
      ignoreNotFound: true,
    });
    console.log("PDF deleted!");
  } catch (err) {
    console.error(err);
    throw {
      name: "PDF Delete Error",
      message: `Unable to delete ${fileName}`,
    };
  }
};
