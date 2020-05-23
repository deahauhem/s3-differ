import express from "express";
import process from "process";
import listObjects from "./listObjects";
import listVersions from "./listVersions";
import getObject from "./getObject";

const app = express()
const port = process.env.PORT ?? 3000;

app.use(express.static("public"));

app.get('/api/bucket/:bucket/prefix/:prefix/list', listObjects)
app.get('/api/bucket/:bucket/object/:id/versions', listVersions)
app.get('/api/bucket/:bucket/object/:id/version/:version', getObject)

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))