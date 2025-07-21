import { getPostBySlug, getAllPosts } from '@/lib/posts';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link 
        href="/blog" 
        className="text-blue-600 hover:text-blue-800 mb-6 inline-block transition-colors"
      >
        ← Back to Blog
      </Link>
      
      <article className="prose prose-lg max-w-none">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="text-gray-600 mb-4">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            {!post.published && (
              <span className="ml-4 inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                Draft
              </span>
            )}
          </div>
        </header>
        
        <div className="prose max-w-none">
          {post.content && (
            <div 
              className="markdown-content"
              dangerouslySetInnerHTML={{ __html: formatMarkdownContent(post.content) }}
            />
          )}
        </div>
      </article>
    </div>
  );
}

// Simple markdown-to-HTML conversion for basic formatting
function formatMarkdownContent(content: string): string {
  return content
    // Bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic text
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Images
    .replace(/!\[([^\]]*)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto" />')
    // Links
    .replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800">$1</a>')
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br />')
    // Wrap in paragraphs
    .replace(/^(.+)$/gm, '<p>$1</p>')
    // Clean up multiple paragraph tags
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<img[^>]*>)<\/p>/g, '$1');
}

// Generate static params for static generation (optional)
export async function generateStaticParams() {
  const posts = getAllPosts();
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}