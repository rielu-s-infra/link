# ステージ1: ビルド
FROM oven/bun:1 AS builder
WORKDIR /app
COPY . .
RUN bun install
# 型チェックを無視してビルド
RUN bun x vite build

# ステージ2: 実行（SPAとして配信）
FROM oven/bun:1 AS runner
WORKDIR /app
# Vite の出力先は 'dist'
COPY --from=builder /app/dist ./dist
# SPA配信用の簡易サーバー（または nginx 等）
RUN bun install -g serve
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]