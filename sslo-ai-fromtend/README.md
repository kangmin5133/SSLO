# AI 중기청 연구 개발 과제 Frontend

### Dependencies download

```bash
npm i
```

### For development

```bash
npm run start -> craco start

"start": "craco --max-old-space-size=8192 start" (dev)
"start": "react-scripts start" (not used)
"build": "react-scripts build" (not used)
"test": "react-scripts test" (not used)
"serve": "HOST=0.0.0.0 craco --max-old-space-size=8192 start"

PORT=8000 npm run serve (Port 지정)
```

### Dev environment / Requirements

- React
- Craco (Custom configure webpack)
- Typescript
- react-router-dom
- Redux (state management tool)
- axios (fetch rest api)
- React Query (Fetch data module)
- react-hook-form (Form third-party)
- Chakra UI (Design library)
- Opencv.js (Image Processing)
- TensorFlow.js (Image Processing)
- Reaviz (visual charts) refer link -> (https://reaviz.io/)

### Chakra UI workaround

- Chakra UI는 기본 스타일링을 탑재하고 있어서, css folder에 있는 css file을 사용하면 기존 스타일이 약간 깨질 수 있음
  따라서 사용하고자 하는 화면에만 Chakra UI를 사용하고 스타일을 따로 정리해야함

### Setup opencv.js

craco 세팅 변경 -> craco.config.js
craco에서 webpack config를 overriding 필요.
따라서, craco-webpack-resolve라는 모듈을 설치하고 아래와 같이 작업

```js
const webpack = require("webpack");
const webpackResolve = require("craco-webpack-resolve");

module.exports = {
  plugins: [
    {
      plugin: require("craco-plugin-scoped-css"),
    },
    {
      plugin: webpackResolve,
      options: {
        resolve: {
          fallback: {
            crypto: require.resolve("crypto-browserify"),
            path: require.resolve("path-browserify"),
            buffer: require.resolve("buffer/"),
            stream: require.resolve("stream-browserify"),
            fs: false,
          },
        },
      },
    },
  ],
};
```

```bash
npm i crypto-browserify --save
npm i path-browserify --save
npm i stream-browserify --save
npm i buffer --save
npm i craco-webpack-resolve --save
export NODE_OPTIONS="--max-old-space-size=8192" (opencvjs를 사용하기 위해서 반드시 해줘야하는 command)
```

### React Query

- 데이터 Fetching을 위해 사용하는 Third-patry, 기존 방식처럼 useEffect()를 사용해서도 구현가능하다만, 더 사용하기 간단하고 편함.
  이 모듈의 많은 장점 중 뚜렷한 장점은 캐싱이 자동으로 가능
- https://tanstack.com/query/v4/docs/overview

```bash
installed

npm i @tanstack/react-query
```
