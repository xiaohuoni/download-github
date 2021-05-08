# download examples from github

```ts
import download from 'load-examples';

(async()=>{
  const temp = {
    name: "my-umi-app",
    url: "https://github.com/umijs/umi",
    path: "packages/create-umi-app/templates/AppGenerator",
  };
  const base = process.cwd;
  await download(base,tmpe);
})()
```