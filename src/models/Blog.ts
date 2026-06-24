// models/Blog.js
import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true,
    trim: true
  },
  header_image: {
    type: String,
    default: ''
  },
  header_image_public_id: {
    type: String,
    default: ''
  },
  author: {
    type: String,
    required: true,
    default: 'Jagatmitra Foundation'
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  published: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Helper function to generate slug
function generateSlug(title: string) {
  if (!title) return '';
  
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

// Generate slug before validation
BlogSchema.pre('validate', function(next) {
  console.log('Pre-validate hook triggered. Current slug:', this.slug, 'Title:', this.title);
  
  // Always generate slug if we have a title (even if slug exists, to ensure consistency)
  if (this.title) {
    const generatedSlug = generateSlug(this.title);
    
    // Only set the slug if it's not already provided or if the generated one is better
    if (!this.slug || this.slug === undefined) {
      this.slug = generatedSlug || `blog-${Date.now()}`;
      console.log('Generated slug:', this.slug);
    }
  } else if (!this.slug) {
    // Fallback if no title and no slug
    this.slug = `blog-${Date.now()}`;
    console.log('Fallback slug generated:', this.slug);
  }
  
  next();
});

// Handle duplicate slugs
BlogSchema.pre('save', async function(next) {
  if (this.isNew && this.slug) {
    const existingBlog = await mongoose.models.Blog.findOne({ slug: this.slug });
    if (existingBlog) {
      // Append timestamp to make it unique
      this.slug = `${this.slug}-${Date.now()}`;
      console.log('Duplicate slug found, new slug:', this.slug);
    }
  }
  next();
});

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);