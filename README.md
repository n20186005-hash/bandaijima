# みなと日和 — ピアBandai 旅行网站

以新潟市万代岛「みなとのマルシェ ピアBandai」为主题的日语单语景点网站。项目采用日系杂志式排版，将海港、市场绿白棚布、新潟米白、港湾深蓝与朱红印章元素组合成完整视觉系统。

## 技术结构

- Astro 7，静态生成（SSG）
- Tailwind CSS 4，通过 Vite 插件加载
- TypeScript 严格模式
- pnpm
- Cloudflare Workers Static Assets
- 无数据库、无登录、无 CMS、无服务端 API
- Google Analytics 4：`G-HXM22WWPKP`
- 图片全部保存于 `public/images/`，页面加载不依赖外部图床

Cloudflare 部署使用 `wrangler.jsonc` 的 `assets.directory = "./dist"`。这是纯静态站，因此不需要 SSR adapter，也不需要 Worker `main` 入口。

## 页面

| 路径 | 内容 |
|---|---|
| `/` | 首页、首访推荐、用餐筛选、购物、交通、半日路线 |
| `/gourmet/` | 寿司、海鲜丼、牡蛎、拉面、新潟米、咖啡 |
| `/shopping/` | 鲜鱼、新潟米、农产、地酒、伴手礼与保冷建议 |
| `/hours/` | 各店营业时间的阅读方式和当日确认顺序 |
| `/access/` | 步行、公交、自驾、停车、佐渡汽船与机场衔接 |
| `/course/` | 60 分钟、2 小时、半日、乘船前路线生成器 |
| `/faq/` | 13 个常见问题和 FAQ 结构化数据 |
| `/about/` | 非官方定位、编辑方针、技术说明 |
| `/privacy/` | GA4、Cookie、外部通信与隐私政策 |
| `/credits/` | 真实照片的作者、许可与原始来源 |
| `/404.html` | Cloudflare Workers 自定义 404 页面 |
| `/robots.txt` | 根据配置域名动态生成 |
| `/site.webmanifest` | Web App Manifest |

## 本地运行

需要 Node.js 22.12 或更高版本。

```bash
corepack enable
pnpm install
pnpm dev
```

开发服务器默认运行在 Astro 提示的本地地址。

## 构建

```bash
pnpm build
pnpm preview
```

构建输出目录为：

```text
dist/
```

## 部署到 Cloudflare Workers

首次部署前登录 Cloudflare：

```bash
pnpm dlx wrangler login
```

构建并部署：

```bash
pnpm deploy
```

也可以分开执行：

```bash
pnpm build
pnpm dlx wrangler deploy
```

`wrangler.jsonc` 已配置：

- 静态资源目录：`./dist`
- 自定义 404：`not_found_handling: "404-page"`
- Observability：启用
- 无 Worker 脚本入口

## 域名配置

默认公开地址仅存在于配置中，不会作为文字显示在页面正文或页脚。

默认值：

```text
https://Bandaijima.com
```

修改方式一：创建 `.env`：

```bash
cp .env.example .env
```

然后调整：

```env
PUBLIC_SITE_URL=https://your-domain.example
```

修改方式二：在 CI / Cloudflare 构建环境中设置 `PUBLIC_SITE_URL`。

该变量同时用于：

- canonical URL
- Open Graph URL 与图片地址
- JSON-LD
- sitemap
- robots.txt

## 内容更新位置

店铺数据：

```text
src/data/shops.ts
```

模型路线：

```text
src/data/courses.ts
```

站点名、地址、坐标、GA4 与域名：

```text
src/config/site.ts
```

全局视觉变量：

```text
src/styles/global.css
```

## 交互功能

### 用餐筛选器

`FoodFinder.astro` 根据以下条件在浏览器本地筛选：

- 预算
- 可用时间
- 是否避开生食
- 一人用餐
- 儿童同行
- 是否重视出餐速度

选择不会发送到服务器，也不会写入数据库或本地存储。

### 模型路线生成器

`CoursePlanner.astro` 在浏览器本地切换：

- 60 分钟
- 2 小时
- 半日
- 佐渡汽船乘船前 90 分钟

路线内容来自 `src/data/courses.ts`。

## 图片与许可

页面使用的 9 张图片均来自 Wikimedia Commons，并已转换为本地 WebP。作者、许可、原始文件页和修改说明见：

- `CREDITS.md`
- 网站页面 `/credits/`

不要删除图片署名页面。更换图片时，应同步更新两个位置。

## 上线前检查

1. 执行 `pnpm install && pnpm build`。
2. 检查 `dist/404.html`、`dist/robots.txt` 和 sitemap。
3. 使用正式域名构建，确认 canonical URL。
4. 在 GA4 Realtime 中确认测量 ID 收到访问。
5. 再次确认店铺营业、临时休业、公交和停车规则。
6. 核对照片署名与许可。
7. 在手机、平板和桌面宽度检查导航与筛选器。

更详细的数据更新清单见 `CONTENT_NOTES.md`，本次环境验证结果见 `VALIDATION.md`。
