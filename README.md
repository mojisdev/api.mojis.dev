# api.mojis.dev

A RESTful API for accessing emoji data.

## 📦 Installation

```sh
git clone https://github.com/mojis-dev/api.mojis.dev.git
cd api.mojis.dev
pnpm install
```

## 🚀 Usage

```sh
pnpm run dev
```

> [!NOTE]
> This will copy the emoji data from [mojis/emoji-data](https://github.com/mojis-dev/emoji-data) to the `node_modules/.emoji-data` directory.
> If you want to update this, you can run `pnpm run copy:emoji-data`.

## 📖 API Documentation

The API documentation is available at [api.mojis.dev](https://api.mojis.dev) using Scalar.

## 🔧 Development

The project uses:

- [Hono](https://hono.dev/) for the web framework
- [Cloudflare Workers](https://workers.cloudflare.com/) for deployment
- [Vitest](https://vitest.dev/) for testing
- [Scalar](https://scalar.com/) for API documentation

## 📄 License

Published under [MIT License](./LICENSE).
