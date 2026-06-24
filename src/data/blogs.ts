export interface BlogPost {
  _id: string;
  title: string;
  content: string;
  summary: string;
  header_image?: string;
  author: string;
  created_at: string;
  updated_at: string;
  published: boolean;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    _id: "community-learning-centers",
    title: "Building Community Learning Centers That Last",
    summary:
      "How local volunteers, teachers, and families helped us create steady spaces for children to learn and grow.",
    content: `
      <p>Strong communities are built through consistent support, trusted relationships, and access to opportunity. Our community learning centers were designed around those three ideas.</p>
      <p>Each center gives children a safe space to study, explore creativity, and receive mentorship beyond the classroom. We work closely with local families so the centers reflect real needs instead of assumptions.</p>
      <h2>What made the difference</h2>
      <p>Local ownership shaped the success of the program. Volunteers supported reading circles, teachers guided learning plans, and parents helped us keep attendance strong.</p>
      <blockquote>Lasting impact happens when communities help design the solution.</blockquote>
      <p>We continue refining the program with feedback from students and educators so it stays practical, welcoming, and sustainable.</p>
    `,
    header_image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
    author: "Jagatmitra Foundation",
    created_at: "2026-04-18T09:00:00.000Z",
    updated_at: "2026-04-18T09:00:00.000Z",
    published: true,
  },
  {
    _id: "women-led-livelihoods",
    title: "Women-Led Livelihoods Are Strengthening Entire Families",
    summary:
      "A closer look at the training, peer support, and confidence-building behind our livelihood initiatives.",
    content: `
      <p>Livelihood support is most effective when it goes beyond a one-time workshop. Our approach combines training, mentorship, and peer networks that help women keep moving forward.</p>
      <p>Participants build practical skills, learn to manage small business decisions, and gain confidence through shared progress with other women in their communities.</p>
      <h2>From training to momentum</h2>
      <ul>
        <li>Hands-on sessions focused on real local opportunities</li>
        <li>Support groups that encourage problem solving together</li>
        <li>Follow-up guidance after the initial training period</li>
      </ul>
      <p>When women have stronger economic stability, households become more resilient and children benefit too.</p>
    `,
    header_image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    author: "Field Program Team",
    created_at: "2026-03-07T10:30:00.000Z",
    updated_at: "2026-03-07T10:30:00.000Z",
    published: true,
  },
  {
    _id: "health-camps-on-ground",
    title: "What We Learned From Recent Health Camps on the Ground",
    summary:
      "Simple lessons from outreach camps that improved coordination, trust, and follow-up care.",
    content: `
      <p>Our recent health camps reinforced something important: access improves when outreach is organized around people’s daily realities.</p>
      <p>By coordinating with local leaders and volunteers, we were able to make camps easier to reach and more responsive to community concerns.</p>
      <h2>Three lessons we are carrying forward</h2>
      <ol>
        <li>Clear pre-camp communication increases participation.</li>
        <li>Local partnerships make follow-up far more effective.</li>
        <li>Trust grows when people feel heard, not processed.</li>
      </ol>
      <p>These lessons are shaping how we plan future health and welfare initiatives across the communities we serve.</p>
    `,
    header_image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
    author: "Outreach Team",
    created_at: "2026-01-22T08:15:00.000Z",
    updated_at: "2026-01-22T08:15:00.000Z",
    published: true,
  },
];

export const getPublishedBlogs = (): BlogPost[] =>
  BLOG_POSTS.filter((post) => post.published);

export const getBlogById = (id: string): BlogPost | undefined =>
  BLOG_POSTS.find((post) => post._id === id && post.published);
