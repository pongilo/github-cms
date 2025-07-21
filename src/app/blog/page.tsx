import { getAllPosts } from '@/lib/posts';
import Link from 'next/link';

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      
      {posts.length === 0 ? (
        <p className="text-gray-600">No posts found.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <article key={post.slug} className="border-b border-gray-200 pb-4">
              <h2 className="text-xl font-semibold">
                <Link 
                  href={`/blog/${post.slug}`}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              {!post.published && (
                <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mt-2">
                  Draft
                </span>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}