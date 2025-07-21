import fs from 'fs';
import path from 'path';

export interface Post {
  title: string;
  date: string;
  published: boolean;
  slug: string;
  content?: string;
}

export function getAllPosts(): Post[] {
  const postsDirectory = path.join(process.cwd(), '_posts');
  const posts: Post[] = [];

  function readPostsFromDirectory(dir: string): void {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Recursively read subdirectories
        readPostsFromDirectory(fullPath);
      } else if (item.endsWith('.md')) {
        try {
          const fileContent = fs.readFileSync(fullPath, 'utf8');
          const post = parseMarkdownFile(fileContent, item, false);
          if (post) {
            posts.push(post);
          }
        } catch (error) {
          console.error(`Error reading file ${fullPath}:`, error);
        }
      }
    }
  }

  if (fs.existsSync(postsDirectory)) {
    readPostsFromDirectory(postsDirectory);
  }

  // Sort posts by date (newest first)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post | null {
  const postsDirectory = path.join(process.cwd(), '_posts');
  
  function findPostFile(dir: string, targetSlug: string): string | null {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        const found = findPostFile(fullPath, targetSlug);
        if (found) return found;
      } else if (item.endsWith('.md')) {
        const fileSlug = item.replace(/\.md$/, '');
        if (fileSlug === targetSlug) {
          return fullPath;
        }
      }
    }
    return null;
  }

  if (!fs.existsSync(postsDirectory)) {
    return null;
  }

  const filePath = findPostFile(postsDirectory, slug);
  if (!filePath) {
    return null;
  }

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return parseMarkdownFile(fileContent, path.basename(filePath), true);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
}

function parseMarkdownFile(content: string, filename: string, includeContent: boolean = false): Post | null {
  // Extract frontmatter
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return null;
  }

  const frontmatter = match[1];
  const lines = frontmatter.split('\n');
  const metadata: Record<string, string | boolean> = {};

  for (const line of lines) {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim();
      metadata[key.trim()] = value;
    }
  }

  // Create slug from filename
  const slug = filename.replace(/\.md$/, '');

  // Extract content after frontmatter if requested
  let postContent = '';
  if (includeContent) {
    const contentMatch = content.match(/^---[\s\S]*?---\s*([\s\S]*)$/);
    postContent = contentMatch ? contentMatch[1].trim() : '';
  }

  const post: Post = {
    title: (metadata.title as string) || 'Untitled',
    date: (metadata.date as string) || '',
    published: metadata.published === 'true' || metadata.published === true,
    slug
  };

  if (includeContent) {
    post.content = postContent;
  }

  return post;
}
