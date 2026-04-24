import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import * as Icons from 'lucide-react';
import mdContent from '../links.md?raw';
import aboutMd from '../about.md?raw'; // 追加: 自己紹介専用ファイル

const postFiles = import.meta.glob('../posts/*.md', { query: '?raw', import: 'default' });

const parseLinkRow = (row: string) => {
  const linkRegex = /\[(.*?)\]\((.*?)\)/;
  const linkMatch = row.match(linkRegex);
  const label = linkMatch ? linkMatch[1] : '';
  const url = linkMatch ? linkMatch[2] : '#';

  const iconRegex = /\{icon:\s*(\w+)\}/;
  const iconMatch = row.match(iconRegex);
  const iconName = iconMatch ? iconMatch[1] : '';

  return { label, url, iconName };
};

const IconRenderer = ({ name }: { name: string }) => {
  const LucideIcon = (Icons as any)[name] || Icons.Link2;
  return <LucideIcon size={22} strokeWidth={2} />;
};

export default function Page() {
  const [posts, setPosts] = useState<string[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const contents = await Promise.all(Object.values(postFiles).map(fn => fn()));
      setPosts(contents as string[]);
    };
    fetchPosts();
  }, []);

  // links.mdからは画像URLとリンクだけを抽出する
  const sections = mdContent.split(/#\s+/).filter(Boolean);
  
  const avatarSection = sections.find(s => s.includes('プロフィール画像'));
  const avatarUrl = avatarSection?.split('\n').find(line => line.includes('http'))?.trim() || '';
  
  const linksSection = sections.find(s => s.includes('リンク')) || '';
  const linkRows = linksSection.split('\n').filter(line => line.trim().startsWith('- '));
  const parsedLinks = linkRows.map(row => parseLinkRow(row));

  return (
    <div className="fullscreen-container">
      <div className="main-layout">
        {/* 左側：プロフィールとお知らせ */}
        <div className="side-content">
          <div className="profile-card">
            <div className="avatar-wrapper">
              <img src={avatarUrl} alt="Profile" className="profile-avatar" />
            </div>
            <div className="profile-text">
              {/* about.md の中身を直接表示 */}
              <ReactMarkdown>{aboutMd}</ReactMarkdown>
            </div>
          </div>

          <div className="news-section">
            <h3 className="news-title">Recent Posts</h3>
            {posts.map((post, i) => (
              <div key={i} className="news-card">
                <ReactMarkdown>{post}</ReactMarkdown>
              </div>
            ))}
          </div>
        </div>

        {/* 右側：リンクタイル */}
        <div className="links-grid">
          {parsedLinks.map((link, i) => (
            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="tile-item">
              <div className="tile-content">
                <div className="icon-box"><IconRenderer name={link.iconName} /></div>
                <span className="tile-label">{link.label}</span>
                <Icons.ArrowUpRight size={18} className="arrow" />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* フッターはレイアウトの外側に配置 */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} rielu</p>
      </footer>

      <style>{`
        :root {
          --bg: #030712;
          --card: #111827;
          --card-hover: #1f293a;
          --accent: #3b82f6;
          --text: #ffffff;
          --text-dim: #94a3b8;
          --border: #1f2937;
        }

        body, html, #root { 
          margin: 0; 
          padding: 0; 
          background: var(--bg); 
          color: var(--text); 
          font-family: sans-serif;
        }

        .fullscreen-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .main-layout {
          display: flex;
          gap: 40px;
          max-width: 1200px; /* ← 1000pxから1200pxへ広げる */
          margin: 0 auto;
          padding: 80px 24px;
          align-items: start;
          width: 100%; /* ← 追加 */
        }

        .side-content { 
          width: 300px; 
          flex-shrink: 0; 
          position: sticky; 
          top: 80px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .avatar-wrapper { 
          width: 110px; 
          height: 110px; 
          border-radius: 50%; 
          padding: 4px; 
          background: linear-gradient(to right, var(--accent), #a855f7); 
          display: flex; /* 中央寄せ */
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px; /* 中央配置と下の余白 */
          overflow: hidden; /* はみ出しを絶対に許さない */
          flex-shrink: 0; /* 潰されるのも防ぐ */
        }

        /* 画像本体：親の100%に合わせる */
        .profile-avatar { 
          width: 100% !important; 
          height: 100% !important; 
          border-radius: 50%; 
          object-fit: cover; /* 縦横比を維持して切り抜く */
          display: block;
        }

        /* プロフィールカード自体の重なり防止 */
        .profile-card { 
          position: relative;
          z-index: 10;
          background: var(--card); 
          padding: 30px 20px; 
          border-radius: 24px; 
          border: 1px solid var(--border);
          overflow: hidden; /* カードからもはみ出させない */
        }

        /* Markdown内のpタグに変な余白がつかないようにする */
        .profile-text p { 
          margin: 0;
          color: #e2e8f0; /* 少し明るめの色にして視認性を上げる */
        }
        .news-title { font-size: 0.85rem; color: var(--accent); margin-bottom: 12px; font-weight: bold; letter-spacing: 0.1em; text-transform: uppercase; }
        .news-card { background: var(--card); padding: 16px; border-radius: 16px; font-size: 0.85rem; color: var(--text-dim); border: 1px solid var(--border); border-left: 4px solid var(--accent); margin-bottom: 12px; }

        .links-grid { 
          flex-grow: 1; /* 残りのスペースを全部使う */
          display: grid; 
          /* ここが重要：タイルの幅を少し狭めて(240px)、自動で横に並べる */
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); 
          gap: 16px; 
        }

        .tile-item { 
          background: var(--card); 
          border: 1px solid var(--border);
          border-radius: 20px; 
          transition: 0.25s cubic-bezier(0.4, 0, 0.2, 1); 
          text-decoration: none; 
          color: inherit;
        }

        .tile-item:hover { 
          transform: translateY(-5px); 
          border-color: var(--accent); 
          background: var(--card-hover); 
          box-shadow: 0 10px 20px -5px rgba(0,0,0,0.3);
        }
        
        .tile-content { display: flex; align-items: center; gap: 20px; padding: 24px; }
        .icon-box { color: var(--accent); display: flex; align-items: center; }
        .tile-label { flex: 1; font-weight: bold; font-size: 1.05rem; }
        .arrow { opacity: 0.2; }

        .footer {
          text-align: center;
          padding: 40px 20px;
          color: var(--text-dim);
          font-size: 0.85rem;
          border-top: 1px solid var(--border);
          background: var(--bg);
        }

        @media (max-width: 850px) {
          .main-layout { flex-direction: column; padding: 40px 16px; }
          .side-content { width: 100%; position: static; }
          .links-grid { grid-template-columns: 1fr; width: 100%; }
        }
      `}</style>
    </div>
  );
}