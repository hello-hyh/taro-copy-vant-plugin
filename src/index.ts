const fs = require("fs");
const fse = require("fs-extra");
const path = require("path");
export default function (ctx = null, pluginOpts = { to: "", from: "" }) {
  let _from = pluginOpts.from
    ? pluginOpts.from
    : path.resolve(
        __dirname,
        "code/taro-copy-vant-plugin/test/components/vant-weapp/" // test path
      );
  let _to = pluginOpts.to
    ? pluginOpts.to
    : path.resolve(
        __dirname,
        "code/taro-copy-vant-plugin/dist/weapp/components/vant-weapp/" // test path
      );
  if (ctx?.onBuildStart) {
    ctx.onBuildStart(() => {
      try {
        fse.remove(_to).then(() => {
          copyVantWxsFile(_to, _from);
          copyRequiredFile(_to, _from);
        });
      } catch (error) {
        console.error(error);
      }
    });
  } else {
    console.error("请在Taro环境下使用");
  }
}
export function copyVantWxsFile(
  to,
  from,
  defaultFileName = "index",
  defaultFileExtName = "wxs"
) {
  const _fileName = `${defaultFileName}.${defaultFileExtName}`;
  fs.readdir(from, (err, files) => {
    files.forEach((dirName) => {
      const from_path = path.join(path.join(from, dirName), _fileName);
      const to_path = path.join(path.join(to, dirName), _fileName);
      fs.promises
        .access(from_path)
        .then(() => {
          fse.mkdirs(path.join(to, dirName)).then(() => {
            fse.copy(from_path, to_path, (err) => {
              if (err) throw err;
            });
          });
        })
        .catch((err) => {});
    });
  });
}
export function copyRequiredFile(to, from) {
  const fromWxsPath = path.join(from, "wxs");
  const fromCommonStylePath = path.join(from, "common/style");
  const toWxsPath = path.join(to, "wxs");
  const toCommonStylePath = path.join(to, "common/style");
  fse.mkdirs(toWxsPath).then(() => {
    fs.promises.readdir(fromWxsPath).then((files) => {
      for (const fName of files) {
        fse.copy(path.join(fromWxsPath, fName), path.join(toWxsPath, fName));
      }
    });
  });
  fse.mkdirs(toCommonStylePath).then(() => {
    fse.copy(fromCommonStylePath, toCommonStylePath);
  });
}
