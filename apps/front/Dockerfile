FROM node:22-alpine AS build
WORKDIR /repo

COPY package.json package-lock.json ./
COPY apps/front/package.json apps/front/package.json
COPY packages/eslint-config/package.json packages/eslint-config/package.json
COPY packages/typescript-config/package.json packages/typescript-config/package.json
RUN npm ci

COPY packages packages
COPY apps/front apps/front

ARG VITE_API_END_POINT
ENV VITE_API_END_POINT=$VITE_API_END_POINT

RUN npx --workspace=front vite build

FROM node:22-alpine
WORKDIR /app

COPY --from=build /repo/apps/front/package.json ./package.json
COPY --from=build /repo/apps/front/vite.config.ts ./vite.config.ts
COPY --from=build /repo/apps/front/dist ./dist
RUN npm install --no-save vite

EXPOSE 4173
CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "4173"]
