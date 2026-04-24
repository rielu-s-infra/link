import ReactMarkdown from 'react-markdown';
import * as Icons from 'lucide-react';
import rawLinks from './links.md?raw'; // Viteの機能でMDを文字列として読み込む

// アイコンを動的に取得するためのヘルパー
const IconRenderer = ({ name }: { name: string }) => {
  const LucideIcon = (Icons as any)[name];
  return LucideIcon ? <LucideIcon size={20} /> : <Icons.Link size={20} />;
};

function App() {
  return (
    <div className="container">
      <ReactMarkdown
        components={{
          // リストアイテムの表示をカスタマイズ
          li: ({ children }) => {
            // children[0] がテキスト（例: "Github {icon: Github}"）
            const content = children?.toString() || "";
            const iconMatch = content.match(/\{icon:\s*(\w+)\}/);
            const iconName = iconMatch ? iconMatch[1] : null;
            const cleanText = content.replace(/\{icon:\s*\w+\}/, "").trim();

            return (
              <div className="link-card">
                {iconName && <IconRenderer name={iconName} />}
                <span>{cleanText}</span>
              </div>
            );
          },
          // リンク自体の挙動（aタグ）をカード全体に適用したい場合などはここで調整
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="full-link">
              {children}
            </a>
          ),
        }}
      >
        {rawLinks}
      </ReactMarkdown>

      <style>{`
        .container { max-width: 500px; margin: 40px auto; font-family: sans-serif; }
        .link-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          margin: 10px 0;
          border: 1px solid #eaeaea;
          border-radius: 12px;
          transition: transform 0.2s;
        }
        .link-card:hover { transform: translateY(-2px); background: #fafafa; }
        .full-link { text-decoration: none; color: #333; font-weight: bold; }
        ul { list-style: none; padding: 0; }
      `}</style>
    </div>
  );
}

export default App;