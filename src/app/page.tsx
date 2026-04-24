import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import * as Icons from 'lucide-react';
import mdContent from '../links.md?raw';

// postsフォルダ内のmdファイルをすべて読み込む
const postFiles = import.meta.glob('../posts/*.md', { query: '?raw', import: 'default' });

/**
 * リンクMarkdown行から情報を抽出する関数
 * 例: "- [GitHub](https://github.com/...) {icon: Github}"
 */
const parseLinkRow = (row: string) => {
  // 1. URLとラベルの抽出: [ラベル](URL)
  const linkRegex = /\[(.*?)\]\((.*?)\)/;
  const linkMatch = row.match(linkRegex);
  const label = linkMatch ? linkMatch[1] : '';
  const url = linkMatch ? linkMatch[2] : '#';

  // 2. アイコン名の抽出: {icon: アイコン名}
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

  // お知らせの読み込み
  useEffect(() => {
    const fetchPosts = async () => {
      const contents = await Promise.all(Object.values(postFiles).map(fn => fn()));
      setPosts(contents as string[]);
    };
    fetchPosts();
  }, []);

  // Markdownのパースとセクション分け
  const sections = mdContent.split('# ').filter(Boolean);
  
  const introduction = sections.find(s => s.startsWith('📢 自己紹介'))?.replace('📢 自己紹介', '').trim() || '';
  
  const avatarSection = sections.find(s => s.startsWith('🖼 プロフィール画像URL'));
  const avatarUrl = avatarSection?.split('\n').find(line => line.includes('/'))?.trim() || '';
  
  const linksSection = sections.find(s => s.startsWith('🔗 リンク')) || '';
  // リンクの行（リストアイテム）だけを抽出してパース
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
              <ReactMarkdown>{introduction}</ReactMarkdown>
            </div>
          </div>
        <footer className="footer">
            <p>© 2026 rielu</p>
        </footer>

          {/* お知らせセクション */}
          <div className="news-section">
            <h3 className="news-title">Recent Posts</h3>
            {posts.map((post, i) => (
              <div key={i} className="news-card">
                <ReactMarkdown>{post}</ReactMarkdown>
              </div>
            ))}
          </div>
        </div>

        {/* 右側：リンクタイル（ここをパース済みデータから生成） */}
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

      <style>{`
        /* * 全体のリセットと背景設定
         * 「両脇の線」の正体はここ（親コンポーネント）にあることが多いので、
         * ここで完全にリセットします。
         */
        :root {
          --bg: #030712; /* 超ダークグレー（ほぼ黒） */
          --card: #111827; /* ダークグレー */
          --card-hover: #1f293a;
          --accent: #3b82f6; /* 青 */
          --text: #ffffff;
          --text-dim: #94a3b8;
          --border: #1f2937;
        }

        /* 謎の線を消すための決定打 */
        body, html, #root { 
          margin: 0; 
          padding: 0; 
          background: var(--bg); 
          color: var(--text); 
          font-family: sans-serif; 
          border: none !important; 
          outline: none !important;
        }

        .fullscreen-container {
          min-height: 100vh;
          width: 100%;
          border: none;
        }

        .main-layout {
          display: flex;
          gap: 40px;
          max-width: 1000px;
          margin: 0 auto;
          padding: 80px 20px;
          align-items: start;
        }

        /* サイドバー（プロフィールとお知らせ） */
        .side-content { 
          width: 300px; 
          flex-shrink: 0; 
          position: sticky; 
          top: 80px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .profile-card { background: var(--card); padding: 30px; border-radius: 24px; text-align: center; border: 1px solid var(--border); }
        .avatar-wrapper { border-radius: 50%; padding: 4px; background: linear-gradient(to right, var(--accent), #a855f7); display: inline-block; margin-bottom: 20px; }
        .profile-avatar { width: 110px; height: 110px; border-radius: 50%; display: block; object-fit: cover; }
        .profile-text { font-size: 0.95rem; color: var(--text-dim); line-height: 1.6; }
        .profile-text p { margin-bottom: 8px; }

        .news-title { font-size: 0.85rem; color: var(--accent); margin-bottom: 12px; font-weight: bold; letter-spacing: 0.1em; text-transform: uppercase; }
        .news-card { background: var(--card); padding: 16px; border-radius: 16px; font-size: 0.85rem; color: var(--text-dim); border: 1px solid var(--border); border-left: 4px solid var(--accent); }
        .news-card h1 { font-size: 1rem; color: var(--text); margin-bottom: 4px; }

        /* リンクグリッド（タイル） */
        .links-grid { 
          flex-grow: 1;
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
          gap: 16px; 
        }

        .tile-item { 
          background: var(--card); 
          border: 1px solid var(--border);
          border-radius: 20px; 
          transition: 0.25s cubic-bezier(0.4, 0, 0.2, 1); 
          text-decoration: none; 
          color: inherit;
          display: block;
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
        .arrow { opacity: 0.2; transition: 0.2s; }
        .tile-item:hover .arrow { opacity: 1; transform: translate(3px, -3px); color: var(--accent); }

        /* モバイル対応 */
        @media (max-width: 850px) {
          .main-layout { flex-direction: column; padding: 40px 16px; gap: 20px; }
          .side-content { width: 100%; position: static; }
          .links-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}