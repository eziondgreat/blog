require('dotenv').config();
const { supabase } = require('./db');

const initialPosts = [
  {
    title: "The Neo-Brutalist Revival: Why We're Tired of 'Clean' Design",
    content: "For years, the digital landscape was dominated by a singular, sterile aesthetic. Soft shadows, pastel gradients, and an obsession with rounded corners turned the web into a giant cushion. But as the generation born in the scroll comes of age, a new visual language is emerging—one that values authenticity over perfection and friction over flow.\n\nNeo-Brutalist design is not just about harsh lines and bold primary colors; it is active defiance against the tech corporate \"sameness\" that has plagued modern visual interfaces for the last decade. It borrows the utilitarian, honest spirit of the architectural design movement—displaying the structural materials and the raw truth of the workspace directly to the user.\n\nDesigners are now intentionally breaking the rigid layout grid. Subtle rotations (like -1deg), hard black shadows with zero blur, and a color palette that screams for attention are no longer considered amateur mistakes. Instead, they are valuable tools of active engagement to anchor visual hierarchy.",
    status: 'Published',
    category: 'Culture',
    audience: 'PRO',
    tags: ['Design', 'Brutalist', 'Aesthetics'],
    author: 'Marcus Vibe',
    date: 'June 3, 2026',
    read_time: '8 min read',
    views: 9841,
    ad_clicks: 142,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNZoHP6SAeJ0b__btm2KSt-fe2eGObSxX7xd3f5QC73wYdETwovc6xw1H7BBK_xZC7dFURXKda-CCtcxf7g8OcjywkNl8O2hrI-6DiYR2sdR6MgyH9y9nZHylXy7PynlSvmwQAK4mrDj-CEI4R3HeyVL0qFpKqsjp9P58LuqYQGVk8r_Fog731XxrB01Pb2I6_chIfciWQOFM7PnHE_741p7rvd-Bbq8n1o4s5is-LUM6vR4FYX7L2O2uLmbrzca7XSpTvhhbL46g'
  },
  {
    title: 'The Algorithmic Mirror: How AI Shapes Our Identity',
    content: "Every scroll, click, and pause is scrutinized by a high-velocity feedback loop. Algorithms don’t just learn what we like—they shape our self-perception and construct the mirrors through which we view our digital identities.\n\nAt the core of personalized recommendation engines is an active system that predicts our visual and psychological preferences. This loop creates a subtle but powerful feedback friction. When user interfaces feel too slick, we lose our sense of boundary. By introducing clear grid layouts, visible borders, and authentic text representations, we can re-establish digital agency in an AI-driven ecosystem.",
    status: 'Published',
    category: 'Tech',
    audience: 'PRO',
    tags: ['AI', 'Tech', 'Aesthetics'],
    author: 'Dr. Alex Rivera',
    date: 'May 28, 2026',
    read_time: '5 min read',
    views: 5824,
    ad_clicks: 84,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Retro-Tech: Why Gen-Z is Buying Wired Headphones Again',
    content: "Wired headphones aren’t just a convenient accessory; they’re an active declaration of presence. In a world of wireless convenience and invisible telemetry, gen-Z is returning to physical cords and tactile dials to reclaim their physical space.\n\nThis trend highlights a larger, industry-wide craving for friction. In software, we see a parallel shift away from the overly polished, flat corporate styles toward tactile Neo-Brutalism. Users want to feel the materials, see the grid lines, and interact with widgets that have real physical weight and distinct offsets.",
    status: 'Published',
    category: 'Culture',
    audience: 'STUDENT',
    tags: ['Culture', 'Wired', 'Retro'],
    author: 'Chloe Vance',
    date: 'May 24, 2026',
    read_time: '8 min read',
    views: 3415,
    ad_clicks: 56,
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'The Invisible Economy of Memecoins',
    content: "Financial assets are no longer bound by traditional math alone; today, they are driven by attention loops and cultural narrative multipliers. Memecoins represent the absolute financialization of internet subcultures, where memes become liquid equity.\n\nBeneath the volatile price action lies a sophisticated social design. Community-driven tokens use gamified high-contrast dashboards and memetic loops to keep users deeply active. This fast-paced digital engagement shows how design dictates modern liquidity, turning simple viral aesthetics into a multi-billion dollar invisible economy.",
    status: 'Published',
    category: 'Finance',
    audience: 'EXEC',
    tags: ['Finance', 'Tokens', 'Crypto'],
    author: 'Marcus Sterling',
    date: 'June 1, 2026',
    read_time: '12 min read',
    views: 7922,
    ad_clicks: 210,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Designing for the Dopamine Loop',
    content: "UX design is a balance of expectation and reward. By implementing variable rewards—the digital equivalent of a slot machine—modern mobile applications build highly addictive cycles designed to maximize retention at all costs.\n\nHowever, ethical design guidelines challenge us to construct high-performance, non-coercive systems. Using solid, honest layouts, readable typography (like Inter and JetBrains Mono), and clear information hierarchies, we can respect the reader’s cognitive load while still delivering an elegant, engaging experience on high-density touchscreen devices.",
    status: 'Published',
    category: 'Tech',
    audience: 'PRO',
    tags: ['UX', 'Dopamine', 'Design'],
    author: 'Sarah Chen',
    date: 'May 18, 2026',
    read_time: '4 min read',
    views: 4531,
    ad_clicks: 92,
    image: 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'The Sound of the Future: AI Vocals',
    content: "From generated pop idols to virtual voice synthesizers, AI-generated vocals are actively restructuring the music creation pipelines. They enable bedroom producers to collaborate with virtual legends and generate flawless vocal tracks overnight.\n\nThis shift raises deep questions about creative ownership and authenticity in design. In both audio and visual arts, the blend of artificial intelligence and human agency is forming a new hybrid style. By embracing industrial, bold neo-brutalist structural templates, artists are framing AI content within reliable, human-styled visual stages.",
    status: 'Published',
    category: 'Culture',
    audience: 'STUDENT',
    tags: ['AI', 'Vocals', 'Music'],
    author: 'Elena Rostova',
    date: 'May 12, 2026',
    read_time: '6 min read',
    views: 2903,
    ad_clicks: 34,
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80'
  }
];

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[-\s]+/g, '-');
};

async function seedData() {
  console.log('Seeding blog data...');

  try {
    // 1. Check if posts already exist
    const { data: existingPosts } = await supabase.from('posts').select('id, slug');
    
    let dbPosts = [];
    if (existingPosts && existingPosts.length > 0) {
      console.log('Posts already exist in the database. Skipping post seeding.');
      dbPosts = existingPosts;
    } else {
      console.log('Inserting default blog posts...');
      const postsToInsert = initialPosts.map(p => ({
        ...p,
        slug: generateSlug(p.title)
      }));

      const { data: insertedPosts, error: postErr } = await supabase
        .from('posts')
        .insert(postsToInsert)
        .select('id, slug');

      if (postErr) throw postErr;
      dbPosts = insertedPosts;
      console.log(`Inserted ${dbPosts.length} posts successfully.`);
    }

    // 2. Check if slides already exist
    const { data: existingSlides } = await supabase.from('slides').select('id');
    
    if (existingSlides && existingSlides.length > 0) {
      console.log('Hero slides already exist. Skipping slide seeding.');
    } else {
      console.log('Inserting default hero slides linked to posts...');
      
      // Match slide 1 to Post 1 (The Neo-Brutalist Revival...)
      const p1 = dbPosts.find(p => p.slug.startsWith('the-neo-brutalist-revival'));
      // Match slide 2 to Post 2 (The Algorithmic Mirror...)
      const p2 = dbPosts.find(p => p.slug.startsWith('the-algorithmic-mirror'));

      const slidesToInsert = [
        {
          badge: 'Trending Now',
          headline: 'REDEFINING THE DIGITAL NARRATIVE.',
          highlight_word: 'DIGITAL',
          description: 'Explore the intersection of high-velocity Gen-Z aesthetics and deep-dive technical analysis.',
          button_text: 'Start Reading',
          gradient_from: '#00b4b2',
          gradient_via: '#05c484',
          gradient_to: '#7dd749',
          link_post_id: p1 ? p1.id : '1'
        },
        {
          badge: 'AI Revolution',
          headline: 'MASTERING THE ALGORITHMIC LANDSCAPE.',
          highlight_word: 'ALGORITHMIC',
          description: 'Understand how machine learning and responsive interfaces are building the new digital canvas.',
          button_text: 'Analyze Future',
          gradient_from: '#a90097',
          gradient_via: '#7928ca',
          gradient_to: '#00d2ff',
          link_post_id: p2 ? p2.id : '2'
        }
      ];

      const { error: slideErr } = await supabase.from('slides').insert(slidesToInsert);
      if (slideErr) throw slideErr;
      
      console.log('Inserted hero slides successfully.');
    }

    // 3. Insert some default comments for Post 1
    const { data: existingComments } = await supabase.from('comments').select('id');
    if (existingComments && existingComments.length > 0) {
      console.log('Comments already exist. Skipping comment seeding.');
    } else {
      const p1 = dbPosts.find(p => p.slug.startsWith('the-neo-brutalist-revival'));
      if (p1) {
        console.log('Inserting default comments...');
        const commentsToInsert = [
          {
            post_id: p1.id,
            author: '@DESIGN_GURU',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
            time: '2 hours ago',
            text: 'This perspective on friction is exactly what the industry needs. We have optimized the soul out of the modern web database. Everything is too smooth!'
          },
          {
            post_id: p1.id,
            author: '@PIXEL_CHAMP',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
            time: '5 hours ago',
            text: 'Brutalist grids force you to think about layout and structures rather than blending everything in a container shadow cushion.'
          },
          {
            post_id: p1.id,
            author: '@KATE_CODES',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
            time: 'Yesterday',
            text: 'JetBrains Mono as a UI font is bold but incredibly legible. Friction over flow is the ultimate design philosophy for 2026.'
          }
        ];
        const { error: cmtErr } = await supabase.from('comments').insert(commentsToInsert);
        if (cmtErr) throw cmtErr;
        console.log('Inserted default comments successfully.');
      }
    }

    console.log('\nData seeding completed successfully!');
  } catch (err) {
    console.error('\nError seeding data:', err.message || err);
    process.exit(1);
  }
}

seedData();
