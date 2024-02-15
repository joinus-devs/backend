import AWS from "aws-sdk";
import { Nullable } from "../types";

export type ContentCategory = "image";

const getContentType = (category: ContentCategory) => {
  switch (category) {
    case "image":
      return "image/jpeg";
  }
};

const bucket = "joinus";
const endpoint = new AWS.Endpoint("https://kr.object.ncloudstorage.com");

export interface IStorageService {
  upload: (category: "image", buffer: Buffer) => Promise<string>;
}

export class StorageService implements IStorageService {
  private static _instance: Nullable<StorageService> = null;
  private _storage: AWS.S3;

  private constructor() {
    this._storage = new AWS.S3({
      region: "kr-standard",
      endpoint: endpoint,
      credentials: {
        accessKeyId: process.env.NCLOUD_ACCESS_KEY!,
        secretAccessKey: process.env.NCLOUD_SECRET_KEY!,
      },
    });
  }

  static getInstance() {
    if (!this._instance) {
      this._instance = new StorageService();
    }

    return this._instance;
  }

  async upload(category: ContentCategory, buffer: Buffer) {
    try {
      await this._storage
        .putObject({
          Bucket: bucket,
          Key: `${category}/${Date.now()}.jpg`,
          ACL: "public-read",
          Body: buffer,
          ContentType: getContentType(category),
        })
        .promise();
    } catch (error) {
      console.log(error);
      throw error;
    }

    return `${endpoint.href}${bucket}/${category}/${Date.now()}.jpg`;
  }
}
