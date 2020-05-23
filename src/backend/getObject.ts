import type { Request, Response } from "express";
import { S3 } from "aws-sdk";
const s3 = new S3({ region: "ap-southeast-2"});

export default async (request: Request, response: Response ) => {
    const getParams = {
        Bucket: request.params.bucket
    }

    const object = await s3.getObject({
        ...getParams,
        Key: request.params.id,
        VersionId: request.params.version
    }).promise();

    response.send(object.Body);
}