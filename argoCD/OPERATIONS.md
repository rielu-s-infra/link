# ArgoCD / Traefik Ingress 運用メモ

## EntryPoint 方針

- `argoCD/ingress.yaml` の `IngressRoute` は **`websecure` (HTTPS) のみ**を使用する。
- `web` (HTTP:80) は公開しない。

## 補足

- HTTP→HTTPS リダイレクト運用に切り替える場合は、以下を事前に実施すること。
  1. MicroK8s ノードで IPv6 の 80/443 公開可否を確認する。
  2. Traefik Ingress Controller に明示的な HTTP→HTTPS リダイレクト設定を追加する。
  3. 運用ドキュメントへ「外部公開ポート（IPv6）」と「証明書更新経路」を追記する。
  4. クラスタ初期構築手順に上記設定を組み込む。
